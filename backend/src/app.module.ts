import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // 1. Load .env file globally so all modules can access it
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env', // Explicitly look for .env
    }),

    // 2. Configure Database asynchronously (waits for ConfigModule to finish loading)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isSqlite = configService.get<string>('DB_TYPE') === 'sqlite';

        if (isSqlite) {
          return {
            type: 'sqlite',
            database: configService.get<string>('SQLITE_FILE') || 'data.sqlite',
            autoLoadEntities: true,
            synchronize: true, // ⚠️ Auto-creates tables (Perfect for dev/interviews)
          };
        }

        // Production / Docker Configuration
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true, // Note: In real production, disable this and use Migrations
        };
      },
    }),

    // 3. Import Feature Modules
    ProductsModule,
  ],
})
export class AppModule {}