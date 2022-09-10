import { DatabaseService } from './../../src/db/db.service';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TestUtils {
  public databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('ERROR TEST UTILS');
    }
    this.databaseService = databaseService;
  }

  public async getEntities() {
    const entities: any = [];
    this.databaseService.entityManager.connection.entityMetadatas.forEach((x) =>
      entities.push({ name: x.name, tableName: x.tableName }),
    );
    return entities;
  }

  public async reloadFixtures() {
    try {
      const entities = await this.getEntities();
      await this.cleanAll(entities);
      await this.loadAll(entities);
    } catch (error) {
      throw error;
    }
  }

  public async cleanAll(entities: any) {
    try {
      for (const entity of entities) {
        const repository = await this.databaseService.getRepository(
          entity.name,
        );
        await repository.query(`truncate table ${entity.tableName} CASCADE`);
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }

  public async loadAll(entities: any) {
    try {
      for (const entity of entities) {
        const repository = await this.databaseService.getRepository(
          entity.name,
        );
        const fixtureFile = path.join(
          __dirname,
          `../fixtures/entity/${entity.name}.json`,
        );
        if (fs.existsSync(fixtureFile)) {
          const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf-8'));
          await repository
            .createQueryBuilder(entity.name)
            .insert()
            .values(items)
            .execute();
        }
      }
    } catch (error) {
      throw new Error(
        `ERROR [TestUtils.loadAll()]: Loading fixture on test db: ${error}`,
      );
    }
  }

  public async closeConnection() {
    const connection = this.databaseService.entityManager.connection;
    if (connection.isConnected)
      await this.databaseService.entityManager.connection.close();
  }
}
