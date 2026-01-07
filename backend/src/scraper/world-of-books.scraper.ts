import { chromium } from 'playwright';

export interface ScrapedItem {
  product_id: string;
  title: string;
  author: string;
  price: number;
  image_url: string;
  name: string; // Acts as the Category
  source_url: string;
  detail?: {
    description: string;
    specs: Record<string, any>;
  };
}

export async function runWorldOfBooksScraper(): Promise<ScrapedItem[]> {
  console.log('🚀 Launching Playwright...');
  
  // Launch browser (Headless for Docker performance)
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Critical for Docker stability
  });

  const context = await browser.newContext({
    // Use a real, modern User-Agent to look like a standard Chrome browser
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();
  const results: ScrapedItem[] = [];

  try {
    // 1. Visit the Listing Page
    console.log('Navigating to World of Books (Tech Category)...');
    await page.goto('https://www.worldofbooks.com/en-gb/category/technology-engineering-books', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });

    // Extract links (Limit to 5 items to keep the demo fast)
    // We look for links that likely contain product details
    const links = await page.$$eval('a[href*="/products/"], a[href*="/books/"]', (elements) => 
      elements
        .map((el: any) => el.href)
        .filter(href => href.length > 30) // Filter out short/junk links
        .slice(0, 5) // Limit to 5 for speed
    );
    
    console.log(`Found ${links.length} potential books to scrape.`);

    // 2. Visit Details Page for each book
    for (const link of links) {
      try {
        // Anti-Bot: Random delay between 1s and 3s
        const delay = Math.floor(Math.random() * 2000) + 1000;
        await new Promise(r => setTimeout(r, delay));

        console.log(`Scraping: ${link.split('/').pop()}...`);
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Extract Data safely
        const data = await page.evaluate(() => {
          const title = document.querySelector('h1')?.textContent?.trim() || 'Unknown Title';
          const author = document.querySelector('.author, .product-info__author')?.textContent?.trim() || 'Unknown Author';
          const priceText = document.querySelector('.price, .product-price, .current-price')?.textContent?.trim() || '0';
          const image = document.querySelector('img[itemprop="image"]')?.getAttribute('src') || '';
          
          // Try multiple selectors for description as sites often change layout
          const desc = document.querySelector('.description, #description, .product-description, [itemprop="description"]')?.textContent?.trim() || '';

          return { title, author, priceText, image, desc };
        });

        // Clean the ID (remove query params like ?ref=...)
        const rawId = link.split('/').pop() || 'unknown';
        const cleanId = rawId.split('?')[0]; 

        // Clean the Price (Remove '£' and convert to float)
        const price = parseFloat(data.priceText.replace(/[^0-9.]/g, '')) || 0;

        results.push({
          product_id: cleanId,
          title: data.title,
          author: data.author.replace(/^by\s+/i, ''), // Regex removes "by " case-insensitively
          price: price,
          image_url: data.image,
          name: 'Book', // Hardcoded category for this scraper
          source_url: link,
          detail: {
            description: data.desc,
            specs: {} // Can be expanded later
          }
        });
        
        console.log(`✅ Success: ${data.title.substring(0, 30)}...`);

      } catch (e) {
        console.warn(`⚠️ Skipping link ${link}:`, e instanceof Error ? e.message : e);
      }
    }

  } catch (error) {
    console.error('🔥 Main scraper error:', error);
  } finally {
    await browser.close();
  }

  return results;
}