//init server
const express = require("express");
//init express router to handle db function like put , delete , get , post
const router = express.Router();

const authController = require('../controllers/authController')


router.route('/register').post(authController.registerNewUser)
router.route('/login').post(authController.login)
router.route('/refresh').get(authController.refresh)
router.route('/logout').post(authController.logout)



module.exports = router;