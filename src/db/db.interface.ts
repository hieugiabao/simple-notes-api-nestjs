import { ConnectionOptions } from 'typeorm';

export interface DatabaseConfig {
  entities: ConnectionOptions['entities'];
}
