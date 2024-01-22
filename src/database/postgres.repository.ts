import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseRepository } from './base.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ParentEntity } from './entities/parent.entity';

export class PostgresRepository<
  Entity extends ParentEntity,
> extends BaseRepository<Entity> {
  constructor(private repository: Repository<Entity>) {
    super();
  }

  public async save(data: DeepPartial<Entity>): Promise<Entity> {
    return await this.repository.save(data);
  }

  public async saveMany(data: DeepPartial<Entity>[]): Promise<Entity[]> {
    return await this.repository.save(data);
  }

  public create(data: DeepPartial<Entity>): Entity {
    return this.repository.create(data);
  }

  public createMany(data: DeepPartial<Entity>[]): Entity[] {
    return this.repository.create(data);
  }

  public async findOneById(
    id: any,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return await this.repository.findOne({ where: { id }, ...options });
  }

  public async findByCondition(
    filterCondition: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return await this.repository.findOne(filterCondition);
  }

  public async findWithRelations(
    relations: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find(relations);
  }

  public async findAll(options?: FindManyOptions): Promise<Entity[]> {
    return await this.repository.find(options);
  }

  public async delete(id: string): Promise<{ affected: number }> {
    const result = await this.repository.delete(id);
    return { affected: result.affected };
  }

  public async softDelete(id: string): Promise<{ affected: number }> {
    const result = await this.repository.softDelete(id);
    return { affected: result.affected };
  }

  public async findOne(
    column: string,
    value: string | number,
    relations?: string[],
  ): Promise<Entity> {
    const whereOptions: FindOptionsWhere<Entity> = {};
    whereOptions[column] = value;
    return await this.repository.findOne({
      where: whereOptions,
      relations,
    });
  }

  public async update(
    id: string,
    data: QueryDeepPartialEntity<Entity>,
  ): Promise<{ affected: number }> {
    const result = await this.repository.update(id, data);
    return { affected: result.affected };
  }
}
