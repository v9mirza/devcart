# DevCart

Backend API for a small e-commerce flow: accounts, catalog, cart, wishlist, orders, and an AdminJS dashboard.

## Stack

Node.js, Express, MongoDB (Mongoose), JWT + bcrypt, AdminJS (session auth via Mongo store).

## Features

- **Auth** — Register, login (JWT), protected profile (`/api/users/me`).
- **Roles** — `user` / `admin` for product, order, and category management.
- **Catalog** — Categories; products with optional `?category=`, `page`, `limit`.
- **Cart & wishlist** — Per-user cart and wishlist (authenticated).
- **Orders** — Create, list own orders, pay; admins list all and mark delivered.
- **Admin UI** — [AdminJS](https://adminjs.co/) at `/admin` for Users, Categories, Products, Orders, Cart, Wishlist.
- **Data** — Product seeder; MVP-style Node test scripts.

## Prerequisites

- Node.js (LTS recommended)
- MongoDB running locally or a `MONGO_URI` you can reach

## Setup

1. Copy environment file:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env`: at minimum set `MONGO_URI`, `JWT_SECRET`, `API_BASE_URL`, and for `/admin` set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET`. Optional test credentials match `backend/.env.example`.

3. Install and run:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. Optional — seed sample products:

   ```bash
   npm run seed
   ```

5. Admin — open `http://localhost:<PORT>/admin` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Tests

From `backend/`:

| Command | Purpose |
| --- | --- |
| `npm run test:mvp` | Runs all MVP scripts in sequence |
| `npm run test:health` | Health check |
| `npm run test:auth` | Auth flow |
| `npm run test:products` | Products |
| `npm run test:orders` | Orders |
| `npm run test:cart` | Cart |
| `npm run test:wishlist` | Wishlist |

Test users in `.env` (`TEST_USER_*`, `TEST_ADMIN_*`) must match what the scripts expect.

## API overview

Send `Authorization: Bearer <token>` on routes that require auth.

| Area | Routes |
| --- | --- |
| **Health** | `GET /api/health` |
| **Users** | `POST /api/users` (register), `GET /api/users/me` (auth) |
| **Auth** | `POST /api/auth/login` |
| **Categories** | `GET /api/categories`, `GET /api/categories/:id`; `POST` / `PUT` / `DELETE` admin |
| **Products** | `GET /api/products` (`?category=`, `page`, `limit`), `GET /api/products/:id`; `POST` / `PUT` / `DELETE` admin |
| **Cart** | `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:productId`, `DELETE /api/cart`, `DELETE /api/cart/:productId` (auth) |
| **Wishlist** | `GET /api/wishlist`, `POST /api/wishlist/toggle`, `DELETE /api/wishlist` (auth) |
| **Orders** | `POST /api/orders`, `GET /api/orders/myorders`, `GET /api/orders/:id`, `PUT /api/orders/:id/pay` (auth); `GET /api/orders`, `PUT /api/orders/:id/deliver` (admin) |

Production: use `npm start` (runs `node server.js`).

## Frontend

React client in progress (not documented in this repo yet).
