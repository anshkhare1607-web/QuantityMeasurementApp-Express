const express = require('express');
const router = express.Router();
const quantityController = require('../controllers/quantityController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateQuantityInput } = require('../middlewares/validator');

// Note: Applying JWT auth middleware to protect these routes
router.use(authMiddleware);

router.post('/compare', quantityController.compare);
router.post('/convert', quantityController.convert);
router.post('/add', quantityController.add);
router.post('/add-with-target-unit', quantityController.addWithTarget);
router.post('/subtract', quantityController.subtract);
router.post('/subtract-with-target-unit', quantityController.subtractWithTarget);
router.post('/divide', quantityController.divide);

router.get('/history/operation/:operation', quantityController.getHistoryByOperation);
router.get('/history/type/:type', quantityController.getHistoryByType);
router.get('/count/:operation', quantityController.getCountByOperation);
router.get('/history/errored', quantityController.getErroredHistory);

module.exports = router;