const { get } = require("config");
const { request } = require("express");
const express = require("express");
const router = express.Router();

//publicUserService importieren
var publicUserService = require("./publicUsersService");

// Get methode alle user zurück zu geben
router.get("/", function(request, response){

    publicUserService.getUsers(true, function(err, result){

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
router.get("/:userID", function(request, response){

    //userID herausfinden
    var reqUserID = request.params.userID;

    //userID an readUser übergeben um in findOne() zu benutzen
    publicUserService.readUser(reqUserID, function(err, result){

        
        if(result){

            response.status(200).send(result);            

        }
        else{

            response.status(400).send("User not found");

        }
    })

})


//Post function... für createUser
router.post("/", function(request, response){         

            //Vor dem speichern nachschauen ob die UserID benutzt wird
            publicUserService.readUser(request.body.userID, function(err, result){

                var userID = request.body.userID;
                const userParams = request.body;

                if(!result){
                
                    //Testen ob neuer User eine UserID hat
                    if(userID){

                        publicUserService.createUser(true, userParams, function(err, user){

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
router.put("/:userID", function(request, response){

    //userID herausfinden
    var reqUserID = request.params.userID;
    var reqBody = request.body;
    
       //id und zu ändernde Variablen übergeben
            publicUserService.updateUser(true, reqUserID, reqBody, function(err, result){

                //Hier if(result) weil err nicht den Statud sendet wenn kein user gefunden wird
                if(result){
                        
                    response.status(200).send(result);
                }
                else{

                    response.status(400).send("User not updated");
        
                }
            })

})

//delete zum löschen
router.delete("/:userID", function(request, response){

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