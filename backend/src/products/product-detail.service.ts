import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDetail } from './product-detail.entity';
import { Product } from './product.entity';

@Injectable()
export class ProductDetailService {
  private logger = new Logger(ProductDetailService.name);

  constructor(
    @InjectRepository(ProductDetail)
    private detailsRepo: Repository<ProductDetail>,
  ) {}

  /**
   * Insert or Update (Upsert) the detailed specs for a product.
   * This is usually called AFTER the main product is saved.
   */
  async upsert(product: Product, detailData: Partial<ProductDetail>) {
    try {
      // 1. Efficient Lookup: Check if details already exist for this product ID
      let detailEntity = await this.detailsRepo.findOne({ 
        where: { product: { id: product.id } } 
      });

      if (detailEntity) {
        // 2. Update: Merge new data (e.g. updated description) into existing record
        detailEntity = this.detailsRepo.merge(detailEntity, detailData);
      } else {
        // 3. Create: Instantiate new record and link the parent Product
        detailEntity = this.detailsRepo.create({
          ...detailData,
          product: product, 
        });
      }

      // 4. Persist to DB
      return await this.detailsRepo.save(detailEntity);

    } catch (err) {
      this.logger.error(
        `Failed to save details for Product ID: ${product.id}`, 
        err instanceof Error ? err.stack : String(err)
      );
      throw err;
    }
  }
}