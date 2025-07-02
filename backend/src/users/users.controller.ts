import {
  Body,
  Controller,
  Delete, Param, Patch,
  Post,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  @Post()
  async registerUser(@Body() registerUserDto: CreateUserDto) {
    try {
      const existUser = await this.userModel.findOne({
        email: registerUserDto.email,
      });

      if (existUser) {
        throw new UnprocessableEntityException();
      }

      const user = new this.userModel({
        email: registerUserDto.email,
        password: registerUserDto.password,
        displayName: registerUserDto.displayName,
        role: registerUserDto.role,
      });

      user.generateToken();
      return await user.save();
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(err); // 422
      }

      throw err;
    }
  }

  @UseGuards(TokenAuthGuard)
  @Delete('sessions')
  async logout(@Req() req: Request) {
    const headerValue = req.get('Authorization');
    const successMessage = { message: 'Успешная операция!' };

    if (!headerValue) {
      throw new UnprocessableEntityException();
    }

    const [_bearer, token] = headerValue.split(' ');

    if (!token) {
      throw new UnprocessableEntityException();
    }

    const user = await this.userModel.findOne({ token });

    if (!user) {
      throw new UnprocessableEntityException();
    }

    user.generateToken();
    await user.save();

    return successMessage;
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard)
  @Patch('sessions/:id')
  async editUser(@Param('id') id: string) {
    const userFind = await this.userModel.findById(id);
    if (!userFind) {
      throw new UnprocessableEntityException();
    }
    const editUserProfile = await this.userModel.findByIdAndUpdate(
      id,
      userFind,
    );
    return {
      message: 'User data updated successfully',
      editUserProfile,
    };
  }
}
