//Imports:
const https = require("https");
const express = require("express");
const database = require("./database/db");
const fs = require('fs');
const key = fs.readFileSync('./certificates/key.pem');
const cert = fs.readFileSync('./certificates/cert.pem');
var cors = require("cors");

//Connect routes
const publicUsersRoute = require("./endpoints/publicUsers/publicUseresRoute");
const userRoute = require("./endpoints/users/userRoute");
const authenticateRoute = require("./endpoints/authenticate/authenticationRoute");
const degreeCourseRoute = require("./endpoints/degreeCourses/degreeRoute");
const applicationRoute = require("./endpoints/degreeCourseApplications/applicationRoute");

const app = express();
app.use("*", cors({exposedHeaders: ["Authorization"]}));

app.use(express.json());//Um request.body zu benutzen

//Add route: benutze diese routen aus dem vorgeschriebenen Ordner, api muss dabei sein
app.use("/api/publicUsers", publicUsersRoute);
app.use("/api/users", userRoute);
app.use("/api/authenticate", authenticateRoute);
app.use("/api/degreeCourses", degreeCourseRoute);
app.use("/api/degreeCourseApplications", applicationRoute);


const port = 80;

//Connect database:
database.initDb(function(err, db){

    if(db){

        console.log("Database connected");
    }
    else{
        console.log("Database could not connect");
    }
}); 

//http connect
//app.listen(port, () => {
//    console.log("Connected to Port: " + port)
//});

//https connect
const server = https.createServer({key: key, cert: cert }, app);

app.get('/', (req, res) => { 
    
    res.send('this is an secure server'); 

});

server.listen(443, () => { 
    
    console.log('listening on 443'); 

});
