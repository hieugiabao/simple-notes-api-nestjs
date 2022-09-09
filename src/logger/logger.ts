import { Injectable, LoggerService } from '@nestjs/common';
import * as moment from 'moment';
import { ConfigService } from '../config/config.service';
import * as winston from 'winston';
import { isLogLevel, LogLevel } from './LogLevel';

const formatter = winston.format((info) => {
  if (info.level === LogLevel.HTTP) return info;

  if (process.env.NODE_ENV !== 'test') {
    info.message = `[${moment().format('ddd MMM DD HH:mm:ss YYYY')}] [${
      info.level
    }] ${info.message}`;
  }
  return info;
});

@Injectable()
export class Logger implements LoggerService {
  public logger: winston.Logger;

  constructor(private configService: ConfigService) {
    this.logger = winston.createLogger({
      level: configService.get().logLevel,
      format: formatter(),
    });

    this.logger.add(
      new winston.transports.Console({
        format: winston.format.json(),
        stderrLevels: [LogLevel.Error, LogLevel.Warn],
      }),
    );
  }

  public log(level: LogLevel, message: string): void;

  public log(message: string): void;

  public log(p0: LogLevel | string, p1?: string, meta?: any) {
    const logLevel = isLogLevel(p0) ? p0 : LogLevel.Info;
    const message = isLogLevel(p0) && p1 ? p1 : p0;
    this.logger.log(logLevel, message, meta);
  }

  public error(message: string) {
    this.log(LogLevel.Error, message);
  }

  public warn(message: string) {
    this.log(LogLevel.Warn, message);
  }

  public info(message: string) {
    this.log(LogLevel.Info, message);
  }

  public http(message: string) {
    this.log(LogLevel.HTTP, message);
  }

  public verbose(message: string) {
    this.log(LogLevel.Verbose, message);
  }

  public debug(message: string) {
    this.log(LogLevel.Debug, message);
  }

  public silly(message: string) {
    this.log(LogLevel.Silly, message);
  }
}
