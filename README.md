# 🚀 MoraBank – Next.js Banking App

![MoraBank Logo](./public/icon.png)

**MoraBank** is a modern, full-stack banking application built with **Next.js 15**, **TypeScript**, **Prisma**, **Tailwind CSS**, and **MySQL**. It simulates an interbank transfer system (inspired by SINPE), featuring secure HMAC‐MD5 transaction signing and email‐based multi‐factor authentication (MFA).

---

## 🌟 Key Features

- **Bank & Account Management**:  
  - Register and manage banks, accounts, and user profiles.  
  - Full CRUD for banks, accounts, transactions, and HMAC keys.

- **Secure Transactions**:  
  - HMAC‐MD5 signing between banks for transaction integrity.  
  - Atomic balance updates with Prisma transactions.  
  - Detailed transaction history (status: PENDING, COMPLETED, REJECTED).

- **Authentication & Authorization**:  
  - Email + password login (bcrypt/Argon2 hashing).  
  - Email‐based MFA codes (6‐digit codes expire after a configurable interval).  
  - Secure password reset flow via MFA.

- **API‐First Architecture (App Router)**:  
  - All endpoints under `src/app/api/*`, following Next.js 15 App Router conventions.  
  - Type‐safe Prisma client for data access.  
  - Well‐structured route handlers for `banks`, `accounts`, `users`, `transactions`, `hmac_keys`, `mfa_codes`.

- **Modern Frontend with Tailwind CSS**:  
  - Responsive, accessible UI powered by Tailwind.  
  - Pre‐built components for forms, tables, navigation, and modals.  
  - Dark mode support (toggleable).

- **Developer‐Friendly**:  
  - Fully typed with TypeScript (frontend models mirror `schema.prisma`).  
  - Automatic Prisma migrations and type generation.  
  - Clear folder structure: `src/app`, `src/lib/prisma`, `src/generated/prisma`.

---

## 📦 Tech Stack

