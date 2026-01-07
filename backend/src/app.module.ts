// ... other imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';
import { ProductDetail } from './products/product-detail.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // 🚨 LOGIC FIX:
        // Only use Postgres if a Host is explicitly provided.
        // Otherwise, fallback to SQLite (even in Production).
        const isPostgres = !!process.env.POSTGRES_HOST;

        if (isPostgres) {
          return {
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [Product, ProductDetail],
            synchronize: true, // Auto-create tables
          };
        }

        // Default to SQLite (For Render Free Tier)
        return {
          type: 'sqlite',
          database: 'shopping.sqlite',
          entities: [Product, ProductDetail],
          synchronize: true,
        };
      },
    }),
    ProductsModule,
  ],
})
export class AppModule {}