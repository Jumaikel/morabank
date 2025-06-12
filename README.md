# MoraBank – Aplicación Bancaria con Next.js 15, TypeScript, Prisma y MySQL

![MoraBank Logo](./public/icon.png)

**MoraBank** es una plataforma bancaria moderna que simula el Sistema Nacional de Pagos Electrónicos (SINPE) de Costa Rica. Está construida con **Next.js 15**, **TypeScript**, **Prisma**, **Tailwind CSS** y **MySQL 8**, e incluye funcionalidades de autenticación multifactor (MFA) por correo electrónico y seguridad de transacciones mediante HMAC‑MD5.

---

## 🌟 Características Principales

* **Gestión de Bancos y Cuentas**: CRUD completo para bancos y cuentas (IBAN, número local, tipo, titular, saldo, estado).
* **Usuarios y Autenticación**: Registro, inicio de sesión con correo/contraseña, recuperación de contraseña y MFA (códigos de 6 dígitos) vía email.
* **Transacciones Seguras**: Transferencias internas, externas y SINPE Móvil con firma HMAC‑MD5, actualizaciones atómicas de saldo, historial de transacciones y bitácora de auditoría.
* **Arquitectura API‑First**: Endpoints REST bien estructurados bajo `src/app/api/*`, aprovechando el App Router de Next.js 15.
* **Frontend React con Tailwind CSS**: UI responsiva, componentes reutilizables y modo oscuro.
* **Despliegue y CI/CD**: Listo para Vercel, Docker y GitHub Actions.

---

## 📦 Tecnologías

* **Next.js 15** (App Router)
* **TypeScript**
* **Tailwind CSS**
* **Prisma ORM** con MySQL 8
* **Node.js Crypto** (HMAC‑MD5)
* **Nodemailer** (envío de emails MFA)
* **Docker** (opcional) para base de datos

---

## 🚀 Primeros Pasos

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/morabank.git
cd morabank
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```env
DATABASE_URL="mysql://root:password@localhost:3306/morabank"
JWT_SECRET="tu_secreto_jwt"
HMAC_SECRET="tu_secreto_hmac"
GMAIL_USER="tu-email@gmail.com"
GMAIL_PASS="tu_contraseña_email"
EMAIL_FROM="noreply@morabank.app"
BANK_CODE="111"
```

### 4. Crear e importar esquema de base de datos

Se proporciona el script `morabank_mysql8.sql` con la definición completa (tablas: `accounts`, `users`, `transactions`, `audit_logs`, `mfa_codes`, datos de ejemplo).

```bash
mysql -u root -p < morabank_mysql8.sql
```

### 5. Generar Prisma Client

```bash
npx prisma generate
```

### 6. Ejecutar migraciones (si modifica el esquema)

```bash
npx prisma migrate dev --name init
```

### 7. Iniciar servidor de desarrollo

```bash
npm run dev
# o
yarn dev
```

