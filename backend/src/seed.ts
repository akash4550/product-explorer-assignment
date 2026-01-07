import { DataSource } from 'typeorm';
import { Product } from './products/product.entity';
import { ProductDetail } from './products/product-detail.entity';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

async function seed() {
  const isPostgres = !!process.env.POSTGRES_HOST;

  const dataSource = new DataSource({
    type: isPostgres ? 'postgres' : 'sqlite',
    database: isPostgres ? process.env.POSTGRES_DB : 'shopping.sqlite',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    entities: [Product, ProductDetail],
    synchronize: true, 
  });

  try {
    await dataSource.initialize();
    console.log(`✅ Connected to database.`);

    const productRepo = dataSource.getRepository(Product);
    const detailRepo = dataSource.getRepository(ProductDetail);

    // 🚨 FIX: Using clear() instead of delete({}) to bypass the safety error
    await detailRepo.clear();
    await productRepo.clear();

    // Replace your current csvPath logic with this:
const csvPath = path.join(process.cwd(), 'books_data.csv');

if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV not found at: ${csvPath}`);
    // This will help us debug if it fails again
    console.log("Looking in:", __dirname); 
    process.exit(1);
}
    
    
    

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    for (const record of records) {
      const product = productRepo.create({
        title: record.Title,
        image_url: record.image, 
        price: parseFloat(record.Price.replace(/[^0-9.]/g, '')) || 0,
        url: 'https://www.worldofbooks.com',
      } as any); 
      
      const savedProduct = await productRepo.save(product);

      const detail = detailRepo.create({
        description: record.Description,
        author: record.Author,
        product: savedProduct,
      } as any);
      
      await detailRepo.save(detail);
    }

    console.log(`🎉 Seeding complete! Processed ${records.length} records.`);
    await dataSource.destroy();
  } catch (error) {
    console.error('🔥 Seeding failed:', error);
    process.exit(1);
  }
}

seed();