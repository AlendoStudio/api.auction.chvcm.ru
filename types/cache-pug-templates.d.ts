// TODO: missing types
declare module "cache-pug-templates" {
  interface ICachePugTemplates {
    (redisClient: import ("redis").RedisClient, views: string): void;

    (app: import ("express").Express, redisClient: import ("redis").RedisClient, views: string): void;
  }

  const cachePugTemplates: ICachePugTemplates;

  export = cachePugTemplates;
}
