var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

//Mit mongoose ein Schema erstellen, das die Attribute enthält
const PublicUsersSchema = new mongoose.Schema({

    userID: {type: String,
            required: true,
            immutable: true
    },
    firstName: String,
    lastName: String,
    password: String,
    isAdministrator: {
        type: Boolean,
        default: false
    }

})

//password hashing
PublicUsersSchema.pre("save", function (next){

    var publicUser = this;
    //Wenn der PublicUser verändert wir, wird das Password gehashed
    if(!publicUser.isModified("password")){

        return next()
    };
    bcrypt.hash(publicUser.password, 10).then((hashedPassword) => {

        publicUser.password = hashedPassword;
        next();
    }),
    
    function (err){

        next(err);
    }
})

PublicUsersSchema.methods.comparePassword = function(candidatePassword, next){
    
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        
        if(err){

            return next(err);
        }
        else{
            
            next(null, isMatch);
           
        }
    })
}

module.exports = mongoose.model("publicUsers", PublicUsersSchema);