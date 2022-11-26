const { Router } = require('express');
const { values } = require('../controllers/values');

const router = Router();

router.post('/', values);


module.exports = router;