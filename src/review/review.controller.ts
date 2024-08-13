import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import mongoose, { Model } from 'mongoose';
import {
  Institution,
  InstitutionDocument,
} from '../schemas/institution.schema';
import { CreateReviewsDto } from './create-reviews.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { Request } from 'express';

interface UserRequest extends Request {
  user: {
    _id: mongoose.Types.ObjectId;
    role: string;
  };
}

@Controller('review')
export class ReviewController {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    @InjectModel(Institution.name)
    private institutionModel: Model<InstitutionDocument>,
  ) {}

  @Get()
  async getReview(@Query('id') id: string) {
    const objectId = new mongoose.Types.ObjectId(id);
    const reviews = await this.reviewModel
      .find({ institutionId: objectId })
      .exec();
    if (!reviews) {
      throw new NotFoundException('Reviews not found');
    }
    return reviews;
  }

  @UseGuards(TokenAuthGuard)
  @Post(':id')
  async createReview(
    @Param('id') id: string,
    @Body() reviewDto: CreateReviewsDto,
    @Req() req: UserRequest,
  ) {
    const review = await this.reviewModel.findOne({ userId: req.user._id });
    if (review) {
      throw new BadRequestException('the review has already been sent!');
    }
    const getInstitution = await this.institutionModel.findById(id);
    if (!getInstitution) {
      throw new UnprocessableEntityException();
    }
    const createReview = new this.reviewModel({
      userId: req.user?._id,
      institutionId: getInstitution._id,
      grade: reviewDto.grade,
      description: reviewDto.description,
    });
    await createReview.save();
    return createReview;
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  async deleteReview(@Param('id') id: string, @Req() req: UserRequest) {
    const review = await this.reviewModel.findById(id);
    if (
      req.user.role !== 'super' &&
      req.user.role !== 'admin' &&
      req.user._id.toString() !== review.userId.toString()
    ) {
      throw new UnprocessableEntityException();
    }
    await review.deleteOne();
    return review;
  }

  @UseGuards(TokenAuthGuard)
  @Put(':id')
  async updateReview(
    @Param('id') id: string,
    @Req() req: UserRequest,
    @Body() reviewDto: CreateReviewsDto,
  ) {
    const review = await this.reviewModel.findById(id);
    if (
      req.user.role !== 'super' &&
      req.user.role !== 'admin' &&
      req.user._id.toString() !== review.userId.toString()
    ) {
      throw new UnprocessableEntityException();
    }
    await this.reviewModel.updateOne({ _id: id }, reviewDto, { new: true });
    return this.reviewModel.findById(id);
  }
}
