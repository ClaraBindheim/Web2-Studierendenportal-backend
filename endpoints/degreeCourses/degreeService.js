const { isObjectIdOrHexString } = require("mongoose");
const degreeModel = require("./degreeModel");
const Course = require("./degreeModel");
const Application = require("../degreeCourseApplications/applicationModel");

//Alle Courses abrufen
function getCourses(callback){

    Course.find(function(err, courses){

        if(err){
            console.log("Course not found");
            return callback(err, null);
        }
        else{
            
            console.log("Search sucsessful");
           
            var mappedResults = courses.map(function (item) {

                return { "id": item._id, "universityName": item.universityName, "universityShortName": item.universityShortName, 
                "departmentName": item.departmentName, "departmentShortName": item.departmentShortName,
                "name": item.name, "shortName": item.shortName }
                
            })
            
            return callback(null, mappedResults);

        }
    })
}

//Gibt alle Courses einer Hochschule zurück
function getCoursesOfSchool(schoolShortName, callback){

    //findet user mit der übergebenen userID
    Course.find({universityShortName: schoolShortName}, function(err, courses){
        
        if(err){

            console.log("Course not found");
            return callback(err, null);  
            
        }
        else {

                var mappedResults = courses.map(function (item) {
                
                return { "id": item._id, "universityName": item.universityName, "universityShortName": item.universityShortName, 
                "departmentName": item.departmentName, "departmentShortName": item.departmentShortName,
                "name": item.name, "shortName": item.shortName }

                })

                return callback(null, mappedResults);
            }
            
    })

}


//Cours erstellen 
function createCourse(courseParams, callback){

    Course.create(function(err, course){

        if(err){

            console.log("Course not created" + err);
            return callback(err, null);  
            
        }
        else{

            const courseModel = new degreeModel({

                universityName: courseParams.universityName,
                universityShortName: courseParams.universityShortName,
                departmentName: courseParams.departmentName,
                departmentShortName: courseParams.departmentShortName,
                name: courseParams.name,
                shortName: courseParams.shortName
                });


            courseModel.save();

            const mappedResult = { "id": courseModel._id, "universityName": courseModel.universityName, "universityShortName": courseModel.universityShortName, 
            "departmentName": courseModel.departmentName, "departmentShortName": courseModel.departmentShortName,
            "name": courseModel.name, "shortName": courseModel.shortName }                  
            
            return callback(null, mappedResult);

        } 

    })

}

//Course lesen
function readCours(courseID, callback){
   
    Course.findOne({$or:[{id: courseID}, {_id: courseID}]}, function(err, course){
        
        if(err){

            console.log("Course not found");
            return callback(err, null);  
            
        }
        else {
            
            const mappedResult = { "id": course._id, "universityName": course.universityName, "universityShortName": course.universityShortName, 
            "departmentName": course.departmentName, "departmentShortName": course.departmentShortName,
            "name": course.name, "shortName": course.shortName, "degreeCourseApplications": course.degreeCourseApplications }                  
            
            return callback(null, mappedResult);
                
            }  
    })
}


//Course updaten
function updateCours(courseID, reqBody, callback){
    console.log(courseID);
   Course.findOne({_id: courseID}, function(err, course){

        if(err || !course){

            console.log("DegreeCourse not updated");
            return callback(null, err);
        }
        else{

            const newCourse = Object.assign(course, reqBody);
            newCourse.save();
            console.log(course);
            const mappedResult = { "id": newCourse._id, "universityName": newCourse.universityName, "universityShortName": newCourse.universityShortName, 
            "departmentName": newCourse.departmentName, "departmentShortName": newCourse.departmentShortName,
            "name": newCourse.name, "shortName": newCourse.shortName }                  
            
            return callback(null, mappedResult);
        }
   })

}


//Course löschen
function deleteCours(courseId, callback){

    //deletes user mit der übergebenen userID
    Course.findOneAndDelete(courseId, function(err, course){

        if(err || !course){

            console.log("Cours could not be deleted");
            return callback(null, err);
        }
        else{

            console.log("DegreeCourse " + courseId + " deleted");
           
            const mappedResult = { "id": course._id, "universityName": course.universityName, "universityShortName": course.universityShortName, 
            "departmentName": course.departmentName, "departmentShortName": course.departmentShortName,
            "name": course.name, "shortName": course.shortName }                  
            
            return callback(null, mappedResult);

        }

    })
}


module.exports = {
    getCourses,
    createCourse,
    readCours,
    updateCours,
    deleteCours,
    getCoursesOfSchool
}