import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';
import { ProductDetailService } from './product-detail.service';
// 1. Import the Scraper
import { WorldOfBooksScraper } from '../scraper/world-of-books.scraper';

@Module({
  // Register Repositories so @InjectRepository works
  imports: [
    TypeOrmModule.forFeature([Product, ProductDetail])
  ],
  
  // Register Services AND the Scraper
  providers: [
    ProductsService, 
    ProductDetailService,
    WorldOfBooksScraper // <--- Added this provider to fix the error
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