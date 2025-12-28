# iOrderAI 商家端 Portal API 接口文档

本文档定义了商家端 Portal 所需的全部后端 API 接口。当前前端使用 Mock 数据，后端开发需要按照本文档实现真实接口。

## 基础信息

- **Base URL**: `https://api.iorderai.com/v1` (待定)
- **认证方式**: Bearer Token (JWT)
- **请求格式**: JSON
- **响应格式**: JSON

---

## 目录

1. [认证接口](#1-认证接口)
2. [餐馆信息接口](#2-餐馆信息接口)
3. [订单管理接口](#3-订单管理接口)
4. [财务接口](#4-财务接口)
5. [提现接口](#5-提现接口)

---

## 1. 认证接口

### 1.1 商户登录

**前端位置**: `src/contexts/AuthContext.tsx` - `login()` 函数

**当前 Mock 实现**:
```typescript
// 硬编码验证: username === 'admin' && password === 'admin123'
```

**需要实现的接口**:

```
POST /auth/login
```

**请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应 - 成功 (200)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_001",
      "username": "admin",
      "restaurantId": "rest_001"
    }
  }
}
```

**响应 - 失败 (401)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "用户名或密码错误"
  }
}
```

---

## 2. 餐馆信息接口

### 2.1 获取餐馆信息

**前端位置**: `src/pages/Restaurant/index.tsx`

**当前 Mock 数据位置**: `src/mock/data.ts` - `mockRestaurant`

```
GET /restaurant
```

**请求头**:
```
Authorization: Bearer {token}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": "rest_001",
    "name": "Golden Dragon Chinese Restaurant",
    "address": "1234 Main Street, San Francisco, CA 94102",
    "phone": "(415) 555-0123",
    "deliveryMode": "hybrid",
    "status": "active",
    "joinDate": "2024-06-15",
    "deliverySettings": {
      "selfDeliveryRadius": 3,
      "uberMaxRadius": 10,
      "coordinates": {
        "lat": 37.7749,
        "lng": -122.4194
      }
    }
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `deliveryMode` | enum | `uber` \| `self` \| `hybrid` |
| `status` | enum | `active` \| `paused` \| `terminated` |
| `deliverySettings` | object | 仅当 deliveryMode 为 `self` 或 `hybrid` 时存在 |
| `selfDeliveryRadius` | number | 商家自配送半径（英里），范围 0.5-10 |
| `uberMaxRadius` | number | Uber 最大配送半径（固定 10 英里） |

---

### 2.2 更新配送范围设置

**前端位置**: `src/pages/Restaurant/DeliveryRangeMap.tsx` - `handleSave()`

**当前 Mock 实现**: 仅 console.log，无实际保存

```
PATCH /restaurant/delivery-settings
```

**请求头**:
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "selfDeliveryRadius": 3.5
}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "selfDeliveryRadius": 3.5,
    "uberMaxRadius": 10,
    "coordinates": {
      "lat": 37.7749,
      "lng": -122.4194
    }
  }
}
```

---

## 3. 订单管理接口

### 3.1 获取订单列表

**前端位置**: `src/pages/Orders/index.tsx`

**当前 Mock 数据位置**: `src/mock/data.ts` - `mockOrders`

```
GET /orders
```

**请求头**:
```
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `pageSize` | number | 否 | 每页数量，默认 10 |
| `status` | string | 否 | 筛选状态: `pending` \| `completed` \| `cancelled` |
| `orderType` | string | 否 | 订单类型: `delivery` \| `pickup` |
| `search` | string | 否 | 搜索关键词（订单号或客户电话） |
| `startDate` | string | 否 | 开始日期 (ISO 8601) |
| `endDate` | string | 否 | 结束日期 (ISO 8601) |

**请求示例**:
```
GET /orders?page=1&pageSize=10&status=pending&startDate=2024-12-01&endDate=2024-12-31
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-20241226-001",
        "customerPhone": "(415) 555-1234",
        "orderType": "delivery",
        "items": [
          {
            "id": "1",
            "name": "Kung Pao Chicken",
            "quantity": 2,
            "price": 15.99,
            "notes": "Extra spicy"
          }
        ],
        "subtotal": 58.95,
        "deliveryFee": 5.99,
        "tax": 5.31,
        "tips": 8.00,
        "total": 78.25,
        "paymentMethod": "card",
        "paymentStatus": "paid",
        "deliveryAddress": "567 Oak Avenue, Apt 2B, San Francisco, CA 94103",
        "status": "pending",
        "cancelReason": null,
        "createdAt": "2024-12-26T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 156,
      "totalPages": 16
    }
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `orderType` | enum | `delivery` \| `pickup` |
| `paymentMethod` | enum | `card` \| `cash` |
| `paymentStatus` | enum | `paid` \| `pending` \| `failed` |
| `status` | enum | `pending` \| `completed` \| `cancelled` |
| `deliveryAddress` | string | 仅 delivery 类型订单有此字段 |
| `cancelReason` | string | 仅 cancelled 状态订单有此字段 |

---

### 3.2 获取单个订单详情

**前端位置**: `src/pages/Orders/OrderDetailModal.tsx`

```
GET /orders/{orderId}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": "ORD-20241226-001",
    "customerPhone": "(415) 555-1234",
    "orderType": "delivery",
    "items": [...],
    "subtotal": 58.95,
    "deliveryFee": 5.99,
    "tax": 5.31,
    "tips": 8.00,
    "total": 78.25,
    "paymentMethod": "card",
    "paymentStatus": "paid",
    "deliveryAddress": "567 Oak Avenue, Apt 2B, San Francisco, CA 94103",
    "status": "pending",
    "createdAt": "2024-12-26T10:30:00Z"
  }
}
```

---

### 3.3 完成订单

**前端位置**: `src/pages/Orders/index.tsx` - `handleCompleteOrder()`

**当前 Mock 实现**: 直接修改本地 state

```
POST /orders/{orderId}/complete
```

**请求头**:
```
Authorization: Bearer {token}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": "ORD-20241226-001",
    "status": "completed",
    "completedAt": "2024-12-26T12:30:00Z"
  }
}
```

---

### 3.4 取消订单

**前端位置**: `src/pages/Orders/CancelOrderModal.tsx`

**当前 Mock 实现**: 直接修改本地 state

```
POST /orders/{orderId}/cancel
```

**请求头**:
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "reason": "Customer requested cancellation"
}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": "ORD-20241226-001",
    "status": "cancelled",
    "cancelReason": "Customer requested cancellation",
    "cancelledAt": "2024-12-26T11:00:00Z"
  }
}
```

---

### 3.5 导出订单

**前端位置**: `src/pages/Orders/index.tsx` - `handleExport()`

**当前 Mock 实现**: 前端生成 CSV/Excel 文件

```
GET /orders/export
```

**查询参数**: 与 3.1 获取订单列表相同的筛选参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `format` | string | 是 | `csv` \| `excel` |
| `status` | string | 否 | 筛选状态 |
| `startDate` | string | 否 | 开始日期 |
| `endDate` | string | 否 | 结束日期 |

**响应**: 文件下载 (Content-Type: application/octet-stream)

---

## 4. 财务接口

### 4.1 获取财务统计

**前端位置**: `src/pages/Finance/index.tsx`

**当前 Mock 数据位置**: `src/mock/data.ts` - `getFinanceStats()`

```
GET /finance/stats
```

**请求头**:
```
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `period` | string | 否 | `today` \| `week` \| `month` \| `custom`，默认 `today` |
| `startDate` | string | 否 | 自定义开始日期 (当 period=custom 时必填) |
| `endDate` | string | 否 | 自定义结束日期 (当 period=custom 时必填) |

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "orderCount": 87,
    "totalAmount": 3245.67,
    "deliveryFee": 245.78,
    "platformFee": 162.28,
    "settlementAmount": 2837.61,
    "settledAmount": 2456.78,
    "pendingAmount": 380.83
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `orderCount` | number | 订单数量 |
| `totalAmount` | number | 订单总金额 |
| `deliveryFee` | number | 配送费支出 (Uber 配送费) |
| `platformFee` | number | 平台服务费 |
| `settlementAmount` | number | 应结算金额 = totalAmount - deliveryFee - platformFee |
| `settledAmount` | number | 已结算金额 |
| `pendingAmount` | number | 待结算金额 |

