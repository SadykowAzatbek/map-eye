import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
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

  //проверка токена, если его нет то запрос не будет отправлен и выведит ошибку
  @UseGuards(TokenAuthGuard)
  @Post(':id?')
  async createLocation(
    @Param('id') id: string | null,
    @Req() req: UserRequest,
    @Body() institutionDto: CreateLocationDto,
  ) {
    const objectId = new mongoose.Types.ObjectId(id);

    const existingLocation = await this.locationModel.findOne({
      _id: objectId,
      userId: req.user?._id,
    });

    //проверяем существует ли уже местоположение
    if (existingLocation) {
      throw new BadRequestException('Локация заведение уже отмечены');
    }

    //создаем location
    const location = new this.locationModel({
      userId: req.user?._id,
      location: institutionDto.location,
      city: institutionDto.city,
      altSpellings: institutionDto.altSpellings,
    });
    await location.save();
    return location;
  }

  @UseGuards(TokenAuthGuard)
  @Patch(':id')
  async updateLocation(
    @Param('id') id: string,
    @Req() req: UserRequest,
    @Body() locationDto: CreateLocationDto,
  ) {
    const location = await this.locationModel.findById(id);
    //Проверяем если id пользователя и id пользователя привязанный к location не равны то ошибка
    if (req.user._id.toString() !== location.userId.toString()) {
      throw new UnprocessableEntityException();
    }
    //если все совпадает то ищем по id местоположение и изменяем его
    await this.locationModel.updateOne({ _id: id }, locationDto, { new: true });
    return this.locationModel.findById(id);
  }

  @UseGuards(TokenAuthGuard)
  @Get(':id')
  async getLocation(@Param('id') id: string, @Req() req: UserRequest) {
    const getMyLocation = await this.locationModel.findOne({ userId: id });
    if (!getMyLocation) {
      return null;
    }
    //сравниваем id user и id user привязанный к location, если проверка не прошла ошибка
    if (req.user._id.toString() !== getMyLocation.userId.toString()) {
      throw new UnprocessableEntityException();
    }
    //иначе возвращаем результат
    return getMyLocation;
  }
}
