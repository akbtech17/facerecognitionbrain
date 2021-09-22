const express = require('express');

const app = express();

const database = {
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
    // res.send("this is working");
    res.json(database.users);
})


app.post('/signin', (req,res) => {
    const new_user = req.body;
    // console.log(new_user)
    const users = database.users;
    
    for(var i=0; i<users.length; i++) {
        if(users[i].email == new_user.email && users[i].password == new_user.password) {
            res.json('sign-in successful!')
        }
    }
    res.json('registration of user is required!')

})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    // console.log(new_user);
    database.users.push({
        id:'12345',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined : new Date()
    })
    res.json(database.users[database.users.length-1]);
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