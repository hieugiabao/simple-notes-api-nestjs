/* eslint-disable @typescript-eslint/no-var-requires */
import { DBModule } from './../../db/db.module';
import { Module, Type } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import Note from './entities/note.entity';
import { NoteController } from './controllers/note.controller';

export const ALL_ENTITIES = fs
  .readdirSync(path.join(path.dirname(__filename), 'entities'))
  .map((file) => require(`./entities/${file}`).default as Type<any>);

export const ALL_SERVICES = fs
  .readdirSync(path.join(path.dirname(__filename), 'services'))
  .filter(
    (file) =>
      (path.extname(file) === '.js' || path.extname(file) === '.ts') &&
      !file.endsWith('.d.ts'),
  )
  .filter((file) => file.indexOf('.spec') === -1)
  .map((file) => require(`./services/${file}`).default as Type<any>);

@Module({
  imports: [
    DBModule.forRoot({ entities: ALL_ENTITIES }),
    TypeOrmModule.forFeature([Note]),
  ],
  providers: [...ALL_SERVICES],
  exports: [...ALL_SERVICES],
  controllers: [NoteController],
})
export class DomainModule {}
