import {app} from "./app.js";
import { connect_DB } from './db/index.js'

import "dotenv/config.js";

connect_DB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("failed to start express app",error)
        throw error
    });
    app.listen(process.env.PORT,()=>{
        console.log("server started successfully at port ", process.env.PORT)
        console.log("Listening for requests...")
    });
}).catch((err)=>{
    console.log("database connection failed",err)
    process.exit(1);
});