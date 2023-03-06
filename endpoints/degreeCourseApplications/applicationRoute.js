const { get } = require("config");
const { request } = require("express");
const express = require("express");
const router = express.Router();
const config = require("config");
var jwt = require("jsonwebtoken");


//importieren
var applicationService = require("./applicationService");
var authenticationUtils = require("../utils/authenticationUtils");
const degreeService = require("../degreeCourses/degreeService");

// Get methode alle zurück zu geben
router.get("/", authenticationUtils.isAuthenticated, authenticationUtils.isAdmin, function(request, response){

    if(request.query.applicantUserID){

        applicationService.getApplicationsOfUser(request.query.applicantUserID, function(err, result){

             //Wenn resut != null, ist response das Objekt also der User
             if(result){

                response.send(Object.values(result));

            }
            else{

                response.status(404).send("Applications not found");

            }

        });

    }
    else{

        applicationService.getApplication(function(err, result){

            //Wenn resut != null, ist response das Objekt also der User
            if(result){

                response.send(Object.values(result));

            }
            else{

                response.status(404).send("Applications not found");

            }
        })

    }

})

// Get methode alle zurück zu geben
router.get("/myApplications", authenticationUtils.isAuthenticated, function(request, response){

    //userID herausfinden
    let token = request.headers.authorization.split(" ")[1];
    var privateKey = config.get('session.tokenKey');
     
    const decodedToken = jwt.verify(token, privateKey, { algorithm: "HS256" });
    var applicantUserID = decodedToken.user;

        applicationService.getApplicationsOfUser(applicantUserID, function(err, result){
            
            //Wenn resut != null, ist response das Objekt also der User
            if(result){

                response.send(Object.values(result));

            }
            else{

                response.status(404).send("Applications not found");

            }
        })  
})


//get function um einen bestimmte Application zu bekommen
router.get("/:application", authenticationUtils.isAuthenticated, function(request, response){

    //applicationID herausfinden
    var reqApplicationID = request.params.id;
            
              //userID an readUser übergeben um in findOne() zu benutzen
             applicationService.readApplication(reqApplicationID, function(err, result){

                if(result){
                
                     response.status(200).send(result);            
    
                  }
                 else{
    
                     response.status(404).send("Application not found");
    
                     }
    })

})


//Post function... für createApplication
router.post("/", authenticationUtils.isAuthenticated, function(request, response){         

    const applicationParams = request.body;
    var applicantUserID = ""; 

    if(!applicationParams.applicantUserID){
        //userID herausfinden
        let token = request.headers.authorization.split(" ")[1];
        var privateKey = config.get('session.tokenKey');
         
        const decodedToken = jwt.verify(token, privateKey, { algorithm: "HS256" });
        applicantUserID = decodedToken.user;    
        }
        else{
    
            applicantUserID = applicationParams.applicantUserID;
    
        }   
        
    //Überprüfen ob es den DegreeCourse überhaupt gibt  
    degreeService.readCours(applicationParams.degreeCourseID, function(err, result){
        
        if(!result){

            response.status(400).send("DegreeCourse not in Database");
            
        }
        else{

            //Überprüfung ob es schon eine Application gibt
            applicationService.findApplicationByCourseAndUser(applicantUserID, request.body.degreeCourseID, function(err, res){
           
                if(res){

                    console.log("Application already in Database");
                    response.status(400).send("Application already in Database")
                }
                else{

                    applicationService.createApplication(applicationParams, applicantUserID, function(err, application){
            
                        if(err){
                                            
                            response.send("Application not created");
                    
                        }
                        else{ 
                    
                            response.status(201).send(application);
                                                    
                        }   
                    })

                }
            })
        }

    })
})
    

//put für update
router.put("/:applicationID", authenticationUtils.isAuthenticated, function(request, response){

    //id herausfinden
    var reqApplicationID = request.params.id;
    var reqBody = request.body;
            
        //id und zu ändernde Variablen übergeben
        applicationService.updateApplication(reqApplicationID, reqBody, function(err, result){

            //Hier if(result) weil err nicht den Status sendet wenn kein user gefunden wird
            if(result){
                        
                response.status(200).send(result);
            }
            else{

                response.status(404).send("Application not updated");
        
            }
        })
})

//delete zum löschen
router.delete("/:applicationID", authenticationUtils.isAuthenticated, function(request, response){

     //id herausfinden
     var reqApplicationId = request.params.id;

     applicationService.deleteApplication(reqApplicationId, function(err, result){
 
        //Hier if(result) weil err nicht den Statud sendet wenn kein user gefunden wird
        if(result){

            response.status(204).send();
        } 
        else{

            response.status(404).send("Application not deleted: " + err);
        }

     })    

})

module.exports = router;