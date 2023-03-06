const { get } = require("config");
const { request } = require("express");
const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
var config = require("config");


//publicUserService importieren
var publicUserService = require("../publicUsers/publicUsersService");
var authenticationUtils = require("../utils/authenticationUtils");

// Get methode alle user zurück zu geben
router.get("/", authenticationUtils.isAuthenticated, authenticationUtils.isAdmin, function(request, response){

    
        publicUserService.getUsers(false, function(err, result){

        //Wenn resut != null, ist response das Objekt also der User
        if(result){

            response.send(Object.values(result));

        }
        else{

            response.status(400).send("Users not found");

        }
    })

})

//get function um einen bestimmten user zu bekommen
//:userID an den pfad hängen um bestimmten user zu bekommen
router.get("/:userID", authenticationUtils.isAuthenticated, function(request, response){

    //userID herausfinden
    var reqUserID = request.params.userID;
    let token = request.headers.authorization.split(" ")[1];
    var privateKey = config.get('session.tokenKey');
     
    const decodedToken = jwt.verify(token, privateKey, { algorithm: "HS256" });

    publicUserService.readUser(decodedToken.user, function(err, res){

        if(reqUserID === decodedToken.user || res.isAdministrator){
            
              //userID an readUser übergeben um in findOne() zu benutzen
              publicUserService.readUser(reqUserID, function(err, result){

                if(result){
                
                    const id = result.id;
                    const firstName = result.firstName;
                    const lastName = result.lastName;
                    const userID = result.userID;
                    const isAdmin = result.isAdministrator;
                    const subset = {id, userID, firstName, lastName, isAdmin};
                    response.status(200).send(subset);           
    
                  }
                 else{
    
                     response.status(400).send("User not found");
    
                     }
        
                 })
        }
        else{

            response.status(401).json({ error: "Not Authorized" });
        }
    })

})


//Post function... für createUser
router.post("/", authenticationUtils.isAuthenticated, authenticationUtils.isAdmin, function(request, response){         

            //Vor dem speichern nachschauen ob die UserID benutzt wird
            publicUserService.readUser(request.body.userID, function(err, result){

                var userID = request.body.userID;
                const userParams = request.body;

                if(!result){
                
                    //Testen ob neuer User eine UserID hat
                    if(userID){

                        publicUserService.createUser(false, userParams, function(err, user){

                            if(err){
                        
                                 response.send("User not created");
                            }
                            else{ 
            
                                    response.status(201).send(user);
                                

                            }   
                        })
                    }
                   else{
                        
                        response.status(400).send("userId is null");
                    }    
                }  
              else{

                    response.status(400).send("User already in Database");

                }          

            })


    })
    

//put für update
router.put("/:userID", authenticationUtils.isAuthenticated, function(request, response){

    //userID herausfinden
    var reqUserID = request.params.userID;
    var reqBody = request.body;
    
    let token = request.headers.authorization.split(" ")[1];
    var privateKey = config.get('session.tokenKey');
     
    const decodedToken = jwt.verify(token, privateKey, { algorithm: "HS256" });

    publicUserService.readUser(decodedToken.user, function(err, res){
        
        if(reqUserID === decodedToken.user || res.isAdministrator){
            
            //id und zu ändernde Variablen übergeben
            publicUserService.updateUser(false, reqUserID, reqBody, res.isAdministrator, function(err, result){

                //Hier if(result) weil err nicht den Status sendet wenn kein user gefunden wird
                if(result){
                        
                    response.status(200).send(result);
                }
                else{

                    response.status(400).send("User not updated");
        
                }
            })
      }
      else{

          response.status(500).json({ error: "Not Authorized" });
      }

    })
    
})

//delete zum löschen
router.delete("/:userID", authenticationUtils.isAuthenticated, authenticationUtils.isAdmin, function(request, response){

     //userID herausfinden
     var reqUserID = request.params.userID;

     //userID an readUser übergeben um in deleteOne() zu benutzen
     publicUserService.deleteUser(reqUserID, function(err, result){
 
        //Hier if(result) weil err nicht den Statud sendet wenn kein user gefunden wird
        if(result){

            response.status(204).send();
        } 
        else{

            response.status(400).send("User not deleted: " + err);
        }

     })    

})

module.exports = router;