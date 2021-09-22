const express = require('express');

const app = express();

const databse = {
    users : [
        {
            id:'123',
            name:'Anshul Bansal',
            email: 'akb.tech17@gmail.com',
            password: 'asumasum',
            entries: 0,
            joined : new Date()
        },
        {
            id:'1234',
            name:'Aatmic Tiwari',
            email: 'aatmic@gmail.com@',
            password: 'taatmic',
            entries: 0,
            joined : new Date()
        },
        
    ]
}
app.use(express.json());
app.get('/', (req, res) => {
    res.send("this is working");
})


app.post('/signin', (req,res) => {
    const suser = req.body;
    // console.log(suser)
    const users = databse.users;
    
    for(var i=0; i<users.length; i++) {
        if(users[i].email == suser.email && users[i].password == suser.password) {
            res.json('sign-in successful!')
        }
    }
    res.json('registration of user is required!')

})

app.listen(3000, ()=> {
    console.log("FaceRecog is Running on Port3000");
})


/* EndPoints

/                 --> res = this is working
/signin           --> POST = success/fail
{here we do post because we dont want our pass to be exposed in query string}
/register         --> POST = return user
/profile/:userid  --> GET = user
/image            --> PUT(update) = return the user
*/