const express = require('express');

const app = express();

app.get('/',(req, res)=> {
    res.send("home is sending some data");
})

app.listen(3000, ()=> {
    console.log("FaceRecog is Running on Port3000");
})


/* 
/                 --> res = this is working
/signin           --> POST = success/fail
/register         --> POST = return user
/profile/:userid  --> GET = user
/image            --> PUT(update) = return the user
*/