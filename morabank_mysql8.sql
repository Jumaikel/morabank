-- =====================================================================================
-- SQL Script para MySQL 8.0: “morabank” Database Schema – VERSIÓN SIN FOREIGN KEYS EN transactions
-- Se eliminan las restricciones FOREIGN KEY en la tabla transactions para permitir IBANs externos
-- =====================================================================================
-- ------------------------------------------------------------
-- 1) Crear la base de datos “morabank” (si no existe) y seleccionarla
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS morabank CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci;

USE morabank;

-- ------------------------------------------------------------
-- 4) Tabla: accounts
--    - Mantiene su definición original (sin cambios)
-- ------------------------------------------------------------
CREATE TABLE
  IF NOT EXISTS accounts (
    iban VARCHAR(24) NOT NULL COMMENT 'IBAN completo (ej. "CR2101110001571903865386")',
    account_number VARCHAR(20) NOT NULL COMMENT 'Número de cuenta local (20 dígitos)',
    account_type ENUM ('CORRIENTE', 'AHORROS') NOT NULL COMMENT 'Tipo de cuenta',
    account_holder VARCHAR(100) NOT NULL COMMENT 'Titular de la cuenta (nombre completo)',
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Saldo actual (>= 0)',
    status ENUM ('ACTIVO', 'BLOQUEADO', 'CERRADO') NOT NULL DEFAULT 'ACTIVO' COMMENT 'Estado de la cuenta',
    created_at DATETIME (6) NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) COMMENT 'Fecha de creación',
    updated_at DATETIME (6) NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'Última actualización',
    PRIMARY KEY (iban),
    UNIQUE KEY uq_accounts_number (account_number),
    CHECK (balance >= 0)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Tabla de cuentas bancarias';

-- ------------------------------------------------------------
-- 5) Tabla: users
--    - Mantiene relación con accounts vía foreign key (no modifica)
-- ------------------------------------------------------------
CREATE TABLE
  IF NOT EXISTS users (
    identification VARCHAR(20) NOT NULL COMMENT 'Identificación del usuario (cédula)',
    name VARCHAR(100) NOT NULL COMMENT 'Primer nombre',
    last_name VARCHAR(100) NOT NULL COMMENT 'Primer apellido',
    second_last_name VARCHAR(100) NULL COMMENT 'Segundo apellido (opcional)',
    phone VARCHAR(15) NOT NULL COMMENT 'Teléfono único (ej. "+50688881234" o "88881234")',
    email VARCHAR(100) NOT NULL COMMENT 'Correo electrónico único (para login)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hash de contraseña (bcrypt, Argon2, etc.)',
    user_type CHAR(1) NOT NULL DEFAULT 'C' COMMENT 'Tipo de usuario: A=Administrador, C=Cliente',
    account_iban VARCHAR(24) NOT NULL COMMENT 'IBAN de la cuenta asociada (FK → accounts.iban)',
    created_at DATETIME (6) NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) COMMENT 'Fecha creación de usuario',
    updated_at DATETIME (6) NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'Última modificación de usuario',
    PRIMARY KEY (identification),
    UNIQUE KEY uq_user_phone (phone),
    UNIQUE KEY uq_user_email (email),
    INDEX idx_user_account (account_iban),
    CONSTRAINT fk_user_account FOREIGN KEY (account_iban) REFERENCES accounts (iban) ON UPDATE CASCADE ON DELETE RESTRICT
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Usuarios del sistema';

