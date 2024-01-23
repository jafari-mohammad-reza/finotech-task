import { Column, Entity, OneToMany } from 'typeorm';
import { ParentEntity } from '../../../database/entities/parent.entity';
import { Product } from '../../product/repository/product.entity';

@Entity()
export class User extends ParentEntity {
  @Column({ type: 'varchar', nullable: false })
  firstName: string;
  @Column({ type: 'varchar', nullable: false })
  lastName: string;
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
  @OneToMany(() => Product, (product) => product.creator, {
    onDelete: 'SET NULL',
  })
  products: Product[];
}
