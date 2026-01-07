import { Controller, Get, Post, Body, Res, HttpStatus, Param, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDetailService } from './product-detail.service';
import { WorldOfBooksScraper } from '../scraper/world-of-books.scraper';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly productDetailService: ProductDetailService,
    private readonly scraperService: WorldOfBooksScraper 
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  async getProducts() {
    return this.productsService.findAll();
  }

  // ✅ 1. UI BUTTON ENDPOINT (Restored!)
  @Get('trigger/scrape') 
  @ApiOperation({ summary: 'Trigger the live scraper (For UI Button)' })
  @ApiResponse({ status: 200, description: 'Scrape completed successfully' })
  async triggerScrape(@Res() res: Response) {
    try {
      this.logger.log('🕷️ UI Button triggered manual scrape...');
      
      // Use a default category for the button action
      const defaultUrl = 'https://www.worldofbooks.com/en-gb/category/technology-engineering-books';
      const scrapedItems = await this.scraperService.scrape(defaultUrl);
      
      const count = await this.saveItems(scrapedItems);
      
      return res.status(HttpStatus.OK).json({ 
        ok: true, 
        message: `Successfully scraped and saved ${count} products.`,
        count 
      });

    } catch (err) {
      this.logger.error('🔥 UI Scrape failed', err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        ok: false, 
        error: err instanceof Error ? err.message : String(err) 
      });
    }
  }

  // ✅ 2. INTERVIEWER DYNAMIC ENDPOINT
  @Post('scrape')
  @ApiOperation({ summary: 'Scrape ANY World of Books URL (Product or Category)' })
  @ApiBody({ schema: { type: 'object', properties: { url: { type: 'string', example: 'https://www.worldofbooks.com/en-gb/products/clean-code-book-robert-c-martin-9780132350884' } } } })
  async scrapeDynamicUrl(@Body('url') url: string, @Res() res: Response) {
    if (!url) {
        return res.status(HttpStatus.BAD_REQUEST).json({ ok: false, error: 'URL is required' });
    }

    try {
      this.logger.log(`🕷️ API Request to scrape: ${url}`);
      const scrapedItems = await this.scraperService.scrape(url);
      
      const count = await this.saveItems(scrapedItems);

      return res.status(HttpStatus.CREATED).json({ 
        ok: true, 
        message: `Successfully scraped ${count} items.`, 
        count,
        items: scrapedItems.map(i => i.title)
      });

    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ ok: false, error: err.message });
    }
  }

  // Helper function to save items (Avoids code duplication)
  private async saveItems(scrapedItems: any[]): Promise<number> {
      let count = 0;
      if (scrapedItems && scrapedItems.length) {
        for (const item of scrapedItems) {
          const savedProduct = await this.productsService.upsertOne({
            product_id: item.product_id,
            title: item.title,
            author: item.author,
            price: item.price,
            name: item.name, 
            image_url: item.image_url,
          });

          if (item.detail && savedProduct) {
            await this.productDetailService.upsert(savedProduct, {
              description: item.detail.description,
              specs: item.detail.specs
            });
          }
          count++;
        }
      }
      return count;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product' })
  async getProduct(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}