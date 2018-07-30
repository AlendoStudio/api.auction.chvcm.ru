import * as http from "http";
import * as path from "path";

import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import {Express} from "express";
import * as bearerToken from "express-bearer-token";
import * as fileUpload from "express-fileupload";
import * as helmet from "helmet";
import * as morgan from "morgan";

import * as cors from "cors";
import {Global} from "../global";
import {Const} from "./const";
import {Env} from "./env";
import {ResponseChain} from "./index";

import rootRoute from "../routes/index";

/**
 * Web
 */
export class Web {
  /**
   * Instantiate web
   */
  public static instantiate() {
    Web._instance = new Web();
  }

  /**
   * Instance
   * @returns {Web}
   */
  public static get instance(): Web {
    return Web._instance;
  }

  private static _instance: Web;

  private readonly _app: Express;
  private readonly _server: http.Server;
  private readonly _views: string;

  private constructor() {
    this._app = express();
    this._server = http.createServer(this._app);
    this._views = path.join(Global.baseDir, "views");
    this.init();
  }

  /**
   * Express application
   * @returns {e.Express}
   */
  public get app(): Express {
    return this._app;
  }

  /**
   * Http server
   * @return {module:http.Server}
   */
  public get server(): http.Server {
    return this._server;
  }

  /**
   * Close all connections
   * @returns {Promise<void>}
   */
  public async close() {
    await this.closeServer(this.server);
  }

  /**
   * Listen
   * @returns {Promise<void>}
   */
  public listen(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.server.listen(Env.PORT, Env.HOST, () => {
        resolve();
      });
    });
  }

  private init() {
    this.initApp();
  }

  private initApp() {
    this.app.use(ResponseChain.middleware());

    if (Const.STAGING) {
      this.app.use(morgan("tiny"));
    }

    this.app.use(helmet());

    this.app.use(express.static(path.join(Global.baseDir, "build")));

    this.app.use(cors({
      origin(origin, callback) {
        callback(null, Env.CORS_WHITELIST.length === 0 || Env.CORS_WHITELIST.indexOf(origin) !== -1);
      },
    }));

    this.app.use(compression());
    this.app.use(bearerToken());

    this.app.use(bodyParser.json({
      limit: Env.EXPRESS_BODY_PARSER_LIMIT,
    }));
    this.app.use(fileUpload({ // TODO: configure file upload
      abortOnLimit: true,
      limits: {
        fields: 0,
        fileSize: Env.BUSBOY_LIMITS_FILESIZE,
        files: 1,
      },
    }));

    this.app.use("/", rootRoute);

    this.app.use(ResponseChain.errorHandlerMiddleware);
  }

  private closeServer(server: {
    close(callback: () => void): any;
  }): Promise<void> {
    return new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  }
}
