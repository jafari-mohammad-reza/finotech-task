import { Column, Entity, ManyToOne } from 'typeorm';
import { ParentEntity } from '../../../database/entities/parent.entity';
import { User } from '../../user/repository/user.entity';
@Entity()
export class Product extends ParentEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  title: string;
  @Column({ type: 'text', nullable: false })
  description: string;
  @ManyToOne(() => User, (user) => user.products, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  creator: User;
}
