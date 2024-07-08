// const loginModel=require('../model/login.model')
// const userModel=require('../model/user.model')
const userModel = require('../models/user.model')
const teacherModel = require('../models/teacher.model')
const studentModel = require('../models/student.model')
const studentDetailsModel = require('../models/studentDetails.model')
const classModel = require('../models/class.model')
const deriveHistory = require('../deriving/deriveHistory')
const findQAs = require('../deriving/deriveQAs')


const jwt = require('jsonwebtoken')

const submitYearTypeComment = async (req, res) => {
    try {
        const id = req.headers.id
        const student = await studentModel.findOne({ regNo: id })
        const section = student.section.find(sec => sec.sec === req.headers.section)
        const yearReport = section.yearReport.find(year => year.year === req.headers.year)

        if (req.body.headers.type === "personalQA")
            yearReport.comment.yearPersonalComment = req.body.headers.comments
        else if (req.body.headers.type === "socialQA")
            yearReport.comment.yearSocialComment = req.body.headers.comments
        else if (req.body.headers.type === "academicQA")
            yearReport.comment.yearAcademicComment = req.body.headers.comments
        else if (req.body.headers.type === "recreationalQA")
            yearReport.comment.yearRecreationalComment = req.body.headers.comments
        else if (req.body.headers.type === "occupationalQA")
            yearReport.comment.yearOccupationalComment = req.body.headers.comments
        else if (req.body.headers.type === "termComment")
            yearReport.comment.yearComment = req.body.headers.comments

        student.save()
        res.status(200).json("Success")
    }
    catch (err) {
        console.log(err)
        res.status(400).send(false)
    }
}

const evaluateYearStudent = async (req, res) => {
    try {
        const std = await studentModel.findOne({ regNo: req.headers.regNo })
        const section = std.section.find(sec => sec.sec === req.headers.section)
        const yearReport = section.find(year => year === req.headers.year)
        let arr = [0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0]]
        let len = 0
        yearReport.map((inst) => {
            inst.termReport.map((inst1) => {
                len++
                arr[0] += inst1.percent.personalPercent
                arr[1] += inst1.percent.socialPercent
                arr[2] += inst1.percent.occupationalPercent
                arr[3] += inst1.percent.academicPercent
                arr[4] += inst1.percent.recreationalPercent
                if (inst1.percent.mode == "") { arr[5][5]++ }
                else if (inst1.percent.mode == "A") { arr[5][0]++ }
                else if (inst1.percent.mode == "B") { arr[5][1]++ }
                else if (inst1.percent.mode == "C") { arr[5][2]++ }
                else if (inst1.percent.mode == "D") { arr[5][3]++ }
                else if (inst1.percent.mode == "E") { arr[5][4]++ }
            })
        })
        for (let i = 0; i < 5; i++)
            arr[i] /= len
        let idx = ""
        const arr1 = ["A", "B", "C", "D", "E", ""]
        for (let i = 0; i < 6; i++) {
            if (Math.max(...arr[5]) == arr[5][i]) {
                idx = arr1[i]
                break
            }
        }
        yearReport.percent.personalPercent = arr[0]
        yearReport.percent.socialPercent = arr[1]
        yearReport.percent.occupationalPercent = arr[2]
        yearReport.percent.academicPercent = arr[3]
        yearReport.percent.recreationalPercent = arr[4]
        yearReport.percent.mode = idx
        std.save()
        res.status(200).json("Success")
    }
    catch (err) {
        console.log(err)
        res.status(400).send(false)
    }
}

