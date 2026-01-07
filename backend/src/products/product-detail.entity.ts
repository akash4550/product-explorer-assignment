import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  description!: string;

  @Column('simple-json', { nullable: true })
  specs!: Record<string, any>;

  @ManyToOne(() => Product, (product) => product.details, { onDelete: 'CASCADE' })
  product!: Product;
}
