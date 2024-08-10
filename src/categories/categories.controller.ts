import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  @Get()
  async getAll() {
    return this.categoryModel.find();
  }

  @Post()
  async create(@Req() req: Request, @Body() categoryDto: CreateCategoryDto) {
    const category = new this.categoryModel({
      name: categoryDto.name,
      description: categoryDto.description,
    });

    return category.save();
  }
}