const evaluateStudent = async (req, res) => {
    try {
        const id = req.headers.id
        const student = await studentModel.findOne({ regNo: id })
        const section = student.section.find(sec => sec.sec === req.headers.section)
        const yearReport = section.yearReport.find(year => year.year === req.headers.year)
        const termReport = yearReport.termReport.find(term => term.term === req.headers.term)
        let questions;
        if (req.headers.type === "personalQA")
            questions = termReport.report.personalQA
        else if (req.headers.type === "socialQA")
            questions = termReport.report.socialQA
        else if (req.headers.type === "academicQA")
            questions = termReport.report.academicQA
        else if (req.headers.type === "recreationalQA")
            questions = termReport.report.recreationalQA
        else if (req.headers.type === "occupationalQA")
            questions = termReport.report.occupationalQA

        let result
        // console.log(questions)
        if (req.headers.type !== "recreationalQA") {
            result = findPercent(questions)
            if (req.headers.type === "personalQA") {
                termReport.percent.personalPercent = result
                termReport.evaluated.personal = true
            }
            else if (req.headers.type === "socialQA") {
                termReport.percent.socialPercent = result
                termReport.evaluated.social = true
            }
            else if (req.headers.type === "academicQA") {
                termReport.percent.academicPercent = result
                termReport.evaluated.academic = true
            }
            else if (req.headers.type === "occupationalQA") {
                termReport.percent.occupationalComment = result
                termReport.evaluated.occupational = true
            }
        }
        else {
            result = findPercentForRecreational(questions)
            termReport.percent.recreationalPercent = result.percent
            termReport.percent.mode = result.mode
            termReport.evaluated.recreational = true
        }

        let newTermReport = {
            evaluated: {
                personal: false,
                academic: false,
                social: false,
                occupational: false,
                recreational: false
            },
            term: '',
            report: findQAs(req.headers.section),
            percent: {//Term Performance
                personalPercent: 0,
                socialPercent: 0,
                academicPercent: 0,
                occupationalPercent: 0,
                recreationalPercent: 0,
                mode: ""
            },
            comment: {//Term Comments
                termComment: "",
                personalComment: "",
                occupationalComment: "",
                recreationalComment: "",
                academicComment: "",
                socialComment: ""
            }
        }
        if (termReport.evaluated.academic && termReport.evaluated.occupational && termReport.evaluated.personal && termReport.evaluated.recreational && termReport.evaluated.social) {
            if (termReport.term === 'Entry')
                newTermReport.term = 'I'
            else if (termReport.term === 'I')
                newTermReport.term = "II"
            else if (termReport.term === 'II')
                newTermReport.term = "III"
            else
                newTermReport.term = "III"//need to change
        }

        yearReport.termReport.push(newTermReport)
        student.save()
        res.status(200).json({ result })
    }
    catch (err) {
        console.log(err)
        res.status(400).send(false)
    }
}

const findPercent = (arr) => {
    let count = 0
    let ans = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].answer == "yes" || arr[i].answer == "Yes")
            ans++
        if (arr[i].answer == "NA" || arr[i].answer == "NE")
            continue
        count++
    }
    // console.log(ans,count)
    if (ans != 0 && count != 0)
        return ((ans / count) * 100).toFixed(2)
    return 0;
}

const findPercentForRecreational = (arr) => {
    let count_A = 0
    let count_B = 0
    let count_C = 0
    let count_D = 0
    let count_E = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].answer == "A") count_A++
        else if (arr[i].answer == "B") count_B++
        else if (arr[i].answer == "C") count_C++
        else if (arr[i].answer == "D") count_D++
        else if (arr[i].answer == "E") count_E++
    }
    let ans = "Z"
    let score = 0
    let val = Math.max(count_A, count_B, count_C, count_D, count_E)
    if (val === count_A)
        ans = "A"
    else if (val === count_B)
        ans = "B"
    else if (val === count_C)
        ans = "C"
    else if (val === count_D)
        ans = "D"
    else if (val === count_E)
        ans = "E"
    score = (val / arr.length) * 100
    return {
        mode: ans,
        percent: score.toFixed(2)
    }
}

const historyStudent = async (req, res) => {//expecting student details form req 
    try {
        const regNo_request = req.headers.id
        const std = await studentModel.findOne({ "regNo": regNo_request })
        // console.log(std)
        if (!std) {
            res.status(400).json({ message: "stdent doesnt exists" })
        }
        else if (std.currYear === "1") {
            res.status(400).json({ data: "Newly admitted student" });
        }
        else {
            // console.log(std)
            res.status(201).json(deriveHistory(std))
        }
    }
    catch (error) {
        // console.log(error)
        res.status(404).send(false)
    }
}

const getStudents = async (req, res) => {
    try {
        // console.log("Hiii")
        const id = req.headers.id
        // console.log(req.headers.id)
        const teacher = await teacherModel.findOne({ "teacherId": id })
        // console.log(teacher)
        const students = []
        if (teacher) {
            for (let index = 0; index < teacher.classId.length; index++) {
                const classId = teacher.classId[index];
                // console.log("-------------------------------",classId)
                const students_classId = await studentModel.find({ classId: classId })
                if (!students_classId.length == 0)
                    students.push(students_classId)
                // console.log(students_classId)
                // console.log("--------------------------------")
            }
            if (students) {
                res.status(200).json({ students })
            }
            else {
                res.status(405).send(false)
            }
        }
        else {
            res.status(406).send(false)
        }
    }
    catch (error) {
        console.log(error)
        res.status(404).send(false)
    }

    // ----------------------IGNORE----------------------------
    //     const students = await studentModel.find({ "classId": { $in: teacher.classId } })

}

const getQuestions = async (req, res) => {
    try {
        const id = req.headers.id
        // const id = "S000"
        // console.log(id)
        const student = await studentModel.findOne({ "regNo": id })
        if (student) {
            // console.log(student)
            res.json({ status: "success", data: student })
        }
        else {
            res.status(405).send(false)
        }
    }
    catch (error) {
        res.status(404).send(false)
    }
}

