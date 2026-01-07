import { Injectable, Logger } from '@nestjs/common';
import { chromium, Page } from 'playwright';

export interface ScrapedItem {
  product_id: string;
  title: string;
  author: string;
  price: number;
  image_url: string;
  name: string;
  source_url: string;
  detail?: {
    description: string;
    specs: Record<string, any>;
  };
}

@Injectable()
export class WorldOfBooksScraper {
  private readonly logger = new Logger(WorldOfBooksScraper.name);

  async scrape(url: string): Promise<ScrapedItem[]> {
    this.logger.log(`🚀 Launching Playwright for: ${url}`);

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    const results: ScrapedItem[] = [];

    try {
      if (url.includes('/products/')) {
        this.logger.log('✨ Detected Single Product URL');
        const item = await this.scrapeSingleProduct(page, url);
        if (item) results.push(item);
      } else {
        this.logger.log('📂 Detected Category URL');
        const items = await this.scrapeCategory(page, url);
        results.push(...items);
      }
    } catch (error) {
      this.logger.error(`🔥 Scrape failed: ${error.message}`);
    } finally {
      await browser.close();
    }

    return results;
  }

  private async scrapeCategory(page: Page, url: string): Promise<ScrapedItem[]> {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const links = await page.$$eval('a[href*="/products/"]', (elements) =>
      elements
        .map((el: any) => el.href)
        .filter(href => href.length > 30)
        .slice(0, 5)
    );

    this.logger.log(`Found ${links.length} books in this category.`);
    const items: ScrapedItem[] = [];

    for (const link of links) {
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
      const item = await this.scrapeSingleProduct(page, link);
      if (item) items.push(item);
    }

    return items;
  }

  private async scrapeSingleProduct(page: Page, url: string): Promise<ScrapedItem | null> {
    try {
      this.logger.log(`   ➡️ Visiting: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

      const data = await page.evaluate(() => {
        const title = document.querySelector('h1')?.textContent?.trim() || 'Unknown Title';
        const author = document.querySelector('.author, .product-info__author')?.textContent?.trim() || 'Unknown Author';
        const priceText = document.querySelector('.price, .product-price, .current-price')?.textContent?.trim() || '0';
        const image = document.querySelector('img[itemprop="image"]')?.getAttribute('src') || '';
        const desc = document.querySelector('.description, [itemprop="description"]')?.textContent?.trim() || '';

        return { title, author, priceText, image, desc };
      });

      const rawId = url.split('/').pop() || 'unknown';
      const cleanId = rawId.split('?')[0];
      const price = parseFloat(data.priceText.replace(/[^0-9.]/g, '')) || 0;

      return {
        product_id: cleanId,
        title: data.title,
        author: data.author.replace(/^by\s+/i, ''),
        price: price,
        image_url: data.image,
        name: 'Book',
        source_url: url,
        detail: {
          description: data.desc,
          specs: {}
        }
      };
    } catch (e) {
      this.logger.warn(`   ⚠️ Failed to scrape ${url}: ${e.message}`);
      return null;
    }
  }
}