import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepo.find({
      order: { created_at: 'DESC' },
      relations: ['details'],
    });
  }

  async findOne(identifier: string): Promise<Product> {
    const product = await this.productsRepo.findOne({
      where: [
        { id: identifier },
        { product_id: identifier },
      ],
      relations: ['details'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${identifier}" not found`);
    }

    return product;
  }

  async upsertOne(data: Partial<Product>): Promise<Product> {
    try {
      let product = await this.productsRepo.findOne({
        where: { product_id: data.product_id },
      });

      if (product) {
        product = this.productsRepo.merge(product, data);
      } else {
        product = this.productsRepo.create(data);
      }

      return await this.productsRepo.save(product);
    } catch (err) {
      this.logger.error(`Failed to upsert product ${data.product_id}`, err);
      throw err;
    }
  }
}
