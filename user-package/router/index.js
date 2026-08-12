import express from 'express';
import { userController } from '../controller/index.js';
const router = express.Router();

// 路由只做分发，没有任何业务代码
router.post('/add', userController.addUser);
// 路由只做分发，没有任何业务代码
router.get('/all', userController.getUserAll);

export default router;
