import { DBLogger } from './db.logger';
import { DatabaseService } from './db.service';
import { LoggerModule } from './../logger/logger.module';
import { ConfigModule } from './../config/config.module';
import { ConfigDatabaseData } from './../config/config.interface';
import { DatabaseConfig } from './db.interface';
import { ConfigService } from './../config/config.service';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfigError } from './db.errors';
import { Logger } from '../logger/logger';

@Module({})
export class DBModule {
  private static getConnectionOptions(
    config: ConfigService,
    dbConfig: DatabaseConfig,
  ): TypeOrmModuleOptions {
    const dbData = config.get().db;
    if (!dbData) {
      throw new DatabaseConfigError('Missing database config');
    }

    const connectionOptions = DBModule.getConnectionOptionsPostgres(dbData);
    return {
      ...connectionOptions,
      entities: dbConfig.entities,
      synchronize: false,
      logging: true,
    };
  }

  private static getConnectionOptionsPostgres(
    dbData: ConfigDatabaseData,
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: dbData.url,
      keepConnectionAlive: true,
      ssl:
        process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  public static forRoot(dbConfig: DatabaseConfig): DynamicModule {
    return {
      module: DBModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule, LoggerModule],
          useFactory: (configService: ConfigService, logger: Logger) =>
            DBModule.getConnectionOptions(configService, dbConfig),
          inject: [ConfigService],
        }),
        LoggerModule,
      ],
      controllers: [],
      providers: [DatabaseService, DBLogger],
      exports: [DatabaseService, DBLogger],
    };
  }
}
