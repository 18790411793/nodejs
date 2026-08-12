import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config/index.js';
import ErrorLog from '../utils/fsError.js';
const app = express();

// 网关全局中间件【统一控制层，所有请求先经过这里！】
app.use((req, res, next) => {
    console.log(`[网关] ${req.method} ${req.path}`);
    // ========== 1. 网关统一鉴权示例 ==========
    // const token = req.headers.token;
    // if (!token) {
    //   return res.status(401).json({ code: 401, msg: '未登录，拒绝访问' });
    // }

    // ========== 2. 统一跨域、请求头处理 ==========
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// ========== 路由转发规则 ==========
// 用户模块接口 转发到业务服务 http://localhost:3001
app.use('/api/user', createProxyMiddleware({
    target: 'http://localhost:3000', // 后端真实业务地址
    changeOrigin: true,
    pathRewrite: {
        // express 挂载后，代理收到的 req.url 已去掉 /api/user 前缀（如 /all）。
        // 将其补回业务服务实际注册的 /api/user 路径。
        '^/': '/api/user/'
    },
    onError: (err, req, res) => {
        ErrorLog(`[网关代理失败] ${req.method} ${req.originalUrl}: ${err.message}`);
        console.error(`[网关代理失败] ${req.method} ${req.originalUrl}: ${err.message}`);
        if (!res.headersSent) {
            res.status(502).json({ code: 502, msg: '用户服务暂不可用' });
        }
    }
}));

// 其他网关本地路由如需读取 JSON，再启用解析中间件。
// 必须放在代理路由之后，避免请求体被提前消费导致 POST 转发为空。
app.use(express.json());

// 网关兜底404
app.use((req, res) => {
    res.status(404).json({ code: 404, msg: '网关：接口不存在' });
});

app.listen(config.gatewayPort, () => {
    console.log(`Gateway 网关启动：http://localhost:${config.gatewayPort}`);
});
