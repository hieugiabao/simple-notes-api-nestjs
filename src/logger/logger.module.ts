import { LoggerMiddleware } from './logger.middleware';
import { ConfigModule } from './../config/config.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Logger } from './logger';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
