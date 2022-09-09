import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(@InjectEntityManager() public entityManager: EntityManager) {}

  public async getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    return this.entityManager.getRepository(entity);
  }
}
