import * as fs from "fs";
import * as http from "http";
import {AddressInfo} from "net";
import * as path from "path";
import * as util from "util";

import * as publicDir from "@alendo/public.api.auction.chvcm.ru";

import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import {Express} from "express";
import * as morgan from "morgan";
import {RedisClient} from "redis";
import * as io from "socket.io";
import * as ioRedis from "socket.io-redis";

import {baseDir} from "../global";
import {Const} from "./const";
import {Env} from "./env";
import {authViaAuthTokenIO, errorFixer, errorHandler} from "./middleware";

/**
 * Web
 */
export class Web {
  /**
   * Instantiate instance
   */
  public static instantiate(): void {
    Web._instance = new Web();
  }

  /**
   * Instance
   */
  public static get instance(): Web {
    return Web._instance;
  }

  private static _instance: Web;

  private readonly _app: Express;
  private readonly _server: http.Server;
  private readonly _io: io.Server;
  private readonly _redisAdapter: ioRedis.RedisAdapter;

  private constructor() {
    this._app = express();
    this._server = http.createServer(this._app);

    this._io = io(this._server, {
      transports: Const.SOCKET_TRANSPORTS,
    });
    this._redisAdapter = ioRedis(Env.REDIS_URL);
    this._io.adapter(this._redisAdapter);

    this.initApp();
    this.initIO();
  }

  /**
   * Express application
   */
  public get app(): Express {
    return this._app;
  }

  /**
   * Socket.io API namespace
   */
  public get nsp(): io.Namespace {
    return this._io.of(Const.API_MOUNT_POINT);
  }

  /**
   * Close all connections
   * @throws Error
   */
  public async close(): Promise<void> {
    await util.promisify<void>((callback) =>
      this._server.close((error) => callback(error || null)),
    )();
    await util.promisify<void>((callback) =>
      this._io.close(() => callback(null)),
    )();
    await util.promisify((callback) =>
      (this._redisAdapter.pubClient as RedisClient).quit(callback),
    )();
    await util.promisify((callback) =>
      (this._redisAdapter.subClient as RedisClient).quit(callback),
    )();
  }

  /**
   * Listen and return server address
   * @throws Error
   */
  public async listen(): Promise<AddressInfo | string | null> {
    if (Env.WEB_PATH) {
      await util.promisify<void>((callback) =>
        this._server.listen(Env.WEB_PATH, () => callback(null)),
      )();
      await fs.promises.writeFile("/tmp/app-initialized", Buffer.of());
    } else {
      await util.promisify<void>((callback) =>
        this._server.listen(Env.PORT, Env.HOST, () => callback(null)),
      )();
    }
    return this._server.address();
  }

  private initApp(): void {
    if (Const.STAGING) {
      this.app.use(morgan("tiny"));
    }

    this.app.use(
      cors({
        origin(origin, callback) {
          callback(
            null,
            Env.CORS_WHITELIST.length === 0 ||
              Env.CORS_WHITELIST.includes(origin || ""),
          );
        },
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.app.use(rootRoute);
    this.app.use("/", compression(), express.static(publicDir));
    this.app.use(
      Const.APIDOC_MOUNT_POINT,
      compression(),
      express.static(path.join(baseDir, "apidoc")),
    );

    this.app.use(errorFixer);
    this.app.use(errorHandler);
  }

  private initIO(): void {
    this.nsp.use(authViaAuthTokenIO);
    this.nsp.on("connection", (socket) => {
      socket.join("lots");
    });
  }
}

import rootRoute from "../routes";
