import { Schema, Types , model } from "mongoose";

//interfaz de fundacion
export interface IFun{
    _id: Types.ObjectId;
    fundacion: string;
    proposito: string;
    meta: number;
    saldo: number;
}

//Esquema

const FunSchema = new Schema <IFun>({
    _id: {type: Schema.Types.ObjectId, required: true},
    fundacion: {type: String, required: true},
    proposito: {type:String, required: true}, 
    meta: {type:Number, required: true},
    saldo:{type:Number, required:true}
});

export const Fun = FunSchema;
export const FunModel = model<IFun>('Fun',FunSchema)