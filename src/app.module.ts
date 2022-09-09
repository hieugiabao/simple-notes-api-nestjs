import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './app/domain/domain.module';

@Module({
  imports: [ConfigModule, LoggerModule, DomainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
