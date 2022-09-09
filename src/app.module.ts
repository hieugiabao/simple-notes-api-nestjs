import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
