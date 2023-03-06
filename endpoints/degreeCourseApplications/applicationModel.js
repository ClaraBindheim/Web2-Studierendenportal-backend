var mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({

    applicantUserID: String,
    degreeCourseID: String,
    targetPeriodYear: Number,
    targetPeriodShortName: String,
    
})

module.exports = mongoose.model("application", ApplicationSchema);