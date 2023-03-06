var userService = require("../publicUsers/publicUsersService");
var jwt = require("jsonwebtoken");
var config = require("config");

function isAuthenticated(request, response, next) {
    
    if (typeof request.headers.authorization !== "undefined") {
    
        let token = request.headers.authorization.split(" ")[1];
        var privateKey = config.get('session.tokenKey');
    
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
    
            if (err) {
    
                response.status(401).json({ error: "Not Authorized" });
                return;
    }
    
        return next();
    });
    
        } else {
    
            response.status(401).json({ error: "Not Authorized" });
            return;
    
        }
    }

    //Überprüfen ob der eingeloggte User ein Administrator ist
    function isAdmin(request, response, next){
        
        if (typeof request.headers.authorization !== "undefined") {
            
            let token = request.headers.authorization.split(" ")[1];
            var privateKey = config.get('session.tokenKey');
             
            const decodedToken = jwt.verify(token, privateKey, { algorithm: "HS256" });
           
            userService.readUser(decodedToken.user, function(err, result){
                //Abfrage ob User Admin ist wenn ja dann mah weiter
                if(result.isAdministrator){
                    
                    return next();
                }
                else{

                    response.status(401).json({ error: "Not Authorized"});
                    return;
                }
            })
        }
        else {
        
            response.status(401).json({ error: "Not Authorized" });
            return;
            }    
    }

module.exports = {
    isAuthenticated,
    isAdmin
}