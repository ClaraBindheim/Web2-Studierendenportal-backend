var mongoose = require("mongoose");

const DegreeSchema = new mongoose.Schema({

    universityName: String,
    universityShortName: String,
    departmentName: String,
    departmentShortName: String,
    name: String,
    shortName: String,
    
})

module.exports = mongoose.model("degreeCourse", DegreeSchema);