---

### 4.2 获取趋势数据

**前端位置**: `src/pages/Finance/index.tsx` - 图表数据

**当前 Mock 数据位置**: `src/mock/data.ts` - `mockDailyStats`

```
GET /finance/trends
```

**请求头**:
```
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `period` | string | 否 | `week` \| `month`，默认 `week` |

**响应 (200)**:
```json
{
  "success": true,
  "data": [
    { "date": "12/20", "orders": 45, "amount": 1678.90 },
    { "date": "12/21", "orders": 52, "amount": 1923.45 },
    { "date": "12/22", "orders": 38, "amount": 1456.78 },
    { "date": "12/23", "orders": 61, "amount": 2234.56 },
    { "date": "12/24", "orders": 73, "amount": 2789.12 },
    { "date": "12/25", "orders": 28, "amount": 1045.67 },
    { "date": "12/26", "orders": 12, "amount": 458.90 }
  ]
}
```

---

### 4.3 获取打款记录

**前端位置**: `src/pages/Finance/index.tsx` - 打款记录表格

**当前 Mock 数据位置**: `src/mock/data.ts` - `mockPaymentRecords`

```
GET /finance/payments
```

**请求头**:
```
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `pageSize` | number | 否 | 每页数量，默认 10 |

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "PAY-001",
        "date": "2024-12-20",
        "amount": 2456.78,
        "status": "completed",
        "method": "ach",
        "bankAccount": "****4567"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 24,
      "totalPages": 3
    }
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | enum | `completed` \| `processing` \| `failed` |
| `method` | enum | `ach` (目前仅支持 ACH 转账) |
| `bankAccount` | string | 银行账户后4位 (脱敏显示) |

