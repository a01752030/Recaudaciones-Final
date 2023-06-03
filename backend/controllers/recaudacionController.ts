import { Schema, Types , Model, HydratedDocument,Document } from "mongoose";
import { NextFunction, Request, Response } from "express";
import AbstractController from "./AbstractController";

import { FunModel, IFun, } from "../models/recaudacionModel";

class FunController extends AbstractController{
    private static instance: FunController;
    private readonly _model: Model<IFun> = FunModel;

    public static getInstance():AbstractController{
        if (!this.instance){
            this.instance = new FunController('fun')
        } 
        return this.instance
    } 

    protected initializeRoutes(): void {
        this.router.get("/totalDonaciones/:fundacion",this.DonTotal.bind(this));
        this.router.post("/donacion",this.donacion.bind(this));
        this.router.post("/configuracion",this.conf.bind(this));
        this.router.get("/todo",this.Todo.bind(this));
        this.router.post("/create",this.createNewDocument.bind(this))
    }

    private async createNewDocument(req: Request, res: Response): Promise<void> {
        try {
          const { _id, fundacion, proposito, meta, saldo } = req.body;
      
          const savedFund: IFun = await FunModel.create({
            _id,
            fundacion,
            proposito,
            meta,
            saldo
          });
      
          res.status(201).json({ message: "New document created successfully", fund: savedFund });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      }

    private async Todo(req: Request, res: Response): Promise<void> {
        try {
          const funds: IFun[] = await FunModel.find();
      
          res.status(200).json({ funds });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      }      

      private async DonTotal(req: Request, res: Response): Promise<void> {
        try {
          const fundacion = req.params.fundacion;
      
          const fund: IFun | null = await FunModel.findOne({ fundacion });
      
          if (!fund) {
            res.status(404).json({ error: "Fundacion not found" });
          } else {
            const donacion: number | undefined = fund?.saldo;
            res.status(200).json({ donacion });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      }

      private async donacion(req: Request, res: Response): Promise<void> {
        try {
            const { fundacion, donacion } = req.body;
    
            const updatedFund = await FunModel.findOneAndUpdate(
                { fundacion: fundacion },
                { $inc: { saldo: donacion } },
                { new: true }
            );
    
            if (!updatedFund) {
                res.status(404).json({ error: "Fundacion not found" });
                return;
            }
    
            res.status(200).json({ message: "Donation added successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
            
        
    private async conf(req: Request, res: Response): Promise<void> {
            try {
              const { fundacion, proposito, meta } = req.body;
        
              const updatedFund = await FunModel.findOneAndUpdate(
                { fundacion },
                { proposito, meta },
                { new: true }
              );
        
              if (!updatedFund) {
                res.status(404).json({ error: "Fundacion not found" });
                return;
              }
        
              res.status(200).json({ message: "Configuration updated successfully" });
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: "Internal server error" });
            }
          }
        

}

export default FunController;
function next() {
  throw new Error("Function not implemented.");
}
