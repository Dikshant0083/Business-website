import express from 'express';
import { handleOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', handleOrder);


export default router;