---

## 5. 提现接口

### 5.1 获取提现余额

**前端位置**: `src/pages/Finance/index.tsx` - 提现管理 Tab

**当前 Mock 数据位置**: `src/mock/data.ts` - `mockWithdrawalBalance`

```
GET /withdrawal/balance
```

**请求头**:
```
Authorization: Bearer {token}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "availableAmount": 2600.71,
    "frozenAmount": 458.90,
    "processingAmount": 500.00,
    "totalWithdrawn": 15678.45,
    "minimumWithdrawal": 50.00,
    "withdrawalFeeRate": 0
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `availableAmount` | number | 可提现金额 |
| `frozenAmount` | number | 冻结金额（未完成订单） |
| `processingAmount` | number | 处理中金额（已发起提现未到账） |
| `totalWithdrawn` | number | 历史累计提现总额 |
| `minimumWithdrawal` | number | 最低提现金额 |
| `withdrawalFeeRate` | number | 提现手续费率（0 = 免手续费） |

---

### 5.2 获取银行账户列表

**前端位置**: `src/pages/Finance/BankAccountModal.tsx`

**当前 Mock 数据位置**: `src/mock/data.ts` - `mockBankAccounts`

```
GET /withdrawal/bank-accounts
```

**请求头**:
```
Authorization: Bearer {token}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "bank_001",
      "bankName": "Chase Bank",
      "accountType": "checking",
      "accountNumber": "****4567",
      "routingNumber": "****1234",
      "isDefault": true,
      "createdAt": "2024-06-15T00:00:00Z"
    }
  ]
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `accountType` | enum | `checking` \| `savings` |
| `accountNumber` | string | 账户号码后4位（脱敏） |
| `routingNumber` | string | 路由号码后4位（脱敏） |
| `isDefault` | boolean | 是否为默认提现账户 |

