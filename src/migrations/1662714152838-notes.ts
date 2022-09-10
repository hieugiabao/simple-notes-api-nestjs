import { MigrationInterface, QueryRunner } from 'typeorm';

export class notes1662714152838 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE notes (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        "text" varchar(255) NOT NULL,
        "isCompleted" boolean NOT NULL,
        CONSTRAINT "PK_1e6c4a92b7d2ea5db198f313ce11" PRIMARY KEY (id),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE notes`);
  }
}
