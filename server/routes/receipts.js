import express from 'express';
import receiptController from '../controllers/receiptController.js';
const router = express.Router();

router.post('/process', 
    receiptController.calculateReceipt, 
    receiptController.storePoints,
    (req, res, next) => {
    res.status(200).json(res.locals.receiptObject);
});

router.get('/:id/points',
    receiptController.getPoints,
    (req, res, next) => {
        res.status(200).json(res.locals.points)
    });

export default router;