---

### 5.3 添加银行账户

**前端位置**: `src/pages/Finance/BankAccountModal.tsx` - 添加表单

**当前 Mock 实现**: 本地 state 操作

```
POST /withdrawal/bank-accounts
```

**请求头**:
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "bankName": "Chase Bank",
  "accountType": "checking",
  "accountNumber": "123456789012",
  "routingNumber": "021000021",
  "isDefault": true
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "id": "bank_003",
    "bankName": "Chase Bank",
    "accountType": "checking",
    "accountNumber": "****9012",
    "routingNumber": "****0021",
    "isDefault": true,
    "createdAt": "2024-12-26T10:00:00Z"
  }
}
```

**验证规则**:

| 字段 | 规则 |
|------|------|
| `bankName` | 必填，1-100 字符 |
| `accountType` | 必填，`checking` 或 `savings` |
| `accountNumber` | 必填，4-17 位数字 |
| `routingNumber` | 必填，9 位数字 |

---

### 5.4 删除银行账户

**前端位置**: `src/pages/Finance/BankAccountModal.tsx` - 删除按钮

**当前 Mock 实现**: 本地 state 操作

```
DELETE /withdrawal/bank-accounts/{accountId}
```

**请求头**:
```
Authorization: Bearer {token}
```

**响应 (200)**:
```json
{
  "success": true,
  "message": "Bank account deleted successfully"
}
```

**注意**: 不能删除唯一的银行账户（至少保留一个）

---

### 5.5 设置默认银行账户

**前端位置**: `src/pages/Finance/BankAccountModal.tsx` - 设为默认按钮

**当前 Mock 实现**: 本地 state 操作

```
PATCH /withdrawal/bank-accounts/{accountId}/default
```

**请求头**:
```
Authorization: Bearer {token}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": "bank_002",
    "isDefault": true
  }
}
```

---

### 5.6 发起提现申请

**前端位置**: `src/pages/Finance/WithdrawalModal.tsx` - 提交提现

**当前 Mock 实现**: 本地 state 操作

```
POST /withdrawal/requests
```

**请求头**:
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "amount": 500.00,
  "bankAccountId": "bank_001"
}
```

**响应 (201)**:
```json
{
  "success": true,
  "data": {
    "id": "WD-20241226-001",
    "amount": 500.00,
    "fee": 0,
    "actualAmount": 500.00,
    "bankAccountId": "bank_001",
    "bankAccountInfo": "Chase ****4567",
    "status": "pending",
    "createdAt": "2024-12-26T10:00:00Z",
    "estimatedArrival": "2024-12-30T00:00:00Z"
  }
}
```

**验证规则**:

| 规则 | 说明 |
|------|------|
| 最低金额 | amount >= minimumWithdrawal |
| 最高金额 | amount <= availableAmount |
| 银行账户 | bankAccountId 必须存在 |

**错误响应示例**:
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "可提现余额不足"
  }
}
```

---

### 5.7 获取提现记录

**前端位置**: `src/pages/Finance/index.tsx` - 提现记录表格

**当前 Mock 数据位置**: `src/mock/data.ts` - `mockWithdrawalRecords`

```
GET /withdrawal/requests
```

**请求头**:
```
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `pageSize` | number | 否 | 每页数量，默认 10 |
| `status` | string | 否 | 筛选状态 |

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "WD-20241226-001",
        "amount": 500.00,
        "fee": 0,
        "actualAmount": 500.00,
        "bankAccountId": "bank_001",
        "bankAccountInfo": "Chase ****4567",
        "status": "processing",
        "failReason": null,
        "createdAt": "2024-12-26T09:00:00Z",
        "processedAt": "2024-12-26T10:30:00Z",
        "completedAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

