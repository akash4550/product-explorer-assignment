import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { parse } from 'csv-parse';
import { Product } from './products/product.entity';
import { ProductDetail } from './products/product-detail.entity';

// 1. Load Environment Variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 2. Determine DB Type (SQLite vs Postgres)
const isSqlite = process.env.DB_TYPE === 'sqlite';

const AppDataSource = new DataSource({
  type: isSqlite ? 'sqlite' : 'postgres',
  database: isSqlite 
    ? path.resolve(__dirname, '../data.sqlite') 
    : (process.env.DB_NAME || 'product_explorer'),
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [Product, ProductDetail],
  synchronize: true, // Auto-create tables if missing
});

async function runSeed() {
  try {
    console.log(`🌱 Connecting to ${isSqlite ? 'SQLite' : 'Postgres'} database...`);
    await AppDataSource.initialize();
    
    const productRepo = AppDataSource.getRepository(Product);

    // 3. Robust Path Resolution (Points to ROOT folder)
    const csvPath = path.resolve(__dirname, '../../products_fixed_schema.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found at: ${csvPath}`);
      console.error('   Please ensure "products_fixed_schema.csv" is in the ROOT folder.');
      process.exit(1);
    }

    console.log(`📂 Reading CSV from: ${csvPath}`);
    
    const parser = fs
      .createReadStream(csvPath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

    let count = 0;

    for await (const record of parser) {
      // Map CSV columns to Entity fields
      const productData: Partial<Product> = {
        product_id: record.product_id || record.id || `csv-${Math.random().toString(36).substr(2, 9)}`,
        title: record.title || 'Untitled Product',
        author: record.author || null,
        // Safely parse price, removing currency symbols if present
        price: record.price ? parseFloat(record.price.replace(/[^0-9.]/g, '')) : 0,
        name: record.name || record.category || 'Uncategorized', // Matches 'CategoryPills' logic
        image_url: record.image_url || null,
      };

      // Upsert Logic (Check by product_id)
      const existing = await productRepo.findOne({ 
        where: { product_id: productData.product_id } 
      });

      if (existing) {
        productRepo.merge(existing, productData);
        await productRepo.save(existing);
      } else {
        const newProduct = productRepo.create(productData);
        await productRepo.save(newProduct);
      }
      count++;
    }

    console.log(`✅ Seeding complete! Processed ${count} records.`);
    process.exit(0);

  } catch (error) {
    console.error('🔥 Seeding failed:', error);
    process.exit(1);
  }
}

runSeed();