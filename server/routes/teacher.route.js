const express=require('express')
const routes=express.Router()
const { historyStudent,evaluateStudent,getStudents,getQuestions,getTeacher,getStudentbyId,submitForm,submitTermTypeComment,evaluateYearStudent,submitYearTypeComment } = require('../controllers/teacher.controller')

routes.get('/history',historyStudent)
routes.get('/evaluate',evaluateStudent)
routes.get('/getStudents',getStudents)
routes.get('/evaluate/questions',getQuestions)
routes.get('/getTeacher',getTeacher)
routes.get('/getStudentbyId',getStudentbyId)
routes.get('/evaluateYear',evaluateYearStudent)
routes.get('/yearTypeComment',submitYearTypeComment)
// routes.get('/eval/form',submitForm)
// routes.post('/termTypeComment',submitTermTypeComment)

module.exports=routes
