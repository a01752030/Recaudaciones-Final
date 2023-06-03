import { Schema, Types , Model, HydratedDocument } from "mongoose";
import { NextFunction, Request, Response } from "express";
import AbstractController from "./AbstractController";
import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });

import { UserModel, IUsuario, } from "../models/userModel";

class userController extends AbstractController{
    private static instance: userController;
    private readonly _model: Model<IUsuario> = UserModel;
    private cognito: AWS.CognitoIdentityServiceProvider;

    public static getInstance():AbstractController{
        if (!this.instance){
            this.instance = new userController()
        } 
        return this.instance
    }   
    constructor() {
      super('user');
      this.cognito = new AWS.CognitoIdentityServiceProvider();
    }        

    protected initializeRoutes(): void {
        this.router.post("/signup",this.createUser.bind(this));
        this.router.post("/signin", this.signIn.bind(this));
        this.router.post("/verify",this.verifyUser.bind(this));
        this.router.post("/verification-token", this.getVerificationToken.bind(this));
        //this.router.post("/test",this.test.bind(this));
    }


    public async createUser(req: Request, res: Response): Promise<void> {
      try {
        const { nombre, fundacion, email, password } = req.body;
    
        const userPoolId = "us-east-1_ARVF3iMJB";
        const params = {
          UserPoolId: userPoolId,
          Username: email,
          TemporaryPassword: password,
          UserAttributes: [
            {
              Name: "email",
              Value: email,
            },
          ],
        };
        const cognitoUser = await this.cognito.adminCreateUser(params).promise();
    
        if (!cognitoUser.User) {
          throw new Error("Cognito user not found");
        }
    
        const newUser: IUsuario = {
          _id: new Types.ObjectId(),
          nombre,
          fundacion,
          email: cognitoUser.User?.Username || "",
        };

        const createdUser = await UserModel.create(newUser);
    
        res.status(200).json({ message: "User created successfully", user: createdUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }


    public verifyUser(req: Request, res: Response): void {
      const { email, verificationCode } = req.body;
  
      const params = {
        ClientId: "blkf8b3qj5deim2snvar8q2ma",
        Username: email,
        ConfirmationCode: verificationCode,
      };
  
      this.cognito.confirmSignUp(params, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.status(200).json({ message: "User verification successful" });
        }
      });
    }
    
    public signIn(req: Request, res: Response): void {
      const { email, password } = req.body;
    
      const params = {
        AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
        ClientId: "blkf8b3qj5deim2snvar8q2ma", 
        UserPoolId: "us-east-1_ARVF3iMJB", 
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      };
    
      this.cognito.adminInitiateAuth(params, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.status(200).json({message: "Sign in succesfull" });
        }
      });
    }
    
    public getVerificationToken(req: Request, res: Response): void {
      const { email } = req.body;
    
      const params = {
        UserPoolId: "us-east-1_ARVF3iMJB", // Replace with your user pool ID
        Username: email,
      };
    
      this.cognito.adminGetUser(params, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        } else {
          const userAttributes = data.UserAttributes || [];
    
          const verificationAttribute = userAttributes.find(
            (attribute) => attribute.Name === "email_verified"
          );
    
          if (!verificationAttribute) {
            res.status(404).json({ error: "Email not found" });
          } else if (verificationAttribute.Value !== "true") {
            res.status(400).json({ error: "Email not verified" });
          } else {
            const tokenAttribute = userAttributes.find(
              (attribute) => attribute.Name === "email_verified_token"
            );
    
            if (!tokenAttribute) {
              res.status(404).json({ error: "Verification token not found" });
            } else {
              const verificationToken = tokenAttribute.Value;
              res.status(200).json({ verificationToken });
            }
          }
        }
      });
    }
   }    

export default userController;
function next() {
  throw new Error("Function not implemented.");
}
