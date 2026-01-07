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
    console.log(`🌱 Connecting to ${isPostgres ? 'Postgres' : 'SQLite'} database...`);
    await dataSource.initialize();
    console.log(`✅ Connected to database.`);

    const productRepo = dataSource.getRepository(Product);
    const detailRepo = dataSource.getRepository(ProductDetail);

    await detailRepo.clear();
    await productRepo.clear();

    let csvPath = path.join(process.cwd(), 'books_data.csv');
    if (!fs.existsSync(csvPath)) {
        csvPath = path.join(__dirname, '../books_data.csv');
    }

    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV not found at: ${csvPath}`);
      process.exit(1);
    }

    console.log(`📂 Reading CSV from: ${csvPath}`);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    for (const record of records) {
      const rawPrice = record.Price || '0';
      const parsedPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;

      // 🚨 FIX: Generate a random product_id to satisfy the NOT NULL constraint
      const generatedId = `book-${Math.random().toString(36).substr(2, 9)}`;

      const product = productRepo.create({
        product_id: generatedId, // Added this line
        title: record.Title || 'Unknown Title',
        image_url: record.image || '', 
        price: parsedPrice,
        name: 'Book',
        url: 'https://www.worldofbooks.com',
      } as any); 
      
      const savedProduct = await productRepo.save(product);

      const detail = detailRepo.create({
        description: record.Description || '',
        author: record.Author || 'Unknown Author',
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