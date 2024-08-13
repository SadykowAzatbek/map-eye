import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Institution,
  InstitutionDocument,
} from '../schemas/institution.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { CreateInstitutionsDto } from './create-institutions.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Request } from 'express';
import { PermitGuard } from '../auth/permit.guard';
import { Roles } from '../auth/roles.decorator';

interface UserRequest extends Request {
  user: {
    _id: ObjectId;
    role: string;
  };
}

@Controller('institutions')
export class InstitutionsController {
  constructor(
    @InjectModel(Institution.name)
    private institutionModel: Model<InstitutionDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/institutions',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createInstitutions(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: UserRequest,
    @Body() institutionDto: CreateInstitutionsDto,
  ) {
    try {
      const institution = new this.institutionModel({
        userId: req.user?._id,
        name: institutionDto.name,
        description: institutionDto.description,
        image: file ? '/uploads/institutions/' + file.filename : null,
        schedule: institutionDto.schedule,
        rating: institutionDto.rating,
        approved: institutionDto.approved,
      });
      await institution.save();
      return institution;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(err);
      }

      throw err;
    }
  }

  @Get()
  async getInstitutions() {
    return this.institutionModel.find();
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  async deleteInstitution(@Req() req: UserRequest, @Param('id') id: string) {
    const institution = await this.institutionModel.findById(id);

    if (!institution) {
      throw new UnprocessableEntityException('Institution not found');
    }

    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'super' &&
      institution.userId.toString() !== req.user._id.toString()
    ) {
      throw new UnauthorizedException();
    }

    const deleteIns = await this.institutionModel.findByIdAndDelete(id);
    return {
      message: 'Institution deleted',
      deleteIns,
    };
  }

  @UseGuards(TokenAuthGuard, PermitGuard)
  @Roles('super', 'admin')
  @Patch(':id/toggleUpdate')
  async approvedInstitution(@Param('id') id: string) {
    const ins = await this.institutionModel.findById(id);
    if (!ins) {
      throw new UnprocessableEntityException('not found');
    }
    const updatedInstitution = await this.institutionModel.findByIdAndUpdate(
      id,
      { approved: !ins.approved },
      { new: true },
    );

    return {
      message: 'Institution approved',
      updatedInstitution,
    };
  }

  @UseGuards(TokenAuthGuard)
  @Put(':id')
  async updateInstitution(
    @Param('id') id: string,
    @Body() institutionDto: CreateInstitutionsDto,
    @Req() req: UserRequest,
  ) {
    const ins = await this.institutionModel.findById(id);
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'super' &&
      ins.userId.toString() !== req.user._id.toString()
    ) {
      throw new UnprocessableEntityException();
    }
    const updateIns = await this.institutionModel.findByIdAndUpdate(
      id,
      institutionDto,
      { new: true },
    );

    return {
      message: 'updated institution',
      updateIns,
    };
  }
}
