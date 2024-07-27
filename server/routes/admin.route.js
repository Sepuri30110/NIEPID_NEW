const express = require('express')
const multer = require('multer')
const routes = express.Router()
const { registerStudent, registerTeacher, viewStudent, viewTeacher, downloadExcel, editTeacher } = require('../controllers/admin.controller')
const {historyStudent} = require("../controllers/teacher.controller")
const {detailsStudent, searchStudent, getTeacher} = require("../controllers/principle.controller")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

routes.put('/updateTeacher/:id', editTeacher)
routes.post('/registerStudent', registerStudent);
routes.post('/registerTeacher', upload.single('file'), registerTeacher);
routes.get('/viewStudent', viewStudent);
routes.get('/viewTeacher', viewTeacher);
routes.get('/download', downloadExcel);
routes.get('/teacher/:classId', getTeacher)
routes.get('/student', searchStudent)
routes.get('/hist', historyStudent);
routes.get('/detail',detailsStudent)


module.exports = routes