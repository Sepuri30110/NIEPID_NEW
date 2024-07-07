const findQAs = require('./deriveQAs')
const studentJsonGenerate = (data, v1) => {
    const ans = {}
    ans.regNo = data.formData.details.info.regNo
    ans.name = data.formData.details.info.name
    ans.classId = v1
    ans.currYear = 1
    ans.currTerm = "Entry"
    ans.currSection = data.formData.stdCred.section
    ans.section = [{
        sec: "preprimary",
        yearReport: [{
            year: 1,
            yearComment: "not entered",
            termReport: [{
                term: "Entry",
                report: findQAs(data.formData.stdCred.section),
                comment: {
                    termComment: "not entered",
                    personalComment: "not entered",
                    occupationalComment: "not entered",
                    recreationalComment: "not entered",
                    academicComment: "not entered",
                    socialComment: "not entered"
                },
                percent: {
                    personalPercent: 0,
                    socialPercent: 0,
                    academicPercent: 0,
                    occupationalPercent: 0,
                    recreationalPercent: 0,
                    mode: ""
                }
            }],
            comment: {
                yearPersonalComment: "not entered",
                yearOccupationalComment: "not entered",
                yearRecreationalComment: "not entered",
                yearAcademicComment: "not entered",
                yearSocialComment: "not entered",
                yearComment: "not entered"
            },
            percent: {
                personalPercent: 0,
                socialPercent: 0,
                academicPercent: 0,
                occupationalPercent: 0,
                recreationalPercent: 0,
                mode: ""
            }
        }]
    }]
    return ans
}
module.exports = studentJsonGenerate