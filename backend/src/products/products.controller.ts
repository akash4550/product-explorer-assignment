import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDetailService } from './product-detail.service';
// Ensure this path matches where you put the scraper file
import { runWorldOfBooksScraper } from '../scraper/world-of-books.scraper';

@ApiTags('products')
@Controller('products') // Maps to: /api/products
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly productDetailService: ProductDetailService
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all products (sorted by newest)' })
  @ApiResponse({ status: 200, description: 'Returns list of products' })
  async getProducts() {
    return this.productsService.findAll();
  }

  @Get('trigger/scrape') 
  @ApiOperation({ summary: 'Trigger the live scraper' })
  @ApiResponse({ status: 200, description: 'Scrape completed successfully' })
  async triggerScrape(@Res() res: Response) {
    try {
      this.logger.log('🕷️ Manual scrape triggered via API...');
      
      // 1. Run the headless browser script
      const scrapedItems = await runWorldOfBooksScraper();
      let count = 0;

      if (scrapedItems && scrapedItems.length) {
        this.logger.log(`📦 Found ${scrapedItems.length} items. Saving to database...`);

        for (const item of scrapedItems) {
          // 2. Save the Main Product (Title, Price, Image)
          const savedProduct = await this.productsService.upsertOne({
            product_id: item.product_id || item.source_url, // Fallback if ID is missing
            title: item.title,
            author: item.author,
            price: item.price,
            name: item.name, 
            image_url: item.image_url,
          });

          // 3. Save the Details (Description, Specs) linked to that product
          if (item.detail && savedProduct) {
            await this.productDetailService.upsert(savedProduct, {
              description: item.detail.description,
              specs: item.detail.specs
            });
          }
          count++;
        }
      }
      
      this.logger.log(`✅ Scrape complete. Upserted ${count} products.`);
      
      return res.status(HttpStatus.OK).json({ 
        ok: true, 
        message: `Successfully scraped and saved ${count} products.`,
        count 
      });

    } catch (err) {
      this.logger.error('🔥 Scrape failed', err instanceof Error ? err.stack : err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        ok: false, 
        error: err instanceof Error ? err.message : String(err) 
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product with details' })
  @ApiParam({ name: 'id', description: 'Product UUID or Scraper ID (e.g. wob-123)' })
  @ApiResponse({ status: 200, description: 'Returns product with details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string) {
    // This calls the smart finder that checks both UUID and product_id
    const product = await this.productsService.findOne(id);
    return product;
  }
}