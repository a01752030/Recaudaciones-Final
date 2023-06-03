import Server from "./providers/server";

import userController from "./controllers/userController";
import recaudacionController from "./controllers/recaudacionController"

const server = new Server({
    port: 8080,
    controllers:[
        userController.getInstance(),
        recaudacionController.getInstance()
    ],
    mongoUrl: "mongodb://127.0.0.1:27017/Recaudaciones",
})  

server.connect();
server.init();  