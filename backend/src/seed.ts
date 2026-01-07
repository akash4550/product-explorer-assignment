import { DataSource } from 'typeorm';
import { Product } from './products/product.entity';
import { ProductDetail } from './products/product-detail.entity';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

async function seed() {
  // 1. Determine environment and database type (Support both naming conventions)
  const dbHost = process.env.POSTGRES_HOST || process.env.DB_HOST;
  const dbPort = process.env.POSTGRES_PORT || process.env.DB_PORT || '5432';
  const dbUser = process.env.POSTGRES_USER || process.env.DB_USER;
  const dbPass = process.env.POSTGRES_PASSWORD || process.env.DB_PASS;
  const dbName = process.env.POSTGRES_DB || process.env.DB_NAME;

  const isPostgres = !!dbHost;

  const dataSource = new DataSource({
    type: isPostgres ? 'postgres' : 'sqlite',
    database: isPostgres ? dbName : 'shopping.sqlite',
    host: dbHost,
    port: parseInt(dbPort),
    username: dbUser,
    password: dbPass,
    entities: [Product, ProductDetail],
    synchronize: true, 
  });

  try {
    console.log(`🌱 Connecting to ${isPostgres ? 'Postgres' : 'SQLite'} database...`);
    if (isPostgres) {
       console.log(`   Host: ${dbHost}, Port: ${dbPort}, User: ${dbUser}, DB: ${dbName}`);
    }
    await dataSource.initialize();
    console.log(`✅ Connected to database.`);

    const productRepo = dataSource.getRepository(Product);
    const detailRepo = dataSource.getRepository(ProductDetail);

    // 2. Clear existing data safely
    await detailRepo.clear();
    await productRepo.clear();

    // 3. Robust Path Resolution for CSV in Docker/Render
    let csvPath = path.join(process.cwd(), 'books_data.csv');
    if (!fs.existsSync(csvPath)) {
        csvPath = path.join(__dirname, '../books_data.csv');
    }

    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV not found at: ${csvPath}`);
      console.log("Current working directory:", process.cwd());
      process.exit(1);
    }

    console.log(`📂 Reading CSV from: ${csvPath}`);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    if (records.length > 0) {
      console.log("📊 CSV Headers detected:", Object.keys(records[0]));
    }

    // 4. Iterate and save records with flexible header mapping
    for (const record of records) {
      // Clean and parse price (fallback to common variations of header names)
      const rawPrice = record.Price || record.price || '0';
      const parsedPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;

      // Handle common CSV header variations
      const title = record.Title || record.title || record.name || 'Unknown Title';
      const image = record.image || record.image_url || record.Image || '';
      const author = record.Author || record.author || 'Unknown Author';
      const description = record.Description || record.description || '';

      // Generate unique product_id to satisfy NOT NULL constraints
      const generatedId = `book-${Math.random().toString(36).substr(2, 9)}`;

      const product = productRepo.create({
        product_id: generatedId,
        title: title,
        image_url: image, 
        price: parsedPrice,
        name: 'Book',
        url: 'https://www.worldofbooks.com',
      } as any); 
      
      const savedProduct = await productRepo.save(product);

      const detail = detailRepo.create({
        description: description,
        author: author,
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