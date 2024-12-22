 // require('dotenv').config({path: '.env'})
 // one method 

import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
})
connectDB() //since this DB is connected in a async function, we need to handle the promise that is returned by the function by .then and .catch
.then(()=> {
    app.on("error", (error) => {
        console.log("Error: ", error);
        throw error
    }) // checking for any errors that may occur during the connection of the server
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO Db connection is failed!! ", err);
})


//this is first approach to connect to the database
/*
import express from "express";
const app = express();

// this is a ifie function that will run as soon as the file is loaded
// ; is used to prevent any errors that may occur due to the code before it

;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)     
        app.on("error", (error)=> {
            console.log("Error: ", error);
            throw error
        })   

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port {process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR: ", error);
        throw err
    }
})()
*/