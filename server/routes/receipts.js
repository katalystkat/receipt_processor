const express = require('express');
const receiptController = require('../controllers/receiptController');
const router = express.Router();

router.post('/process', 
    receiptController.calculateReceipt, 
    receiptController.storePoints,
    (req, res, next) => {
    console.log('Accessing receipt router');
    res.status(200).json(res.locals.receiptObject);
});

module.exports = router;