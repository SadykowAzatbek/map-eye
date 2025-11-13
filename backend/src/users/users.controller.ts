import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterStorage } from '../config/multer.config';

interface UserRequest extends Request {
  user: {
    _id: ObjectId;
    role: string;
  };
}

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
  @Put('sessions/update')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createMulterStorage('./public/uploads/users'),
    }),
  )
  async editUser(
    @Req() req: UserRequest,
    @Body() userDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userToUpdate = await this.userModel.findById(req.user?._id);
    if (!userToUpdate) {
      throw new UnprocessableEntityException();
    }
    Object.assign(userToUpdate, userDto); // копирование свойства одного объекта в другой
    await userToUpdate.save();

    return {
      message: 'User data updated successfully',
      user: {
        _id: userToUpdate._id,
        email: userToUpdate.email,
        displayName: userToUpdate.displayName,
        role: userToUpdate.role,
        image: file ? '/uploads/users/' + file.filename : null,
        token: userToUpdate.token,
      },
    };
  }
}
