const express=require('express')
const { submitForm,submitTermTypeComment } = require('../controllers/teacher.controller')
const routes=express.Router()

routes.post("/form",submitForm);
routes.post('/termTypeComment',submitTermTypeComment)

module.exports = routes