Accede a [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```text
/
├── prisma/
│   └── schema.prisma           # Esquema Prisma
├── public/                     # Archivos estáticos, iconos, certificados
├── src/
│   ├── app/
│   │   ├── api/                # Rutas API (App Router)
│   │   │   ├── accounts/
│   │   │   │   ├── iban/
│   │   │   │   ├── by-user/
│   │   │   │   └── route.ts
│   │   │   ├── auth/
│   │   │   │   ├── change-password/
│   │   │   │   ├── login/
│   │   │   │   ├── send-otp/
│   │   │   │   └── verify-mfa/
│   │   │   ├── mfa-codes/
│   │   │   │   └── [id]/route.ts
│   │   │   ├── proxy/
│   │   │   │   ├── sinpe-movil-transfer/route.ts
│   │   │   │   ├── sinpe-transfer/route.ts
│   │   │   │   └── services/
│   │   │   ├── sinpe-subscriptions/
│   │   │   │   └── [phone]/route.ts
│   │   │   ├── sinpe-transfer/route.ts
│   │   │   ├── sse/route.ts
│   │   │   ├── transactions/
│   │   │   │   └── [transaction_id]/route.ts
│   │   │   └── users/
│   │   │       └── [identification]/route.ts
│   │   ├── globals.css         # Estilos globales Tailwind
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Dashboard / Home
│   ├── components/             # Componentes React reutilizables
│   ├── config/                 # Configuración de endpoints y constantes
│   ├── generated/              # Prisma Client generado
│   ├── lib/                    # Inicialización de Prisma, utilidades
│   ├── models/                 # Tipos e interfaces TypeScript
│   ├── services/               # Lógica de negocio y acceso a datos
│   ├── stores/                 # Varios estados globales (Zustand, etc.)
│   └── middleware.ts           # Middlewares Next.js
├── morabank_mysql8.sql         # Script SQL de esquema y datos de ejemplo
├── server.ts                   # Servidor custom (opcional)
├── next.config.ts              # Configuración Next.js
├── tsconfig.json               # Configuración TypeScript
├── tailwind.config.js          # Configuración Tailwind
└── README.md                   # (Este archivo)
```

---

## 🔧 Rutas API Principales

Todos los endpoints utilizan prefijo `/api/*` y siguen convenciones REST.

### Cuentas (`/api/accounts`)

* `GET  /api/accounts`               → Listar todas las cuentas
* `POST /api/accounts`               → Crear cuenta nueva
* `GET  /api/accounts/:iban`         → Obtener cuenta por IBAN
* `PUT  /api/accounts/:iban`         → Actualizar cuenta
* `DELETE /api/accounts/:iban`       → Eliminar cuenta
* `GET  /api/accounts/by-user`       → Listar cuentas de un usuario

### Usuarios (`/api/users`)

* `GET  /api/users`                  → Listar usuarios
* `POST /api/users`                  → Registrar usuario
* `GET  /api/users/:identification`  → Obtener usuario por cédula
* `PUT  /api/users/:identification`  → Actualizar usuario
* `DELETE /api/users/:identification`→ Eliminar usuario

### Autenticación (`/api/auth`)

* `POST /api/auth/login`             → Login (genera MFA)
* `POST /api/auth/send-otp`          → Enviar código MFA
* `POST /api/auth/verify-mfa`        → Verificar código MFA
* `POST /api/auth/change-password`   → Cambiar contraseña

### Códigos MFA (`/api/mfa-codes`)

* `GET  /api/mfa-codes`              → Listar códigos (solo admin)
* `POST /api/mfa-codes`              → Generar nuevo código
* `GET  /api/mfa-codes/:id`          → Obtener código por ID
* `DELETE /api/mfa-codes/:id`        → Eliminar código

### Transacciones (`/api/transactions`)

* `GET  /api/transactions`           → Listar transacciones
* `POST /api/transactions`           → Crear transferencia (HMAC, saldo)
* `GET  /api/transactions/:id`       → Detalle de transacción
* `PUT  /api/transactions/:id`       → Actualizar (opcional)
* `DELETE /api/transactions/:id`     → Eliminar (opcional)

### SINPE Móvil / Proxy

* `POST /api/proxy/sinpe-movil-transfer` → Transferencia vía teléfono
* `POST /api/proxy/sinpe-transfer`       → Transferencia interbancaria externa
* `GET  /api/sinpe-subscriptions/:phone` → Consultar suscripción SINPE Móvil

---

## 🤝 Contribuciones

¡Bienvenidas! Por favor:

1. Abre un *fork* y crea una rama (`feature/tu-feature`).
2. Haz *commit* con buen mensaje.
3. Envía un *Pull Request* describiendo tus cambios.
4. Asegúrate de seguir las reglas de ESLint/Prettier.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver [LICENSE](./LICENSE) para más detalles.

---

> «Banca reinventada—segura, moderna y amigable para desarrolladores.» 🚀
