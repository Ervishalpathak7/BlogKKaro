
// import node modules 
import express from "express";


const app = express();

( async () => {
    try {
        // Connect Database 

        app.listen('3000' , () => {
            console.log("server is running on port 3000");
        })

    } catch (error) {
    }
})();

