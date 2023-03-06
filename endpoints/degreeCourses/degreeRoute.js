const { get } = require("config");
const { request } = require("express");
const express = require("express");
const router = express.Router();


//importieren
var degreeCourseService = require("./degreeService");
var authenticationUtils = require("../utils/authenticationUtils");
var applicationService = require("../degreeCourseApplications/applicationService");

// Get methode alle zurück zu geben
router.get("/", authenticationUtils.isAuthenticated, authenticationUtils.isAdmin, function(request, response){

    if(request.query.universityShortName){

        degreeCourseService.getCoursesOfSchool(request.query.universityShortName, function(err, result){

             //Wenn resut != null, ist response das Objekt also der User
             if(result){

                response.send(Object.values(result));

            }
            else{

                response.status(404).send("Courses not found");

            }

        });

    }
    else{

        degreeCourseService.getCourses(function(err, result){

            //Wenn resut != null, ist response das Objekt also der User
            if(result){

                response.send(Object.values(result));

            }
            else{

                response.status(404).send("Courses not found");

            }
        })

    }

})

//get function um einen bestimmten course zu bekommen
router.get("/:courseId", authenticationUtils.isAuthenticated, function(request, response){

    //courseId herausfinden
    var reqCourseID = request.params.id;
            
              //userID an readUser übergeben um in findOne() zu benutzen
             degreeCourseService.readCours(reqCourseID, function(err, result){

                if(result){
                
                     response.status(200).send(result);            
    
                  }
                 else{
    
                     response.status(404).send("Course not found");
    
                     }
    })

})


//Post function... für createCourse
router.post("/", authenticationUtils.isAuthenticated, authenticationUtils.isAdmin, function(request, response){         

    const courseParams = request.body;

        degreeCourseService.createCourse(courseParams, function(err, course){

            if(err){
                        
                 response.send("Course not created");

                }
                else{ 
                    
                    response.status(201).send(course);        

                }   
        })

})
    

//put für update /:courseId
router.put("/:_id", authenticationUtils.isAuthenticated, function(request, response){

    //id herausfinden
    //var reqCourseId = request.params._id;
    var reqCourseId = request.params;
    var reqBody = request.body;
            console.log(reqCourseId);
        //id und zu ändernde Variablen übergeben
        degreeCourseService.updateCours(reqCourseId, reqBody, function(err, result){

            //Hier if(result) weil err nicht den Status sendet wenn kein user gefunden wird
            if(result){
                        
                response.status(200).send(result);
            }
            else{

                response.status(404).send("Course not updated");
        
            }
        })
})

//delete zum löschen
router.delete("/:_id", authenticationUtils.isAuthenticated, authenticationUtils.isAdmin, function(request, response){

     //id herausfinden
     var reqCourseId = request.params;

     degreeCourseService.deleteCours(reqCourseId, function(err, result){
 
        //Hier if(result) weil err nicht den Statud sendet wenn kein user gefunden wird
        if(result){

            response.status(204).send();
        } 
        else{

            response.status(404).send("Course not deleted: " + err);
        }

     })    

})


//Alle Applications eines degreecourses finden
router.get("/:courseId/degreeCourseApplications", authenticationUtils.isAuthenticated, authenticationUtils.isAdmin, function(request, response){

    var reqCourseID = request.params._id;

     //userID an readUser übergeben um in findOne() zu benutzen
     degreeCourseService.readCours(reqCourseID, function(err, result){

        if(result){

            applicationService.getApplicationsOfCourse(result.id, function(error, res){

                if(err){

                    response.status(404).send("Course not found");

                }
                else{

                    response.status(200).send(res);
                    
                }

            })            

          }
         else{

             response.status(404).send("Course not found");

             }
    })

})

module.exports = router;