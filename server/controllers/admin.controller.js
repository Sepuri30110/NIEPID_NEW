// const loginModel=require('../model/login.model')
const userModel = require('../models/user.model')
const teacherModel = require('../models/teacher.model')
const studentModel = require('../models/student.model')
const studentDetailsModel = require('../models/studentDetails.model')
const classModel = require('../models/class.model')
const path = require('path')

const generateClassId = require('../deriving/deriveClass')
const studentJsonGenerate = require('../deriving/deriveStd')

const jwt = require('jsonwebtoken')


// const registerStudent = async (req, res) => {
//     // try {
//         // console.log("hi")
//         // console.log(req.body.formData.details)
//         const val1 = {}
//         const data = req.body
//         const arr1 = await studentDetailsModel.findOne({ 'info.regNo' : data.formData.details.info.regNo })
//         const arr2 = await studentModel.findOne({ regNo: data.formData.details.info.regNo })
//         console.log(arr1,arr2)
//         lable1: if (!(arr1 && arr2)) {
//             let flag = false
//             if(data.formData.details.info.regNo)
//             {
//             const responce1 = await new studentDetailsModel(data.formData.details).save()
//                 .then(() => {
//                     // console.log("data entered in studentDetailsModel successfully")
//                 })
//                 .catch((err) => {
//                     console.log(err)
//                     flag = true
//                 })
//             }
//             if (flag) {
//                 res.status(405).json({ reason: "studentDetails already exists" })
//                 break lable1
//             }
//             const value1 = generateClassId(data.formData.stdCred.section, data.formData.stdCred.year)
//             // console.log(value1)
//             const arr3 = await classModel.find({ classId: "preprimary_1" })
//             // console.log(arr3.length)
//             // console.log(arr3)
//             if (arr3.length == 0) {
//                 res.status(404).json({ reason: "no class exists" })
//                 break lable1
//             } else if (arr3.length == 1) {
//                 const v1 = arr3[0].student
//                 v1.push(data.formData.details.info.regNo)
//                 // console.log(v1)
//                 const searchClass = generateClassId(data.formData.stdCred.section, data.formData.stdCred.year)
//                 const responce2 = await classModel.findOneAndUpdate(
//                     { classId: searchClass },
//                     { student: v1 },
//                     { new: true }
//                 )
//                 const ans = studentJsonGenerate(data, searchClass)
//                 // console.log(ans)
//                 const responce3 = await new studentModel(ans).save()
//                     .then(() => {
//                         // console.log("student has been saved")
//                     })
//                     .catch((err) => {
//                         // console.log("student has not been saved \n"+err)
//                         flag = true
//                         // console.log(ans)
//                     })
//                 if (flag) {
//                     res.status(403).json({ reason: "student already exists" })
//                     break lable1
//                 }
//                 const stdUser = {
//                     id: data.formData.details.info.regNo,
//                     password: data.formData.details.info.regNo,
//                     role: "student"
//                 }
//                 const responce4 = await new userModel(stdUser).save()
//                     .then(() => {
//                         // console.log("student has been saved in userDB")
//                     })
//                     .catch((err) => {
//                         // console.log("student has not been saved in userDB \n"+err)
//                         flag = true
//                         // console.log(ans)
//                     })
//                 if (flag) {
//                     res.status(402).json({ reason: "student already exists" })
//                     break lable1
//                 }
//             }
//         }
//         else {
//             // console.log("hi")
//             res.status(401).json({ failure: "true" })
//         }
//     // }
//     // catch (error) {
//     //     console.log(error)
//     //     res.status(404).send(false)
//     // }
// }

const registerStudent = async (req, res) => {
    try {
        const data = req.body
        label: if (!(await studentDetailsModel.findOne({ 'info.regNo': data.formData.details.info.regNo }))) {
            const user = {
                id: data.formData.details.info.regNo,
                password: data.formData.details.info.regNo,
                role: "teacher"
            }

            const classId = generateClassId(req.body.formData.stdCred.section, req.body.formData.stdCred.year)
            const classes = await classModel.findOne({ classId: "preprimary_1" })
            if (classes.length == 0) {
                res.status(400).send("no class exists")
                break label
            }
            const stds = classes.student
            stds.push(data.formData.details.info.regNo)

            const student = studentJsonGenerate(data, classId)
            let flag = false

            await studentDetailsModel.create(data.formData.details)
                .then(() => {
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).send("student details model not created")
                    flag = true
                })
            if (flag) break label

            await studentModel.create(student)
                .then(() => {
                })
                .catch((err) => {
                    res.status(400).send("student model not created")
                    flag = true
                })
            if (flag) break label

            await classModel.findOneAndUpdate({ classId: classId }, { student: stds }, { new: true })
                .then(() => {
                })
                .catch((err) => {
                    res.status(400).send("class model not updated")
                    flag = true
                })
            if (flag) break label

            await userModel.create(user)
                .then(() => {
                })
                .catch((err) => {
                    res.status(400).send("user model not created")
                    flag = true
                })
            if (flag) break label
        }
        else {
            res.json(401).send("Already exist")
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).send(false)
    }
}

const registerTeacher = async (req, res) => {
    try {


    }
    catch (error) {
        res.status(404).send(false)
    }
}

const viewStudent = async (req, res) => {
    try {
        const students = await studentModel.find({})
        // console.log(students)
        if (students) {
            res.status(200).json({ status: "success", data: students })
        }
        else {
            res.status(405).json({ status: "success", data: [] })
        }
    }
    catch (error) {
        res.status(404).json("Error")
    }
}

const viewTeacher = async (req, res) => {
    try {


    }
    catch (error) {
        res.status(404).send(false)
    }
}

const downloadExcel = async (req, res) => {
    // console.log("hii")
    const file = await path.join(__dirname, '..', 'samplesheets', 'sampleDataTeacher.xlsx'); // Adjust the path to your file
    // console.log("File path:", file); // Log the file path for debugging
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Set the CORS header for this route
    res.download(file, (err) => {
        if (err) {
            // console.error("File not found:", err);
            res.status(404).send("File not found");
        }
    });
};

module.exports = {
    registerStudent,
    registerTeacher,
    viewStudent,
    viewTeacher,
    downloadExcel
}