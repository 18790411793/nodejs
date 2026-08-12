import express from 'express';
import config from '../config/index.js';
import userRouter from './router/index.js';
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/health', (req, res) => {
//     res.json({ code: 200, service: 'user', status: 'ok' });
// });

app.use('/api/user/', userRouter)

app.listen(config.USER_PORT, () => {
    console.log(`Example app listening on port ${config.USER_PORT}`);
});
