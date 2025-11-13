import {
  Controller,
  Param,
  Post,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from '../schemas/image.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import {
  Establishment,
  EstablishmentDocument,
} from '../schemas/establishment.schema';
import { createMulterStorage } from '../config/multer.config';

interface UserRequest extends Request {
  user: {
    _id: ObjectId;
    role: string;
  };
}

@Controller('images')
export class ImagesController {
  constructor(
    @InjectModel(Image.name)
    private imageModel: Model<Image>,
    @InjectModel(Establishment.name)
    private establishmentModel: Model<EstablishmentDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createMulterStorage('./public/uploads/establishments'),
    }),
  )
  async addImages(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: UserRequest,
  ) {
    const objectId = new mongoose.Types.ObjectId(id);

    const getEstablishment = await this.establishmentModel.findById(objectId);
    if (!getEstablishment) {
      throw new UnprocessableEntityException('Заведение не найдено.');
    }

    const image = new this.imageModel({
      userId: req.user?._id,
      establishmentId: getEstablishment._id,
      image: file ? '/uploads/establishments/' + file.filename : null,
    });
    await image.save();
    return image;
  }
}
