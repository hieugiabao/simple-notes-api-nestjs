export interface ConfigDatabaseData {
  url?: string;
}

export interface ConfigAuthData {
  jwksuri: string;

  audience?: string;

  tokenIssuer: string;

  authProvider: string;
}

export interface ConfigAuthorizationData {
  baseUrl: string;
  serviceClientToken: string;
}

export interface PlatformAPIs {
  baseUrl: string;
  token: string;
}

export interface ConfigData {
  env: string;

  auth: ConfigAuthData;

  authorization: ConfigAuthorizationData;

  platformApis: PlatformAPIs;

  db: ConfigDatabaseData;

  logLevel: string;

  newRelicKey?: string;
}
