import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';
import { ProductDetailService } from './product-detail.service';
import { WorldOfBooksScraper } from '../scraper/world-of-books.scraper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductDetail])
  ],
  providers: [
    ProductsService, 
    ProductDetailService,
    WorldOfBooksScraper
  ],
  controllers: [
    ProductsController
  ],
  exports: [
    ProductsService, 
    ProductDetailService
  ],
})
export class ProductsModule {}