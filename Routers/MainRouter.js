const MainHandler = require('../Controllers/MainController')
const express= require('express')

const router = express.Router();

router.route('/notifyStatus')
    .post(MainHandler.payFastNotify);

module.exports = router