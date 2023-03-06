const publicUsersModel = require("./publicUsersModel");
const User = require("./publicUsersModel");

function getUsers(isPublic, callback){

         User.find(function(err, users){

            if(err){

                console.log("Users not found");
                return callback(err, null);

            }
             else{

                console.log("Search successful");

                var newUsers = [];

                if(!isPublic){
    
                    users.forEach(object => {
        
                        let tempUsers = {
                            userID: object.userID,
                            firstName: object.firstName,
                            lastName: object.lastName,
                            isAdministrator: object.isAdministrator
                        }

                        newUsers.push(tempUsers);
                        
                    });
                  
                }
                else {

                    newUsers = users;
        
                }

                return callback(null, newUsers);    
                
        }
    })
}

//User erstellen 
function createUser(isPublic, userParams, callback){

    User.create(function(err, user){

        if(err){

            console.log("User not created" + err);
            return callback(err, null);  
            
        }
        else{

            const publicUser = new publicUsersModel({
                userID: userParams.userID,
                firstName: userParams.firstName,
                lastName: userParams.lastName,
                password: userParams.password,
                isAdministrator: userParams.isAdministrator
                });
                
            publicUser.save();

            var newUser = publicUser;

                if(!isPublic){

                        let newUser = {
                            userID: publicUser.userID,
                            firstName: publicUser.firstName,
                            lastName: publicUser.lastName,
                            isAdministrator: publicUser.isAdministrator
                        }

                        return callback(null, newUser);
                  
                }
                else {

                    return callback(null, newUser);
        
                }
        } 

    })

}

//User lesen
function readUser(userID, callback){
    
    //findet user mit der übergebenen userID
    User.findOne({userID: userID}, function(err, user){
        
        if(err){

            console.log("User not found");
            return callback(err, null);  
            
        }
        else {

                return callback(null, user);

            }
            
    })
}

//User updaten
//erst findOne dann werte setzen (object assign) dann save()
//Abfrage ob UserID kommt eigentlich in Service
function updateUser(isPublic, userID, reqBody, isAdmin, callback){

   User.findOne({userID: userID}, function(err, user){

        if(err || !user){

            console.log("User not updated");
            return callback(null, err);
        }
        else{
                if(!isPublic){

                    if(!isAdmin){

                        if(reqBody.isAdministrator){

                            console.log("User not updated");
                            return callback(null, err);
                        }
                        else{

                            const newUser = Object.assign(user, reqBody);
                            newUser.save();

                            let showUser = {
                                userID: newUser.userID,
                                firstName: newUser.firstName,
                                lastName: newUser.lastName,
                                isAdministrator: newUser.isAdministrator
                            }

                        return callback(null, showUser);

                        }
                        

                    }
                    else{
                        
                        const newUser = Object.assign(user, reqBody);
                        newUser.save();

                        let showUser = {
                            userID: newUser.userID,
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            isAdministrator: newUser.isAdministrator
                        }

                        return callback(null, showUser);
                    }
                }
                else {

                    const newUser = Object.assign(user, reqBody);
                    newUser.save();
                    return callback(null, newUser);
        
                }
        }
   })

}

//User löschen
function deleteUser(userID, callback){

    //deletes user mit der übergebenen userID
    User.findOneAndDelete({userID: userID}, function(err, user){

        if(err || !user){

            console.log("User could not be deleted");
            return callback(null, err);
        }
        else{

            console.log("User " + userID + " deleted");
            return callback(null, user);

        }

    })
}

//Erstellen eines default admins
function createDefaultAdmin(callback){

    User.create(function(err, admin){

        if(err){

            console.log("User not created" + err);
            return callback(err, null);  
            
        }
        else{

            const admin = new publicUsersModel({
                userID: "admin",
                firstName: "Udo",
                lastName: "Müller",
                password: 123,
                isAdministrator: true
                });
                
            admin.save();
            return callback(null, admin);

        } 
    })    

}


module.exports = {
    getUsers,
    createUser,
    readUser,
    updateUser,
    deleteUser,
    createDefaultAdmin
}