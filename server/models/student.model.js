const mongoose = require('mongoose');   

const StudentReport = new mongoose.Schema({
    regNo: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    currYear: {//current year added
        type: String,
        required: true,
        enum: ["1", "2", "3", "passedOut"],
        default: "1"//added
    },
    currTerm: {//Not required can be exculed
        type: String,
        requirde: true,
        enum: ["Entry", "I", "II", "III"],
        default: "Entry"//added
    },
    currSection:{
        type: String,
        required: true,
    },
    classId:{
        type:String,
    },
    section: [{
        sec:{
            type: String,
            required: true,
            enum:['preprimary','primary']
        },
        yearReport: [{  
            year: {
                type: String,//changed from Number
                required: true,
                enum: ["1", "2", "3"]
            },
            termReport: [{
                term: {
                    type: String,//changed from Number
                    required: true,
                    enum: ["Entry", "I", "II", "III"]
                },
                report: {//Questions
                    personalQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["","Yes", "No", "NA", "NE", "C-P1", "C-P2"]
                        }
                    }],
                    socialQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["","Yes", "No", "NA", "NE", "C-P1", "C-P2"]
                        }
                    }],
                    academicQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["","Yes", "No", "NA", "NE", "C-P1", "C-P2"]
                        }
                    }],
                    occupationalQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["","Yes", "No", "NA", "NE", "C-P1", "C-P2"]
                        }
                    }],
                    recreationalQA: [{
                        question: String,
                        answer: {
                            type: String,
                            enum: ["","A", "B", "C", "D", "E"]
                        }
                    }],
                },
                percent: {//Term Performance
                    personalPercent: Number,
                    socialPercent: Number,
                    academicPercent: Number,
                    occupationalPercent: Number,
                    recreationalPercent: Number,
                    mode: {
                        type: String,
                        enum: ["","A", "B", "C", "D", "E"]
                    },
                },
                comment: {//Term Comments
                    termComment: {
                        type: String,
                        default:""
                    },
                    personalComment: {
                        type: String,
                        default:""
                    },
                    occupationalComment: {
                        type: String,
                        default:""
                    },
                    recreationalComment: {
                        type: String,
                        default:""
                    },
                    academicComment: {
                        type: String,
                        default:""
                    },
                    socialComment: {
                        type: String,
                        default:""
                    }
                }
            }],
            comment: {//Year Comments
                yearComment: {
                    type: String,
                    default:""
                },
                yearPersonalComment: {
                    type: String,
                    default:""
                },
                yearOccupationalComment: {
                    type: String,
                    default:""
                },
                yearRecreationalComment: {
                    type: String,
                    default:""
                },
                yearAcademicComment: {
                    type: String,
                    default:""
                },
                yearSocialComment: {
                    type: String,
                    default:""
                },
            },
            percent: {//Year Performance
                personalPercent: Number,
                socialPercent: Number,
                academicPercent: Number,
                occupationalPercent: Number,
                recreationalPercent: Number,
                mode: {
                    type: String,
                    enum: ["","A", "B", "C", "D", "E"]
                },
            },
        }]
    }]
});

module.exports = mongoose.model('Student', StudentReport);
