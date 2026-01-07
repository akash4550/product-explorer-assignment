import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { ProductDetail } from './product-detail.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  product_id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  author!: string;

  @Column('float', { nullable: true })
  price!: number;

  @Column({ nullable: true })
  image_url!: string;

  @Column({ default: 'Book' })
  name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => ProductDetail, (detail) => detail.product, { cascade: true })
  details!: ProductDetail[];
}
