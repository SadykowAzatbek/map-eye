import {Body, Controller, Param, Patch, Post, Req, UnprocessableEntityException, UseGuards} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Location, LocationDocument } from '../schemas/location.schema';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { Request } from 'express';
import { CreateLocationDto } from './create-location.dto';

interface UserRequest extends Request {
  user: {
    _id: ObjectId;
    role: string;
  };
}

@Controller('locations')
export class LocationController {
  constructor(
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Post()
  async createLocation(
    @Req() req: UserRequest,
    @Body() institutionDto: CreateLocationDto,
  ) {
    const location = new this.locationModel({
      userId: req.user?._id,
      location: institutionDto.location,
      city: institutionDto.city,
    });
    await location.save();
    return location;
  }

  @UseGuards(TokenAuthGuard)
  @Patch(':id')
  async updateLocation(@Param('id') id: string) {
    const location = await this.locationModel.findById(id);
    if (!location) {
      throw new UnprocessableEntityException('Location not found');
    }
    const updateLocation = await this.locationModel.findByIdAndUpdate(
      id,
      location,
      { new: true },
    );
    return {
      message: 'Updated location',
      updateLocation,
    };
  }
}
