import {Router} from 'express';
import AbstracController from "./AbstractController"

export default abstract class AbstractController{

  private _router: Router = Router();
  private _prefix: string;

  public get router(): Router {
    return this._router;
  }

  public get prefix(): string {
    return this._prefix;
  }

  // Constructor
  protected constructor(prefix: string) {
    this._prefix = prefix;
    this.initializeRoutes();
  }

  // Initialize the routes
  protected abstract initializeRoutes(): void;


}