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
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Establishment,
  EstablishmentDocument,
} from '../schemas/establishment.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { CreateEstablishmentDto } from './create-establishment.dto';
import { Request } from 'express';
import { PermitGuard } from '../auth/permit.guard';
import { Roles } from '../auth/roles.decorator';
import { Review, ReviewDocument } from '../schemas/review.schema';

interface UserRequest extends Request {
  user: {
    _id: ObjectId;
    role: string;
  };
}

@Controller('establishment')
export class EstablishmentController {
  constructor(
    @InjectModel(Establishment.name)
    private establishmentModel: Model<EstablishmentDocument>,
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Post()
  async createEstablishment(
    @Req() req: UserRequest,
    @Body() establishmentDto: CreateEstablishmentDto,
  ) {
    try {
      const establishment = new this.establishmentModel({
        userId: req.user?._id,
        name: establishmentDto.name,
        description: establishmentDto.description,
        breakTime: establishmentDto.breakTime,
        schedule: establishmentDto.schedule,
        rating: establishmentDto.rating,
        reviews: establishmentDto.reviews,
        approved: establishmentDto.approved,
        address: establishmentDto.address,
        coordinates: establishmentDto.coordinates,
        phoneNumber: establishmentDto.phoneNumber,
      });
      await establishment.save();
      return establishment;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(err);
      }

      throw err;
    }
  }

  @UseGuards(TokenAuthGuard)
  @Get('my')
  async getMyEstablishments(@Req() req: UserRequest) {
    const userId = req.user?._id;
    const establishments = await this.establishmentModel
      .find({ userId })
      .exec();

    if (!establishments) {
      throw new UnprocessableEntityException('Establishments not found');
    }

    const reviewsArray = await Promise.all(
      establishments.map((establishment) =>
        this.reviewModel.find({ establishmentId: establishment._id }),
      ),
    );
    establishments.forEach((establishment, index) => {
      const reviews = reviewsArray[index]; // отзывы для конкретного заведения
      const reviewsLength = reviews.length;
      if (reviewsLength > 0) {
        const sum = reviews.reduce((acc, review) => acc + review.grade, 0);
        const result = sum / reviewsLength;
        establishment.rating = parseFloat(result.toFixed(1));
        establishment.reviews = reviewsLength;
      } else {
        establishment.rating = 0;
      }
      establishment.save();
    });

    return establishments;
  }

  @UseGuards(TokenAuthGuard)
  @Get(':id')
  async getEstablishment(@Req() req: UserRequest, @Param('id') id: string) {
    const objectId = new mongoose.Types.ObjectId(id);
    const establishment = await this.establishmentModel.findById(objectId);
    if (!establishment) {
      throw new UnprocessableEntityException('Establishment not found');
    }

    const isOwner = establishment.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isSuper = req.user.role === 'super';

    if (!isAdmin && !isSuper && !isOwner) {
      throw new UnauthorizedException();
    }

    const reviews = await this.reviewModel.find({ establishmentId: objectId });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, curr) => acc + curr.grade, 0) / reviews.length
        : 0;

    if (establishment.rating !== averageRating) {
      establishment.rating = averageRating;
      await establishment.save();
    }

    return establishment;
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  async deleteEstablishment(@Req() req: UserRequest, @Param('id') id: string) {
    const establishmentDel = await this.establishmentModel.findById(id);

    if (!establishmentDel) {
      throw new UnprocessableEntityException('Establishment not found');
    }

    const isOwner =
      establishmentDel.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isSuper = req.user.role === 'super';

    if (!isAdmin && !isSuper && !isOwner) {
      throw new UnauthorizedException();
    }

    const deleteIns = await this.establishmentModel.findByIdAndDelete(id);
    return {
      message: 'Establishment deleted',
      deleteIns,
    };
  }

  @UseGuards(TokenAuthGuard, PermitGuard)
  @Roles('super', 'admin')
  @Patch(':id/toggleUpdate')
  async approvedEstablishment(@Param('id') id: string) {
    const ins = await this.establishmentModel.findById(id);
    if (!ins) {
      throw new UnprocessableEntityException('not found');
    }
    const updateEstablishment = await this.establishmentModel.findByIdAndUpdate(
      id,
      { approved: !ins.approved },
      { new: true },
    );

    return {
      message: 'Establishment approved',
      updatedEstablishment: updateEstablishment,
    };
  }

  @UseGuards(TokenAuthGuard)
  @Put(':id')
  async updateEstablishment(
    @Param('id') id: string,
    @Body() establishmentDto: CreateEstablishmentDto,
    @Req() req: UserRequest,
  ) {
    const ins = await this.establishmentModel.findById(id);
    const isOwner = ins.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isSuper = req.user.role === 'super';

    if (!isAdmin && !isSuper && !isOwner) {
      throw new UnprocessableEntityException();
    }
    const updateIns = await this.establishmentModel.findByIdAndUpdate(
      id,
      establishmentDto,
      { new: true },
    );

    return {
      message: 'updated establishment',
      updateIns,
    };
  }
}