- **Frontend**:  
  - [Next.js 15](https://nextjs.org/) (App Router)  
  - [TypeScript](https://www.typescriptlang.org/)  
  - [Tailwind CSS](https://tailwindcss.com/)  
  - React Hooks, Context API, & SWR/React Query (optional)

- **Backend / Database**:  
  - [Prisma](https://www.prisma.io/) ORM  
  - **MySQL 8** (or compatible MariaDB)  
  - HMAC‐MD5 transaction signing (Node.js `crypto`)

- **Authentication**:  
  - Email/password (bcrypt or Argon2)  
  - Email‐based MFA codes (6 digits, configurable expiration)  
  - JWTs or NextAuth.js (optional for session management)

- **Deployment**:  
  - [Vercel](https://vercel.com/) (Next.js hosting)  
  - AWS RDS / DigitalOcean Managed MySQL (production DB)  
  - GitHub Actions for CI/CD (migrations, linting, tests)

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js v18+ (LTS recommended)  
- npm (v8+) or Yarn (v1.22+)  
- MySQL 8.0 (local or Docker)  
- [Git](https://git-scm.com/)

### 2. Clone the Repository

```bash
git clone https://github.com/your‐username/morabank.git
cd morabank
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Environment Variables

Create a `.env` file in the project root:

```env
# MySQL connection string (format: mysql://USER:PASSWORD@HOST:PORT/DATABASE)
DATABASE_URL="mysql://root:password@localhost:3306/morabank"

# JWT secret (for session/token signing)
JWT_SECRET="your_jwt_secret_here"

# HMAC secret (for transaction signing)
HMAC_SECRET="your_hmac_shared_secret"

# Email SMTP settings (for MFA codes)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"
EMAIL_FROM="noreply@morabank.app"
```

> **Note**: Never commit `.env` to version control. Use environment variable management in your deployment platform (Vercel, Netlify, etc.).

### 5. Database Setup & Migrations

1. **Create & Select Database**  
   ```sql
   CREATE DATABASE IF NOT EXISTS morabank CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE morabank;
   ```

2. **Prisma Migrate**  
   Ensure your `schema.prisma` (in `prisma/schema.prisma`) matches your SQL design:

   ```bash
   npx prisma migrate dev --name init
   ```

   This will generate a `prisma/migrations` folder and apply the initial migration.

3. **Prisma Generate**  
   ```bash
   npx prisma generate
   ```

   This generates the Prisma Client in `src/generated/prisma`.

### 6. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The server supports **Hot Module Replacement**, so changes reflect immediately.

---

## 📁 Project Structure

```
/
├─ prisma/
│   └─ schema.prisma          # Prisma schema (models, enums)
├─ src/
│   ├─ app/
│   │   ├─ api/
│   │   │   ├─ banks/
│   │   │   │   └─ route.ts    # GET, POST for banks
│   │   │   ├─ banks/[code]/
│   │   │   │   └─ route.ts    # GET, PUT, DELETE bank by code
│   │   │   ├─ accounts/
│   │   │   │   └─ route.ts    # GET, POST for accounts
│   │   │   ├─ accounts/[iban]/
│   │   │   │   └─ route.ts    # GET, PUT, DELETE account by IBAN
│   │   │   ├─ users/
│   │   │   │   └─ route.ts    # GET, POST for users
│   │   │   ├─ users/[id]/
│   │   │   │   └─ route.ts    # GET, PUT, DELETE user by ID
│   │   │   ├─ transactions/
│   │   │   │   └─ route.ts    # GET, POST for transactions
│   │   │   ├─ transactions/[id]/
│   │   │   │   └─ route.ts    # GET, PUT, DELETE transaction by ID
│   │   │   ├─ hmac_keys/
│   │   │   │   └─ route.ts    # GET, POST for HMAC keys
│   │   │   ├─ hmac_keys/[orig-dest]/
│   │   │   │   └─ route.ts    # GET, DELETE HMAC key
│   │   │   ├─ mfa_codes/
│   │   │   │   └─ route.ts    # GET, POST for MFA codes
│   │   ├─ globals.css         # Global Tailwind styles
│   │   ├─ layout.tsx          # Main layout (Navbar, Theme toggle, etc.)
│   │   └─ page.tsx            # Dashboard / Home page
│   ├─ components/             # Reusable React components (forms, tables, UI)
│   ├─ lib/
│   │   └─ prisma.ts           # Prisma client initialization
│   ├─ generated/
│   │   └─ prisma/             # Auto-generated Prisma Client
│   ├─ models/                 # TypeScript interfaces & types (mapped from Prisma)
│   └─ utils/                  # Helper functions (email sender, HMAC, JWT, etc.)
├─ .env                       # Local environment variables (gitignored)
├─ package.json
├─ tsconfig.json
├─ tailwind.config.js
└─ README.md                  # (You are here!)
```

---

## 🔧 API Endpoint Overview

Below is a summary of the available API routes (all prefixed with `/api/...`):

### Banks

| Method | Route                | Description                      |
|--------|----------------------|----------------------------------|
| GET    | `/api/banks`         | List all banks                   |
| POST   | `/api/banks`         | Create a new bank                |
| GET    | `/api/banks/:code`   | Retrieve bank by `bankCode`      |
| PUT    | `/api/banks/:code`   | Update bank details              |
| DELETE | `/api/banks/:code`   | Delete a bank (FK‐protected)      |

### Accounts

| Method | Route                   | Description                               |
|--------|-------------------------|-------------------------------------------|
| GET    | `/api/accounts`         | List all accounts (with associated bank)  |
| POST   | `/api/accounts`         | Create a new account                      |
| GET    | `/api/accounts/:iban`   | Retrieve account by IBAN                  |
| PUT    | `/api/accounts/:iban`   | Update account (holder, balance, status)  |
| DELETE | `/api/accounts/:iban`   | Delete an account (FK‐protected)           |

### Users

| Method | Route                | Description                             |
|--------|----------------------|-----------------------------------------|
| GET    | `/api/users`         | List all users (with associated account) |
| POST   | `/api/users`         | Register a new user (phone, email, etc.) |
| GET    | `/api/users/:id`     | Retrieve user by ID                     |
| PUT    | `/api/users/:id`     | Update user (email, password, phone)    |
| DELETE | `/api/users/:id`     | Delete a user                           |

### Transactions

| Method | Route                   | Description                                                 |
|--------|-------------------------|-------------------------------------------------------------|
| GET    | `/api/transactions`     | List all transactions (with origin & destination accounts)  |
| POST   | `/api/transactions`     | Create a new transaction (HMAC verification, balance update)|
| GET    | `/api/transactions/:id` | Retrieve transaction by `transactionId`                     |
| PUT    | `/api/transactions/:id` | (Optional) Update transaction details (e.g. reason)         |
| DELETE | `/api/transactions/:id` | (Optional) Delete a transaction                              |

### HMAC Keys

| Method | Route                        | Description                                     |
|--------|------------------------------|-------------------------------------------------|
| GET    | `/api/hmac_keys`             | List all HMAC keys (as Base64‐encoded strings)  |
| POST   | `/api/hmac_keys`             | Create or update a shared HMAC key               |
| GET    | `/api/hmac_keys/:orig-:dest` | Retrieve a specific HMAC key by origin→dest      |
| DELETE | `/api/hmac_keys/:orig-:dest` | Delete a specific HMAC key                      |

### MFA Codes

| Method | Route               | Description                                    |
|--------|---------------------|------------------------------------------------|
| GET    | `/api/mfa_codes`    | List all MFA codes (for testing/admins)        |
| POST   | `/api/mfa_codes`    | Generate a new MFA code for a given user       |
| GET    | `/api/mfa_codes/:id`| Retrieve an MFA code by ID (for validation)    |
| DELETE | `/api/mfa_codes/:id`| Delete an MFA code (after use or expiration)   |

---

## 📚 Usage Examples

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/users   -H "Content-Type: application/json"   -d '{
    "phone": "+50688881234",
    "accountIban": "ES21BBBBGGGGCCCCCCCCCC",
    "email": "user@example.com",
    "passwordHash": "$2b$10$abc123xyz..."  // bcrypt hash of password
  }'
```

### 2. Login & Generate MFA Code

```bash
curl -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{
    "email": "user@example.com",
    "password": "userPassword"
  }'
```
- On success, server generates a new MFA code, stores it in `mfa_codes`, and emails it to the user. Response:
```json
{
  "status": "MFA_REQUIRED",
  "userId": 123
}
```

### 3. Verify MFA

```bash
curl -X POST http://localhost:3000/api/auth/verify-mfa   -H "Content-Type: application/json"   -d '{
    "userId": 123,
    "mfaCode": "839102"
  }'
```
- On success, server returns a JWT or session cookie:
```json
{
  "status": "AUTHENTICATED",
  "token": "eyJhbGciOi..."
}
```

### 4. Create a New Bank

```bash
curl -X POST http://localhost:3000/api/banks   -H "Content-Type: application/json"   -d '{
    "bankCode": "BNCR",
    "name": "Banco Nacional de CR",
    "address": "San José, Costa Rica"
  }'
```

### 5. Perform a Transaction (HMAC‐Signed)

```bash
curl -X POST http://localhost:3000/api/transactions   -H "Content-Type: application/json"   -d '{
    "originIban": "ES21BBBBGGGGCCCCCCCCCC",
    "destinationIban": "ES12AAAAFFFFVVVVVVVVVV",
    "amount": 100.50,
    "currency": "USD",
    "reason": "Invoice Payment",
    "createdAt": "2025-06-01T12:00:00.000000Z",
    "hmacMd5": "a1b2c3d4e5f6..."   // HMAC-MD5 of (originIban + destinationIban + createdAt + amount.toFixed(2)), using HMAC_SECRET
  }'
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository.  
2. Create a new **branch**:  
   ```bash
   git checkout -b feature/YourFeature
   ```  
3. **Commit** your changes:  
   ```bash
   git commit -m "Add some feature"
   ```  
4. **Push** to your branch:  
   ```bash
   git push origin feature/YourFeature
   ```  
5. Open a **Pull Request** and describe your changes.

Please ensure your code follows the existing **Prettier**/ **ESLint** rules, and all tests (if any) pass.

---

## 📖 License

This project is **MIT‐licensed**. See [LICENSE](./LICENSE) for details.

---

## 🎉 Acknowledgements

- Inspired by **SINPE** (Costa Rica’s national payment system).  
- Built with ❤️ using Next.js, Prisma, and Tailwind CSS.  
- Special thanks to all early adopters, testers, and contributors.

---

*“Banking reinvented—secure, modern, and developer‐friendly.”* 🚀