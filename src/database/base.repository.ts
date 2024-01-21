import { DeepPartial } from 'typeorm';

export abstract class BaseRepository<Entity> {
  abstract save(
    data: Partial<Entity> | DeepPartial<Entity>,
  ): Promise<Partial<Entity>>;

  abstract saveMany(data: DeepPartial<Entity>[]): Promise<Entity[]>;

  abstract findOneById(id: any): Promise<Entity>;

  abstract findAll(): Promise<Entity[]>;

  abstract delete(id: string): Promise<{ affected: number }>;

  abstract softDelete(id: string): Promise<{ affected: number }>;

  abstract update(id: string, data: any): Promise<{ affected: number }>;

  abstract findOne(
    column: string,
    data: any,
    relations?: string[],
  ): Promise<Entity>;
}
