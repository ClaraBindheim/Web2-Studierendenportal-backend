const express = require("express");
const router = express.Router();
var authenticationService = require("./authenticationService"); 

router.get("/", function(request, response, next){

    //holt die Daten für das token aus dem request header
    userCredentials = Buffer.from(request.headers.authorization.split(" ")[1], 'base64').toString().split(":");

    // an den Request-Body übergeben 
    authenticationService.createSessionToken({"userID": userCredentials[0], "password": userCredentials[1]}, function(err, token, user){
        
        if(token){
            
            response.header("Authorization", "Bearer " + token);
            
            if(user){
            
                const id = user.id;
                const userName = user.firstName + " " + user.lastName;
                const userId = user.userID;
                const isAdmin = user.isAdministrator;
                const subset = {id, userId, userName, isAdmin};
                response.send(subset);

            }
        }
        else{

            response.status(401).send("could not create Token");
        }

    })

})

module.exports = router;