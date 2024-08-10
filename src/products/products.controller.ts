import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './create-product.dto';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('products')
export class ProductsController {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  @Get()
  getAll() {
    return this.productModel.find();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/products',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ) {
    const product = new this.productModel({
      category: productData.category,
      title: productData.title,
      price: productData.price,
      description: productData.description,
      image: file ? '/uploads/products/' + file.filename : null,
    });

    return product.save();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return { message: 'Product id - ' + id };
  }
}
