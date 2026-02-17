# iOrderAI 商家端 Portal — 后端 Onboarding 指南

欢迎加入 iOrderAI！本文档帮助你（后端 / 全栈开发者）快速了解项目现状，明确需要实现的 API 接口，并按推荐顺序完成联调。

---

## 目录

1. [项目概览](#1-项目概览)
2. [快速上手](#2-快速上手)
3. [接口总览](#3-接口总览)
4. [数据模型参考](#4-数据模型参考)
5. [认证与安全要点](#5-认证与安全要点)
6. [推荐实现顺序](#6-推荐实现顺序)
7. [前端对接检查清单](#7-前端对接检查清单)

---

## 1. 项目概览

### 产品定位

iOrderAI Voice Agent 商家管理后台 — 让中餐馆老板通过 Web Portal 管理 AI 语音接单系统产生的订单、通话记录、财务与提现。

### 前端现状

- **框架**: React 18 + TypeScript + Vite + Tailwind CSS
- **状态**: Demo 级 UI **已全部完成**，包括：
  - 账号密码登录 & 手机号验证码登录
  - 忘记密码（4 步向导）& 修改密码
  - 餐馆信息 & 配送范围地图
  - 订单管理（列表、详情、完成、取消、导出）
  - 财务统计 & 趋势图 & 打款记录
  - 提现管理（余额、银行账户 CRUD、提现申请 & 记录）
  - 通话记录（列表、详情对话回放、录音播放）
  - 国际化（中/英双语）
- **数据来源**: 全部来自 `src/mock/data.ts` 和 `src/contexts/AuthContext.tsx` 中的硬编码逻辑

### 后端目标

将所有 Mock 数据替换为真实 API，实现产品级交付。接口规范详见 [`docs/API.md`](./API.md)。

---

## 2. 快速上手

### 本地启动前端

```bash
# 克隆仓库后
npm install
npm run dev
# 默认访问 http://localhost:5173
```

### 测试账号

| 登录方式 | 凭证 |
|---------|------|
| 账号密码 | 用户名 `demo`，密码 `demo123` |
| 手机号登录 | 任意 10 位数字 + 验证码 `123456` |
| 忘记密码 | 任意 10 位手机号，验证码 `123456`，新密码 >= 8 位 |
| 修改密码 | 旧密码 `demo123`，新密码 >= 8 位 |

### 关键文件路径速查

| 文件/目录 | 说明 |
|----------|------|
| `src/types/index.ts` | **所有 TypeScript 类型定义**（可直接映射数据库表结构） |
| `src/mock/data.ts` | **所有 Mock 数据**（理解每个接口应返回什么） |
| `src/contexts/AuthContext.tsx` | 认证逻辑（登录、手机登录、验证码、重置密码、修改密码） |
| `src/pages/CallRecords/` | 通话记录模块（列表 + 详情弹窗） |
| `src/pages/ForgotPassword/index.tsx` | 忘记密码 4 步向导 UI |
| `src/components/ChangePasswordModal.tsx` | 修改密码弹窗 UI |
| `src/hooks/useAudioPlayer.ts` | 录音播放器 Hook（通过 `new Audio(url)` 播放） |
| `src/utils/password.ts` | 密码强度规则（weak/medium/strong） |
| `src/pages/Orders/` | 订单管理模块 |
| `src/pages/Restaurant/` | 餐馆信息模块（含配送范围地图） |
| `src/pages/Finance/` | 财务 & 提现模块 |

---

## 3. 接口总览

共 **6 个模块、25 个接口**。完整请求/响应格式见 [`docs/API.md`](./API.md)。

### 3.1 认证模块（5 个接口）

| 方法 | 路径 | 功能 | 前端文件 | Mock 位置 |
|------|------|------|---------|----------|
| `POST` | `/auth/login` | 账号密码登录 | `AuthContext.tsx` → `login()` | 硬编码 `demo/demo123` |
| `POST` | `/auth/send-verification-code` | 发送短信验证码 | `AuthContext.tsx` → `sendVerificationCode()` | 1s 延迟 → success |
| `POST` | `/auth/login-with-phone` | 手机号登录 | `AuthContext.tsx` → `loginWithPhone()` | 10 位号码 + `123456` |
| `POST` | `/auth/reset-password` | 忘记密码（重置） | `AuthContext.tsx` → `resetPassword()` | 验证码 `123456` 通过 |
| `POST` | `/auth/change-password` | 修改密码 | `AuthContext.tsx` → `changePassword()` | 旧密码 `demo123` 通过 |

### 3.2 餐馆模块（2 个接口）

| 方法 | 路径 | 功能 | 前端文件 | Mock 位置 |
|------|------|------|---------|----------|
| `GET` | `/restaurant` | 获取餐馆信息 | `Restaurant/index.tsx` | `mockRestaurant` |
| `PATCH` | `/restaurant/delivery-settings` | 更新配送范围 | `Restaurant/DeliveryRangeMap.tsx` | `console.log` |

### 3.3 订单模块（5 个接口）

| 方法 | 路径 | 功能 | 前端文件 | Mock 位置 |
|------|------|------|---------|----------|
| `GET` | `/orders` | 获取订单列表 | `Orders/index.tsx` | `mockOrders` |
| `GET` | `/orders/{orderId}` | 获取订单详情 | `Orders/OrderDetailModal.tsx` | `mockOrders` |
| `POST` | `/orders/{orderId}/complete` | 完成订单 | `Orders/index.tsx` | 本地 state |
| `POST` | `/orders/{orderId}/cancel` | 取消订单 | `Orders/CancelOrderModal.tsx` | 本地 state |
| `GET` | `/orders/export` | 导出订单 | `Orders/index.tsx` | 前端生成 CSV |

### 3.4 财务模块（3 个接口）

| 方法 | 路径 | 功能 | 前端文件 | Mock 位置 |
|------|------|------|---------|----------|
| `GET` | `/finance/stats` | 财务统计 | `Finance/index.tsx` | `getFinanceStats()` |
| `GET` | `/finance/trends` | 趋势数据 | `Finance/index.tsx` | `mockDailyStats` |
| `GET` | `/finance/payments` | 打款记录 | `Finance/index.tsx` | `mockPaymentRecords` |

### 3.5 提现模块（6 个接口）

| 方法 | 路径 | 功能 | 前端文件 | Mock 位置 |
|------|------|------|---------|----------|
| `GET` | `/withdrawal/balance` | 获取提现余额 | `Finance/index.tsx` | `mockWithdrawalBalance` |
| `GET` | `/withdrawal/bank-accounts` | 银行账户列表 | `Finance/BankAccountModal.tsx` | `mockBankAccounts` |
| `POST` | `/withdrawal/bank-accounts` | 添加银行账户 | `Finance/BankAccountModal.tsx` | 本地 state |
| `DELETE` | `/withdrawal/bank-accounts/{id}` | 删除银行账户 | `Finance/BankAccountModal.tsx` | 本地 state |
| `PATCH` | `/withdrawal/bank-accounts/{id}/default` | 设置默认账户 | `Finance/BankAccountModal.tsx` | 本地 state |
| `POST` | `/withdrawal/requests` | 发起提现 | `Finance/WithdrawalModal.tsx` | 本地 state |
| `GET` | `/withdrawal/requests` | 提现记录 | `Finance/index.tsx` | `mockWithdrawalRecords` |
| `POST` | `/withdrawal/requests/{id}/cancel` | 取消提现 | 暂未实现 UI | — |

### 3.6 通话记录模块（3 个接口）

| 方法 | 路径 | 功能 | 前端文件 | Mock 位置 |
|------|------|------|---------|----------|
| `GET` | `/call-records` | 通话记录列表 | `CallRecords/index.tsx` | `mockCallRecords` |
| `GET` | `/call-records/{callId}` | 通话详情（含 transcript） | `CallRecords/CallDetailModal.tsx` | `mockCallRecords` |
| `GET` | `/call-records/{callId}/audio` | 通话录音流 | `hooks/useAudioPlayer.ts` | 本地 `/audio/sample-call.mp3` |

---

## 4. 数据模型参考

所有 TypeScript 类型定义位于 `src/types/index.ts`，可直接作为后端数据库表设计参考。

### 主要实体 → 数据库表映射

| TypeScript 接口 | 建议表名 | 关键字段 | 备注 |
|----------------|---------|---------|------|
| `User` | `users` | `id`, `username`, `phone?`, `restaurantId` | 与 restaurant 为多对一关系 |
| `Restaurant` | `restaurants` | `id`, `name`, `address`, `phone`, `deliveryMode`, `status` | 核心商户表 |
| `DeliverySettings` | `delivery_settings` | `restaurantId`, `selfDeliveryRadius`, `uberMaxRadius`, `lat`, `lng` | 可作为 restaurant 子表或 JSON 字段 |
| `Order` | `orders` | `id`, `restaurantId`, `customerPhone`, `orderType`, `status`, `total` | 订单主表 |
| `OrderItem` | `order_items` | `id`, `orderId`, `name`, `quantity`, `price`, `notes?` | 订单明细 |
| `FinanceStats` | — | 聚合查询 | 无需独立表，从 orders 聚合计算 |
| `PaymentRecord` | `payment_records` | `id`, `restaurantId`, `amount`, `status`, `method`, `bankAccount` | 平台打款记录 |
| `BankAccount` | `bank_accounts` | `id`, `restaurantId`, `bankName`, `accountType`, `accountNumber`, `routingNumber`, `isDefault` | 存储需加密 |
| `WithdrawalBalance` | — | 聚合查询 | 从 orders + withdrawal_requests 聚合 |
| `WithdrawalRequest` | `withdrawal_requests` | `id`, `restaurantId`, `amount`, `fee`, `bankAccountId`, `status` | 提现申请 |
| `CallRecord` | `call_records` | `id`, `restaurantId`, `callerPhone`, `receiverPhone`, `startTime`, `duration`, `status`, `orderId?` | 通话主表 |
| `CallMessage` | `call_messages` | `id`, `callRecordId`, `role`, `content`, `timestamp` | 通话转写（逐条消息） |

### 字段级业务约束

| 字段 | 约束 |
|------|------|
| `Restaurant.deliveryMode` | 枚举：`uber` \| `self` \| `hybrid` |
| `Restaurant.status` | 枚举：`active` \| `paused` \| `terminated` |
| `DeliverySettings.selfDeliveryRadius` | 范围 0.5–10（英里） |
| `DeliverySettings.uberMaxRadius` | 固定值 10（英里） |
| `Order.status` | 枚举：`pending` \| `completed` \| `cancelled` |
| `Order.paymentMethod` | 枚举：`card` \| `cash` |
| `Order.paymentStatus` | 枚举：`paid` \| `pending` \| `failed` |
| `Order.deliveryAddress` | 仅 `orderType === 'delivery'` 时存在 |
| `Order.cancelReason` | 仅 `status === 'cancelled'` 时存在 |
| `BankAccount.accountNumber` | API 响应只返回后 4 位（`****4567`） |
| `BankAccount.routingNumber` | API 响应只返回后 4 位（`****1234`） |
| `WithdrawalRequest.status` | 枚举：`pending` \| `processing` \| `completed` \| `failed` \| `cancelled` |
| `CallRecord.status` | 枚举：`completed` \| `missed` \| `in_progress` |
| `CallMessage.role` | 枚举：`customer` \| `ai` |

---

## 5. 认证与安全要点

### 5.1 JWT Token

- 登录成功后签发 JWT，包含 `userId` 和 `restaurantId`
- 前端将 token 存入 `localStorage`，每次请求通过 `Authorization: Bearer {token}` 携带
- 建议设置 token 有效期（如 24h），并实现 refresh token 机制
- 所有非 `/auth/*` 接口均需 JWT 中间件验证

### 5.2 密码安全

- 使用 **bcrypt** 或 **Argon2** 对密码进行哈希存储，禁止明文存储
- 密码最低要求：>= 8 位
- 前端密码强度规则（参考 `src/utils/password.ts`）：
  - weak: 长度 < 8 或满足 < 2 项条件
  - medium: 满足 2-3 项条件（小写、大写、数字、特殊字符）
  - strong: 满足 >= 4 项条件 或 长度 >= 12

### 5.3 OTP 生命周期

```
生成 6 位 OTP → 存入 Redis (key: phone, TTL: 5min) → 通过 SMS 发送
    → 用户提交验证 → 从 Redis 取出比对 → 验证成功后立即删除
```

- 同号码 60 秒内禁止重发（限频）
- 每次验证成功后删除 OTP（一次性使用）
- 前端 `ForgotPassword/index.tsx` 和登录页均有 60 秒倒计时

### 5.4 SMS 服务集成

- 推荐：**Twilio** 或 **AWS SNS**
- 仅支持美国号码（+1 前缀，10 位数字）
- 建议在开发/测试环境使用 sandbox 模式，避免真实发送

### 5.5 敏感数据脱敏

- 银行账号（`accountNumber`）：存储全量，API 响应仅返回后 4 位（`****4567`）
- 路由号码（`routingNumber`）：同上
- 银行账号存储需加密（AES-256 或使用 vault 服务）

### 5.6 多租户隔离

- **所有数据必须按 `restaurantId` 隔离**
- JWT 中包含 `restaurantId`，中间件解析后注入每个查询
- 禁止通过 URL 参数传递 restaurantId（防止越权访问）
- 数据库查询务必加 `WHERE restaurant_id = ?` 条件

---

## 6. 推荐实现顺序

### P0 — 核心登录闭环（先跑通登录才能测其他接口）

| 序号 | 接口 | 说明 |
|------|------|------|
| 1 | `POST /auth/login` | 账号密码登录 — 最基础的入口 |
| 2 | `POST /auth/send-verification-code` | 发送短信验证码 — 手机登录前置 |
| 3 | `POST /auth/login-with-phone` | 手机号登录 — 另一种登录方式 |
| 4 | JWT 中间件 | 所有后续接口依赖认证，必须先完成 |

### P1 — 主业务流程

| 序号 | 接口 | 说明 |
|------|------|------|
| 5 | `GET /restaurant` | 餐馆信息 — 登录后首页数据 |
| 6 | `GET /orders` + `GET /orders/{id}` | 订单列表与详情 — 核心业务 |
| 7 | `POST /orders/{id}/complete` + `POST /orders/{id}/cancel` | 订单操作 |
| 8 | `GET /call-records` + `GET /call-records/{id}` | 通话记录 — 与订单关联 |
| 9 | `GET /call-records/{id}/audio` | 录音播放 — 需对接存储服务 |

### P2 — 财务与账户管理

| 序号 | 接口 | 说明 |
|------|------|------|
| 10 | `GET /finance/stats` + `GET /finance/trends` + `GET /finance/payments` | 财务三件套 |
| 11 | 提现相关全部 6 个接口 | 余额、银行账户 CRUD、提现申请 & 记录 |
| 12 | `POST /auth/reset-password` + `POST /auth/change-password` | 可在最后实现，不影响核心流程 |

---

## 7. 前端对接检查清单

### 7.1 替换 Mock → API 调用

后端接口就绪后，前端需创建 `src/services/` 服务层：

```
src/services/
├── api.ts           # axios 实例（baseURL、拦截器、token 注入）
├── auth.ts          # 认证相关 API
├── restaurant.ts    # 餐馆信息 API
├── orders.ts        # 订单管理 API
├── finance.ts       # 财务相关 API
├── withdrawal.ts    # 提现相关 API
└── callRecords.ts   # 通话记录 API
```

### 7.2 需要替换的文件清单

| 前端文件 | 当前 Mock | 替换为 API |
|---------|----------|-----------|
| `src/contexts/AuthContext.tsx` | `login()` 硬编码 | `POST /auth/login` |
| `src/contexts/AuthContext.tsx` | `sendVerificationCode()` 硬编码 | `POST /auth/send-verification-code` |
| `src/contexts/AuthContext.tsx` | `loginWithPhone()` 硬编码 | `POST /auth/login-with-phone` |
| `src/contexts/AuthContext.tsx` | `resetPassword()` 硬编码 | `POST /auth/reset-password` |
| `src/contexts/AuthContext.tsx` | `changePassword()` 硬编码 | `POST /auth/change-password` |
| `src/pages/Restaurant/index.tsx` | `mockRestaurant` | `GET /restaurant` |
| `src/pages/Restaurant/DeliveryRangeMap.tsx` | `console.log` | `PATCH /restaurant/delivery-settings` |
| `src/pages/Orders/index.tsx` | `mockOrders` + 本地 state | `GET /orders` + `POST /orders/{id}/complete` + `POST /orders/{id}/cancel` |
| `src/pages/Orders/OrderDetailModal.tsx` | `mockOrders` | `GET /orders/{orderId}` |
| `src/pages/Finance/index.tsx` | `getFinanceStats()` | `GET /finance/stats` |
| `src/pages/Finance/index.tsx` | `mockDailyStats` | `GET /finance/trends` |
| `src/pages/Finance/index.tsx` | `mockPaymentRecords` | `GET /finance/payments` |
| `src/pages/Finance/index.tsx` | `mockWithdrawalBalance` | `GET /withdrawal/balance` |
| `src/pages/Finance/index.tsx` | `mockWithdrawalRecords` | `GET /withdrawal/requests` |
| `src/pages/Finance/index.tsx` | `mockBankAccounts` | `GET /withdrawal/bank-accounts` |
| `src/pages/Finance/WithdrawalModal.tsx` | 本地 state | `POST /withdrawal/requests` |
| `src/pages/Finance/BankAccountModal.tsx` | 本地 state | `POST/DELETE/PATCH /withdrawal/bank-accounts` |
| `src/pages/CallRecords/index.tsx` | `mockCallRecords` | `GET /call-records` |
| `src/pages/CallRecords/CallDetailModal.tsx` | `mockCallRecords` + `mockOrders` | `GET /call-records/{callId}` + `GET /orders/{orderId}` |
| `src/hooks/useAudioPlayer.ts` | 本地音频文件 | `GET /call-records/{callId}/audio`（或预签名 URL） |

### 7.3 环境变量配置

在 `.env` 文件中添加：

```env
VITE_API_BASE_URL=https://api.iorderai.com/v1
```

前端 axios 实例将读取此变量作为 baseURL。

---

## 附录：常见问题

**Q: 前端已有的 TypeScript 类型可以直接用吗？**
A: 可以。`src/types/index.ts` 中的类型定义就是 API 响应的 `data` 字段结构，后端实现时应保持一致。

**Q: 响应格式有什么统一规范？**
A: 所有接口统一使用 `{ success: boolean, data?: T, error?: { code: string, message: string } }` 格式，详见 `docs/API.md` 错误响应格式章节。

**Q: 分页怎么做？**
A: 分页接口统一返回 `pagination: { page, pageSize, total, totalPages }` 对象，前端已按此格式处理。

**Q: 如何测试联调？**
A: 修改 `.env` 中的 `VITE_API_BASE_URL` 指向你的本地后端地址（如 `http://localhost:3000/v1`），然后逐个替换 Mock 为 API 调用即可。