**状态说明**:

| 状态 | 说明 |
|------|------|
| `pending` | 待处理，刚提交的申请 |
| `processing` | 处理中，正在进行 ACH 转账 |
| `completed` | 已完成，资金已到账 |
| `failed` | 失败，转账失败（查看 failReason） |
| `cancelled` | 已取消，用户或系统取消 |

---

### 5.8 取消提现申请

**前端位置**: 暂未实现 UI

```
POST /withdrawal/requests/{requestId}/cancel
```

**请求头**:
```
Authorization: Bearer {token}
```

**响应 (200)**:
```json
{
  "success": true,
  "data": {
    "id": "WD-20241226-001",
    "status": "cancelled",
    "cancelledAt": "2024-12-26T11:00:00Z"
  }
}
```

**注意**: 只能取消 `pending` 状态的提现申请

---

## 错误响应格式

所有接口在发生错误时返回统一格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误信息"
  }
}
```

**常见错误码**:

| HTTP 状态码 | 错误码 | 说明 |
|-------------|--------|------|
| 400 | `INVALID_REQUEST` | 请求参数错误 |
| 401 | `UNAUTHORIZED` | 未认证或 Token 过期 |
| 403 | `FORBIDDEN` | 无权限访问 |
| 404 | `NOT_FOUND` | 资源不存在 |
| 500 | `INTERNAL_ERROR` | 服务器内部错误 |

---

## 前端 Mock 数据替换指南

后端接口开发完成后，前端需要进行以下替换：

### 1. 创建 API 服务层

建议在 `src/services/` 目录下创建 API 调用函数：

```
src/services/
├── api.ts           # axios 实例配置
├── auth.ts          # 认证相关 API
├── restaurant.ts    # 餐馆信息 API
├── orders.ts        # 订单管理 API
├── finance.ts       # 财务相关 API
└── withdrawal.ts    # 提现相关 API
```

### 2. 需要替换的文件

| 文件 | Mock 数据引用 | 替换为 |
|------|--------------|--------|
| `src/contexts/AuthContext.tsx` | 硬编码登录验证 | `POST /auth/login` |
| `src/pages/Restaurant/index.tsx` | `mockRestaurant` | `GET /restaurant` |
| `src/pages/Restaurant/DeliveryRangeMap.tsx` | console.log | `PATCH /restaurant/delivery-settings` |
| `src/pages/Orders/index.tsx` | `mockOrders` | `GET /orders` |
| `src/pages/Orders/index.tsx` | 本地 state 修改 | `POST /orders/{id}/complete`, `POST /orders/{id}/cancel` |
| `src/pages/Finance/index.tsx` | `getFinanceStats()` | `GET /finance/stats` |
| `src/pages/Finance/index.tsx` | `mockDailyStats` | `GET /finance/trends` |
| `src/pages/Finance/index.tsx` | `mockPaymentRecords` | `GET /finance/payments` |
| `src/pages/Finance/index.tsx` | `mockWithdrawalBalance` | `GET /withdrawal/balance` |
| `src/pages/Finance/index.tsx` | `mockWithdrawalRecords` | `GET /withdrawal/requests` |
| `src/pages/Finance/index.tsx` | `mockBankAccounts` | `GET /withdrawal/bank-accounts` |
| `src/pages/Finance/WithdrawalModal.tsx` | 本地 state 操作 | `POST /withdrawal/requests` |
| `src/pages/Finance/BankAccountModal.tsx` | 本地 state 操作 | `POST/DELETE/PATCH /withdrawal/bank-accounts` |

### 3. 环境变量配置

在 `.env` 文件中添加：

```env
VITE_API_BASE_URL=https://api.iorderai.com/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## TypeScript 类型定义

所有类型定义位于 `src/types/index.ts`，可直接用于后端接口响应的类型约束。
