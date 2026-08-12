# node-demo

一个基于 Node.js 和 Express 的微服务示例项目，包含：

- 网关服务（Gateway）：统一入口、请求日志、跨域响应头和用户服务代理
- 用户服务（User service）：提供用户新增和用户列表查询接口
- MySQL 数据持久化：使用 `mysql2` 连接数据库

## 技术栈

- Node.js（ES Modules）
- Express 5
- http-proxy-middleware
- MySQL / mysql2

## 环境要求

- Node.js 18 或更高版本
- MySQL 5.7+ 或 MySQL 8+

## 快速开始

### 1. 安装依赖

在项目根目录执行：

```bash
npm install
```

用户服务使用根项目已安装的 Express 依赖。若希望单独运行用户服务，也可以进入 `user-package` 安装其依赖：

```bash
cd user-package
npm install
cd ..
```

### 2. 初始化数据库

默认数据库连接配置位于 [`config/index.js`](./config/index.js)：

| 配置项 | 默认值 |
| --- | --- |
| host | `localhost` |
| user | `root` |
| password | `123456` |
| database | `demo` |

先创建数据库和用户表：

```sql
CREATE DATABASE IF NOT EXISTS demo DEFAULT CHARACTER SET utf8mb4;
USE demo;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `age` INT NULL,
  `sex` VARCHAR(20) NULL,
  `phone` VARCHAR(30) NULL,
  PRIMARY KEY (`id`)
);
```

如果本地 MySQL 配置不同，请修改 `config/index.js` 后再启动服务。

### 3. 启动服务

需要启动用户服务和网关服务。分别打开两个终端：

终端一（用户服务，端口 `3000`）：

```bash
cd user-package
npm run dev
```

终端二（网关服务，端口 `3001`）：

```bash
npm run dev
```

启动后，客户端应通过网关地址 `http://localhost:3001` 访问接口。

## API

### 新增用户

```http
POST /api/user/add
Content-Type: application/json
```

请求示例：

```json
{
  "name": "张三",
  "age": 20,
  "sex": "男",
  "phone": "13800138000"
}
```

> `age` 应传数字，例如 `20`。上面的字段均由用户实体接收，`name`、`age`、`sex`、`phone` 会写入数据库。

成功响应示例：

```json
{
  "code": 200,
  "msg": "添加成功",
  "data": true
}
```

### 查询全部用户

```http
GET /api/user/all
```

成功响应示例：

```json
{
  "code": 200,
  "msg": "查询成功",
  "data": []
}
```

## 目录结构

```text
node-demo/
├─ config/                 # 网关、用户服务和数据库配置
├─ db/                     # 根项目数据库连接模块
├─ gateway/                # Express 网关及代理配置
│  └─ gateway.js
├─ user-package/           # 用户业务服务
│  ├─ controller/          # 请求控制器
│  ├─ db/                  # 用户服务数据库连接
│  ├─ entity/              # 用户实体
│  ├─ router/              # 用户接口路由
│  ├─ service/             # 用户业务和 SQL
│  └─ main.js              # 用户服务入口
├─ utils/                  # 错误日志工具
├─ package.json
└─ README.md
```

## 日志与错误处理

- 网关会记录请求方法和路径。
- 代理失败时网关返回 HTTP `502`。
- 业务或数据库异常会返回 HTTP `500`。
- 错误日志追加写入项目根目录的 `errorlog.log`。

## 可用脚本

根目录：

```bash
npm run dev    # 启动网关服务
npm test       # 当前未配置自动化测试
```

`user-package` 目录：

```bash
npm run dev    # 启动用户服务
```

## 注意事项

- 当前数据库账号和密码直接写在配置文件中，生产环境建议改用环境变量或密钥管理服务。
- 网关当前允许任意来源的跨域请求（`Access-Control-Allow-Origin: *`），生产环境应限制来源。
- 网关代理依赖用户服务运行在 `http://localhost:3000`。
