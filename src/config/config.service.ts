import { DEFAULT_CONFIG } from './config.default';
import { Injectable } from '@nestjs/common';
import {
  ConfigAuthData,
  ConfigAuthorizationData,
  ConfigData,
  ConfigDatabaseData,
  PlatformAPIs,
} from './config.interface';
import { urlJoin } from 'url-join-ts';

@Injectable()
export class ConfigService {
  private config: ConfigData;

  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      db: this.parseDBConfigFromEnv(env, DEFAULT_CONFIG.db),
      logLevel: env.LOG_LEVEL || DEFAULT_CONFIG.logLevel,
      newRelicKey: env.NEW_RELIC_KEY || DEFAULT_CONFIG.newRelicKey,
      auth: this.parseAuthFromEnv(env),
      authorization: this.parseAuthorizationFromEnv(env),
      platformApis: this.parseNotificationsConfigFromEnv(env),
    };
  }

  private parseAuthorizationFromEnv(
    env: NodeJS.ProcessEnv,
  ): ConfigAuthorizationData {
    return {
      baseUrl: env.BOUNCER_BASE_URL || '',
      serviceClientToken: env.BOUNCER_SERVICE_CLIENT_TOKEN || '',
    };
  }

  private parseDBConfigFromEnv(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ConfigDatabaseData>,
  ): ConfigDatabaseData {
    return {
      url: env.DATABASE_URL || defaultConfig.url,
    };
  }

  private parseNotificationsConfigFromEnv(
    env: NodeJS.ProcessEnv,
  ): PlatformAPIs {
    return {
      baseUrl: env.PLATFORM_API_SERVICE_ACTIONS_URL || '',
      token: env.PLATFORM_API_SERVICE_ACTIONS_TOKEN || '',
    };
  }

  private parseAuthFromEnv(env: NodeJS.ProcessEnv): ConfigAuthData {
    let jwksUrl =
      env.AUTH0_JWKS_URL || env.JWKS_URI || DEFAULT_CONFIG.auth.jwksuri;
    if (!/\/\.well-known\/jwks\.json$/i.test(jwksUrl)) {
      jwksUrl = urlJoin(jwksUrl, '.well-known', 'jwks.json');
    }
    return {
      jwksuri: jwksUrl,
      audience:
        env.AUTH0_AUDIENCE_URL || env.AUDIENCE || DEFAULT_CONFIG.auth.audience,
      tokenIssuer:
        env.AUTH0_TOKEN_ISSUER_URL ||
        env.TOKEN_ISSUER ||
        DEFAULT_CONFIG.auth.tokenIssuer,
      authProvider: env.AUTH_PROVIDER || DEFAULT_CONFIG.auth.authProvider,
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
