import config from '../../config/index.js';
import { userService } from '../service/user.js';
import ErrorLog from '../../utils/fsError.js';
import { userEntity } from '../entity/user.js';

class userControllerImpl {
    async getUserAll(req, res) {
        try {
            const result = await userService.getUserAll();
            res.status(config.startCode.success).json({
                code: config.startCode.success,
                msg: '查询成功',
                data: result
            });
        } catch (error) {
            ErrorLog(error, 'user.getUserAll');
            res.status(config.startCode.error).json({ error: error.message });
        }
    }
    async addUser(req, res) {
        try {
            const user = new userEntity(req.body);
            await userService.addUser(user);
            res.status(config.startCode.success).json({
                code: config.startCode.success,
                msg: '添加成功',
                data: true
            });
        } catch (error) {
            ErrorLog(error, 'user.addUser');
            res.status(config.startCode.error).json({ error: error.message });
        }
    }
}

export const userController = new userControllerImpl();
