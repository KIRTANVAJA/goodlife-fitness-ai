import express from 'express';
import {
  recordMeasurement,
  getMeasurements,
  getMeasurementById,
  deleteMeasurement,
} from '../controllers/bodyMeasurementController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All body measurement routes are user-isolated and protected
router.use(protect);

router.route('/measurements')
  .post(recordMeasurement)
  .get(getMeasurements);

router.route('/measurements/:id')
  .get(getMeasurementById)
  .delete(deleteMeasurement);

export default router;
