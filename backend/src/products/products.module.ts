import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';
import { ProductDetailService } from './product-detail.service';

@Module({
  // 1. Register Repositories: This makes @InjectRepository(Product) work in your services
  imports: [
    TypeOrmModule.forFeature([Product, ProductDetail])
  ],
  
  // 2. Register Business Logic
  providers: [
    ProductsService, 
    ProductDetailService
  ],
  
  // 3. Expose API Endpoints
  controllers: [
    ProductsController
  ],
  
  // 4. Allow other modules to use these services (Scalability)
  exports: [
    ProductsService, 
    ProductDetailService
  ],
})
export class ProductsModule {}