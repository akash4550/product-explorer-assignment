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

  async upsert(product: Product, detailData: Partial<ProductDetail>) {
    try {
      let detailEntity = await this.detailsRepo.findOne({
        where: { product: { id: product.id } },
      });

      if (detailEntity) {
        detailEntity = this.detailsRepo.merge(detailEntity, detailData);
      } else {
        detailEntity = this.detailsRepo.create({
          ...detailData,
          product: product,
        });
      }

      return await this.detailsRepo.save(detailEntity);
    } catch (err) {
      this.logger.error(
        `Failed to save details for Product ID: ${product.id}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }
}
