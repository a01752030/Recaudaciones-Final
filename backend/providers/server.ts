import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AbstractController from "../controllers/AbstractController";

class Server {
  private _app: express.Application;
  private port: number;
  private mongoUrl: string;
  private server: any;

  constructor(appInit: {
    port: number;
    controllers: AbstractController[];
    mongoUrl: string;
  }) {
    this._app = express();
    this._app.use(express.json()); 
    this.port = appInit.port;
    this.mongoUrl = appInit.mongoUrl;
    this.loadControllers(appInit.controllers);
  }

  private loadControllers(controllers: AbstractController[]): void {
    controllers.forEach((controller: AbstractController) => {
      this._app.use(`/${controller.prefix}`, controller.router);
    });
  }

  public init(): void {

    // Log details of the requests
    this._app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - startTime;
        console.log(
          `${req.method} ${req.path} ${res.statusCode} ${duration}ms`
        );
      });
      next();
    });

    this.server = this._app.listen(this.port, () => {
      console.log(`Server Running @'http://localhost:${this.port}'`);
    });
  }

  public async close(): Promise<void> {
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err: any) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  public connect(): void {
    mongoose
      .connect(this.mongoUrl, {})
      .then(() => {
        console.log("Successfully connected to MongoDB");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public disconnect(): void {
    mongoose.disconnect().then(() => {});
  }

  public get app(): express.Application {
    return this._app;
  }
}

export default Server;