const { application } = require("express");
const { isAdmin } = require("../authenticate/authenticationService");
const applicationModel = require("./applicationModel");
const Application = require("./applicationModel");
const degreeService = require("../degreeCourses/degreeService");

//Alle Applications abrufen
function getApplication(callback){

    Application.find(function(err, applications){

        if(err){
            console.log("Applications not found");
            return callback(err, null);
        }
        else{
            console.log("Search sucsessful");
            return callback(null, applications);

        }
    })
}

//Gibt alle Applications eines Users zurück
function getApplicationsOfUser(applicantUserID, callback){

    //Hier muss man nach Applications mit userID suchen?
    Application.find({applicantUserID: applicantUserID}, function(err, applications){
        
        if(err){

            console.log("Applications not found");
            return callback(err, null);  
            
        }
        else {

            var mappedResults = applications.map(function (item) {

                return { "id": item._id, "applicantUserID": item.applicantUserID, 
                "degreeCourseID": item.degreeCourseID, "targetPeriodYear": item.targetPeriodYear,
                "targetPeriodShortName": item.targetPeriodShortName }
                
            })
            
            return callback(null, mappedResults);
        
            }
            
    })

}

function getApplicationsOfCourse(degreeCourseID, callback){

    Application.find({degreeCourseID: degreeCourseID}, function(err, applications){
        
        if(err){

            console.log("Applications not found");
            return callback(err, null);  
            
        }
        else {

            var mappedResults = applications.map(function (item) {

                return { "id": item._id, "applicantUserID": item.applicantUserID, 
                "degreeCourseID": item.degreeCourseID, "targetPeriodYear": item.targetPeriodYear,
                "targetPeriodShortName": item.targetPeriodShortName }
                
            })
            
            return callback(null, mappedResults);
            }
            
    })

}


//Application erstellen 
function createApplication(applicationParams, applicantUserID, callback){

    Application.create(function(err, application){

        if(err){

            console.log("Application not created");
            return callback(err, null);  
            
        }
        else{

            var newApplicationModel = new applicationModel({

                applicantUserID: applicantUserID,
                degreeCourseID: applicationParams.degreeCourseID,
                targetPeriodYear: applicationParams.targetPeriodYear,
                targetPeriodShortName: applicationParams.targetPeriodShortName

                });     
                
                newApplicationModel.save();

                const mappedResult = { "id": newApplicationModel._id, "applicantUserID": newApplicationModel.applicantUserID, 
                                        "degreeCourseID": newApplicationModel.degreeCourseID, "targetPeriodYear": newApplicationModel.targetPeriodYear,
                                        "targetPeriodShortName": newApplicationModel.targetPeriodShortName }   
                                    
                    return callback(null, mappedResult);

                }

       })

    }

//Application lesen
function readApplication(applicationID, callback){
    
    Application.findOne(applicationID, function(err, application){
        
        if(err || !application){

            console.log("Application not found");
            return callback(err, null);  
            
        }
        else {

            const mappedResult = { "id": application._id, "applicantUserID": application.applicantUserID, 
            "degreeCourseID": application.degreeCourseID, "targetPeriodYear": application.targetPeriodYear,
            "targetPeriodShortName": applicationModel.targetPeriodShortName }                  

            return callback(null, mappedResult);
                
            }
            
    })

}


//Application updaten
function updateApplication(applicationID, reqBody, callback){

   Application.findOne(applicationID, function(err, application){

        if(err || !application){

            console.log("Application not updated");
            return callback(null, err);
        }
        else{

            const newApplication = Object.assign(application, reqBody);
            newApplication.save();
            
            const mappedResult = { "id": newApplication._id, "applicantUserID": newApplication.applicantUserID, 
            "degreeCourseID": newApplication.degreeCourseID, "targetPeriodYear": newApplication.targetPeriodYear,
            "targetPeriodShortName": newApplication.targetPeriodShortName }                  

            return callback(null, mappedResult);
        }
   })

}


//Application löschen
function deleteApplication(applicationID, callback){

    Application.findOneAndDelete(applicationID, function(err, application){

        if(err || !application){

            console.log("Application could not be deleted");
            return callback(null, err);
        }
        else{

            console.log("Application " + applicationID + " deleted");

            const mappedResult = { "id": application._id, "applicantUserID": application.applicantUserID, 
            "degreeCourseID": application.degreeCourseID, "targetPeriodYear": application.targetPeriodYear,
            "targetPeriodShortName": applicationModel.targetPeriodShortName }                  

            return callback(null, mappedResult);

        }

    })
}

//Finde Application mit zwei Filtern
function findApplicationByCourseAndUser(applicantUserID, degreeCourseID, callback){

    Application.findOne({applicantUserID: applicantUserID, degreeCourseID: degreeCourseID}, function(err, application){

        if(err){

            return callback(null, err);

        }
        else{

            return callback(null, application);

        }
    })
}


module.exports = {
    getApplication,
    createApplication,
    readApplication,
    updateApplication,
    deleteApplication,
    getApplicationsOfUser,
    getApplicationsOfCourse,
    findApplicationByCourseAndUser
}