const getTeacher = async (req, res) => {
    try {
        const id = req.headers.id
        // console.log(id)
        const teacher = await teacherModel.findOne({ "teacherId": id })
        if (teacher) {
            // console.log(student)
            res.json({ status: "success", data: teacher })
        }
        else {
            res.status(405).send(false)
        }
    }
    catch (error) {
        res.status(404).send(false)
    }
}

const submitForm = async (req, res) => {
    try {
        // console.log(req.body)
        const id = req.body.id
        const type = req.body.type
        const data = req.body.data
        // const year = req.body.year
        // const section = req.body.section
        // const term = req.body.term
        // console.log(data)
        const std = await studentModel.findOne({
            regNo: id,
        })

        const section = std.section.find(sec => sec.sec === req.body.section)
        const yearReport = section.yearReport.find(report => report.year === req.body.year)
        const termReport = yearReport.termReport.find(report => report.term === req.body.term)

        if (type === "personalQA")
            termReport.report.personalQA = data.questions
        else if (type === "academicQA")
            termReport.report.academicQA = data.questions
        else if (type === "recreationalQA")
            termReport.report.recreationalQA = data.questions
        else if (type === "socialQA")
            termReport.report.socialQA = data.questions
        else if (type === "occupationalQA")
            termReport.report.occupationalQA = data.questions

        // console.log(termReport.report.personalQA)
        std.save()
        {
            // let i=0,j=0,k=0;
            // for (let index = 0; index < std.section.length; index++) {
            //     if(std.section[index].sec === section)
            //     {
            //         k = index
            //         break
            //     }
            // }
            // for (let index = 0; index < std.section[k].yearReport.length; index++) {
            //     if(std.section[k].yearReport[index].year === year)
            //     {
            //         i = index
            //         break
            //     }
            // }
            // for (let index = 0; index < std.section[k].yearReport[i].termReport.length; index++) {
            //     if(std.section[k].yearReport[i].termReport[index].term === term)
            //     {
            //         j = index
            //         break
            //     }
            // }

            // if(type === "personalQA")
            //     std.section[k].yearReport[i].termReport[k].report.personalQA[0].answer = data.questions
            // else if(type === "academicQA")
            //     std.section[k].yearReport[i].termReport[k].report.academicQA = data.questions
            // else if(type === "recreationalQA")
            //     std.section[k].yearReport[i].termReport[k].report.recreationalQA = data.questions
            // else if(type === "socialQA")
            //     std.section[k].yearReport[i].termReport[k].report.socialQA = data.questions
            // else if(type === "occupationalQA")
            //     std.section[k].yearReport[i].termReport[k].report.occupationalQA = data.questions
            // console.log(std.section[k].yearReport[i].termReport[j].report.personalQA)
            // const stud = await studentModel.findOneAndUpdate({
            //     regNo:id,
            //     section:std.section
            // })
        }

        res.json({ data: std })
    }
    catch (error) {
        // console.log("-----------------")
        res.status(400).send(false)
    }
}

const getStudentbyId = async (req, res) => {
    try {
        const data = req.headers.id
        const std = await studentModel.findOne({ regNo: data })
        if (!std) {
            console.log('stdent not found')
            res.status("Bad request").json({ message: "invalid regNo" })
        }
        else {
            // console.log("-------------------------------", std, "------------------------------------")
            res.json(std)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "internal server error" })
    }
}

const submitTermTypeComment = async (req, res) => {
    try {
        const id = req.body.id
        // console.log(req.body)
        const student = await studentModel.findOne({ regNo: id })
        const section = student.section.find(sec => sec.sec === req.body.section)
        const yearReport = section.yearReport.find(year => year.year === req.body.year)
        const termReport = yearReport.termReport.find(term => term.term === req.body.term)

        if (req.body.type === "personalQA")
            termReport.comment.personalComment = req.body.comments
        else if (req.body.type === "socialQA")
            termReport.comment.socialComment = req.body.comments
        else if (req.body.type === "academicQA")
            termReport.comment.academicComment = req.body.comments
        else if (req.body.type === "recreationalQA")
            termReport.comment.recreationalComment = req.body.comments
        else if (req.body.type === "occupationalQA")
            termReport.comment.occupationalComment = req.body.comments
        else {
            console.log("-------")
            termReport.comment.termComment = req.body.comments
        }

        console.log(termReport.comment.termComment)
        // console.log(termReport)
        student.save()
        res.status(200).json("Success")
    } catch (err) {
        console.log(err)
        res.status(400).send(false)
    }
}



module.exports = {
    historyStudent,
    getStudents,
    evaluateStudent,
    getQuestions,
    getTeacher,
    getStudentbyId,
    submitForm,
    submitTermTypeComment,
    evaluateYearStudent,
    submitYearTypeComment
}