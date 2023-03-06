var userService = require("../publicUsers/publicUsersService");
var jwt = require("jsonwebtoken");
var config = require("config");

function createSessionToken(loginData, callback){
    
    if(!loginData){

        callback("JSON-Body missing", null, null);
        return;

    }

    userService.readUser(loginData.userID, function(err, result){

        if(result){

            result.comparePassword(loginData.password, function(err, isMatch){
                
                if(err || !isMatch){

                    console.log("password not valid")
                    callback(err, null);
                }
                else{

                    var issuedAt= new Date().getTime();
                    var expirationime = config.get("session.timeout");
                    var expiresAt = issuedAt + (expirationime);
                    var privateKey = config.get("session.tokenKey");
                    let token = jwt.sign({"user": result.userID}, privateKey, {expiresIn: expiresAt, algorithm: "HS256"});

                    callback(null, token, result);
                    
                }
            })
        }

    })

}

module.exports = {
    createSessionToken
}