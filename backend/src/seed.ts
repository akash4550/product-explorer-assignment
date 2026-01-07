import { DataSource } from 'typeorm';
import { Product } from './products/product.entity';
import { ProductDetail } from './products/product-detail.entity';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

async function seed() {
  // 🔍 LOGIC: Only use Postgres if the HOST variable exists (Render Prod)
  // Otherwise, FORCE SQLite (Local & Render Free Tier)
  const isPostgres = !!process.env.POSTGRES_HOST;

  console.log(`🌱 Detected environment: ${isPostgres ? 'Postgres' : 'SQLite'}`);

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

    // Clear existing data to avoid duplicates
    await detailRepo.delete({});
    await productRepo.delete({});

    // 📂 Read CSV (Adjusted path to match Docker structure)
    // In Docker, code is in /usr/src/app/src, so we go up one level to find the CSV
    const csvPath = path.join(__dirname, '../books_data.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.error(`❌ CSV not found at: ${csvPath}`);
        // Fallback check for local development
        if (fs.existsSync(path.join(__dirname, '../../books_data.csv'))) {
            console.log("Found CSV in root (local dev path)");
        }
    }

    console.log(`📂 Reading CSV from: ${csvPath}`);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    for (const record of records) {
      // Map CSV columns correctly
      const product = productRepo.create({
        title: record.Title,
        imageUrl: record.image, // Matches your CSV header 'image'
        price: record.Price,
        url: 'https://www.worldofbooks.com', // Placeholder URL
      });
      const savedProduct = await productRepo.save(product);

      const detail = detailRepo.create({
        description: record.Description,
        author: record.Author,
        product: savedProduct,
      });
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