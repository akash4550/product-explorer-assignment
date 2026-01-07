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

  /**
   * Fetch all products for the grid. 
   * Includes 'details' so the frontend can check if a description exists.
   */
  async findAll(): Promise<Product[]> {
    return this.productsRepo.find({
      order: { created_at: 'DESC' },
      relations: ['details'],
    });
  }

  /**
   * Smart Lookup: Finds a product by UUID (database ID) OR 'product_id' (Scraper ID).
   * This prevents 404s when users refresh a URL like /product/wob-12345
   */
  async findOne(identifier: string): Promise<Product> {
    const product = await this.productsRepo.findOne({
      where: [
        { id: identifier },        // Check UUID
        { product_id: identifier } // Check Scraper ID
      ],
      relations: ['details'], // Always load details for the specific product page
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${identifier}" not found`);
    }

    return product;
  }

  /**
   * Upsert (Update or Insert) a Product.
   * Returns the saved entity so the Controller can pass it to ProductDetailService.
   */
  async upsertOne(data: Partial<Product>): Promise<Product> {
    try {
      let product = await this.productsRepo.findOne({ 
        where: { product_id: data.product_id } 
      });

      if (product) {
        // Update existing record
        product = this.productsRepo.merge(product, data);
      } else {
        // Create new record
        product = this.productsRepo.create(data);
      }

      return await this.productsRepo.save(product);
    } catch (err) {
      this.logger.error(`Failed to upsert product ${data.product_id}`, err);
      throw err;
    }
  }
}