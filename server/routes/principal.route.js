const express = require('express')
const routes = express.Router()
const { viewStudent, viewTeacher, getTeacher, searchStudent, detailsStudent } = require('../controllers/principle.controller')
const {historyStudent} = require("../controllers/teacher.controller")

routes.get('/viewTeacher', viewTeacher);
routes.get('/view', viewStudent);
routes.get('/teacher/:classId', getTeacher)
routes.get('/student', searchStudent)
routes.get('/hist',historyStudent)
routes.get('/detail',detailsStudent)

module.exports = routes