-- ------------------------------------------------------------
-- 6) Tabla: transactions (SIN FOREIGN KEY en origin_iban y destination_iban)
--    - Se eliminan las restricciones FOREIGN KEY para permitir IBANs externos
-- ------------------------------------------------------------
-- ------------------------------------------------------------
-- (Actualización) Tabla: transactions (con nuevos campos)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
  transaction_id VARCHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'UUID v4 de la transacción',
  created_at DATETIME(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) COMMENT 'Fecha creación (UTC)',
  origin_iban VARCHAR(24) NULL COMMENT 'IBAN origen (puede ser externo)',
  destination_iban VARCHAR(24) NULL COMMENT 'IBAN destino (puede ser externo)',
  origin_phone VARCHAR(15) NULL COMMENT 'Número de teléfono origen (solo SINPEMÓVIL)',
  destination_phone VARCHAR(15) NULL COMMENT 'Número de teléfono destino (solo SINPEMÓVIL)',
  transaction_type ENUM('INTERNA', 'EXTERNA', 'SINPEMOVIL') NOT NULL COMMENT 'Tipo de transacción',
  amount DECIMAL(15, 2) NOT NULL COMMENT 'Monto > 0',
  currency VARCHAR(3) NOT NULL DEFAULT 'CRC' COMMENT 'Código ISO 4217 (CRC, USD, EUR)',
  status ENUM('PENDING', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING' COMMENT 'Estado de la transacción',
  description VARCHAR(255) NULL COMMENT 'Descripción / razón del movimiento',
  hmac_md5 VARCHAR(32) NOT NULL COMMENT 'HMAC-MD5 enviado por el emisor (hexadecimal)',
  updated_at DATETIME(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'Última actualización',
  PRIMARY KEY (transaction_id),
  INDEX idx_trans_origin (origin_iban),
  INDEX idx_trans_destination (destination_iban),
  INDEX idx_trans_timestamp (created_at),
  CHECK (amount > 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Registro de transacciones (origen y destino en IBAN)';

-- ------------------------------------------------------------
-- Nueva Tabla: audit_logs
--    - Historial de cambios de estado por transacción
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT NOT NULL AUTO_INCREMENT COMMENT 'ID interno del log',
  transaction_id VARCHAR(36) NOT NULL COMMENT 'FK lógica a transactions.transaction_id',
  previous_status ENUM('PENDING', 'COMPLETED', 'REJECTED') NULL COMMENT 'Estado anterior',
  new_status ENUM('PENDING', 'COMPLETED', 'REJECTED') NOT NULL COMMENT 'Estado nuevo',
  changed_at DATETIME(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) COMMENT 'Fecha del cambio',
  changed_by VARCHAR(100) NULL COMMENT 'Sistema, banco o usuario que generó el cambio',
  PRIMARY KEY (id),
  INDEX idx_audit_trans (transaction_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Historial de cambios de estado de transacciones';


-- ------------------------------------------------------------
-- 7) Tabla: mfa_codes
--    - Sin cambios respecto a la FK hacia users
-- ------------------------------------------------------------
CREATE TABLE
  IF NOT EXISTS mfa_codes (
    id INT NOT NULL AUTO_INCREMENT COMMENT 'ID interno de MFA',
    user_id VARCHAR(20) NOT NULL COMMENT 'FK → users.identification',
    mfa_code VARCHAR(6) NOT NULL COMMENT 'Código de 6 dígitos para MFA',
    created_at DATETIME (6) NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) COMMENT 'Fecha creación (UTC)',
    expires_at DATETIME (6) NOT NULL COMMENT 'Fecha/hora de expiración (UTC)',
    used BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'TRUE si ya se usó, FALSE si no',
    PRIMARY KEY (id),
    INDEX idx_mfa_user (user_id),
    INDEX idx_mfa_code (mfa_code),
    CONSTRAINT fk_mfa_user FOREIGN KEY (user_id) REFERENCES users (identification) ON UPDATE CASCADE ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Códigos MFA enviados por correo';

-- ------------------------------------------------------------
-- 8) Insertar datos de ejemplo en accounts
-- ------------------------------------------------------------
INSERT INTO
  accounts (
    iban,
    account_number,
    account_type,
    account_holder,
    balance,
    status,
    created_at,
    updated_at
  )
VALUES
  (
    'CR2101110001571903865386',
    '9152203447634362',
    'CORRIENTE',
    'Jumaikel Chinchilla Mora',
    1000000.00,
    'ACTIVO',
    '2025-06-05 21:34:53.679481',
    '2025-06-05 21:34:53.679481'
  );

-- ------------------------------------------------------------
-- 9) Insertar datos de ejemplo en users
-- ------------------------------------------------------------
INSERT INTO
  users (
    identification,
    name,
    last_name,
    second_last_name,
    phone,
    email,
    password_hash,
    user_type,
    account_iban,
    created_at,
    updated_at
  )
VALUES
  (
    '118870806',
    'Jumaikel',
    'Chinchilla',
    'Mora',
    '84966163',
    'jumaikelcm@gmail.com',
    '$2b$10$3Xx5rl9HwGV3PDtnbviQZuQ0CQ.e243knSQLaAVKJ2RC39JNP.dtK',
    'A',
    'CR2101110001571903865386',
    '2025-06-05 21:34:53.693865',
    '2025-06-05 22:40:12.415350'
  );