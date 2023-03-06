const config = require("config");
const { default: mongoose } = require("mongoose");

var publicUserService = require("../endpoints/publicUsers/publicUsersService");

let db;//Die datenbank

function initDb(callback){

    if(db){

        return callback(null, db);       

    }
    //Gibt es die Datenbank noch nicht, muss sie hier erstmal verbunden werden
     mongoose.connect(config.db.connectionString, config.db.connectionOptions, connected);

     //connected ist eine callback funktion in einer function und gibt einen err zurück, oder übergibt dem ganz oben deklarierten db 
     //die datenbank und gibt dann erst die callbackfunction zurück. Bei der Rückgabe wird als response die datenbank connection gegeben.
     //Wieso doppelt callback?
     function connected(err, db){

        if(err){
            return callback(err);
        }
        else{

            db = db;
            return callback(null, db);
        }

     }

     //Gibt es noch keinen Admin, wird ein DefaultAdmin erstellt
     //Nicht empfohlen hier zu machen, sondern in httpServer nach dem initialisieren der db
     publicUserService.readUser("admin", function(err, result){

        if(!result){

            publicUserService.createDefaultAdmin(function(err, admin){

                if(err){

                    console.log("admin not created" + err);
                }
                else{

                    console.log("admin created");
                }
            })
        }
     })
}

function getDb(){
    return db;
}

module.exports = {
    initDb,
    getDb
}


