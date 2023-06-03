import { Schema, Types , model } from "mongoose";

//interfaz de usuario
export interface IUsuario{
    _id: Types.ObjectId;
    nombre: string;
    fundacion: string;
    email: string;
}

//Esquema

const userSchema = new Schema <IUsuario>({
    _id: {type: Schema.Types.ObjectId, required: true},
    nombre: {type: String, required: true},
    fundacion: {type:String, required: true}
});

export const User = userSchema;
export const UserModel = model<IUsuario>('User',userSchema)