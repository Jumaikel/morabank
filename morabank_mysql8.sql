-- =====================================================================================
-- SQL Script for MySQL 8.0: “morabank” Database Schema UPDATED
-- Now includes authentication by email/password and multi-factor (MFA).
-- =====================================================================================

-- ------------------------------------------------------------
-- 1) Create the “morabank” database and select it
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS morabank
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE morabank;


-- ------------------------------------------------------------
-- 2) Table: banks
--    Catalog of participating banks (inserting “MoraBank” as the home bank)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS banks (
  bank_code     VARCHAR(5)        NOT NULL COMMENT 'Unique bank code (e.g. “MRBK”)',
  name          VARCHAR(100)      NOT NULL COMMENT 'Full name of the bank (e.g. “MoraBank”)',
  address       VARCHAR(255)      NULL    COMMENT 'Address or notes (optional)',
  created_at    DATETIME(6)       NOT NULL DEFAULT (CURRENT_TIMESTAMP(6))
                                 COMMENT 'Record creation timestamp',
  updated_at    DATETIME(6)       NOT NULL DEFAULT (CURRENT_TIMESTAMP(6))
                                 ON UPDATE CURRENT_TIMESTAMP(6)
                                 COMMENT 'Record last update timestamp',
  PRIMARY KEY (bank_code)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Catalog of banks participating in the system';

-- Insert “MoraBank” as the home bank (if not already present)
INSERT IGNORE INTO banks (bank_code, name, address)
VALUES 
  ('MRBK', 'MoraBank', 'MoraBank Headquarters');


-- ------------------------------------------------------------
-- 3) Table: accounts
--    Each row represents a bank account with its full IBAN (24 characters)
--    Example Spanish IBAN pattern: 
--      • 2 letters for country code (ES)
--      • 2 control digits
--      • 4 digits of bank code
--      • 4 digits of branch code
--      • 2 digits internal check digits
--      • 10 digits of account number
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
  iban              VARCHAR(24)       NOT NULL 
                                 COMMENT 'Full IBAN (e.g. ES21BBBBGGGGCCCCCCCCCC)',
  bank_code         VARCHAR(5)        NOT NULL 
                                 COMMENT 'Owning bank code (FK → banks.bank_code)',
  account_holder    VARCHAR(100)      NOT NULL 
                                 COMMENT 'Name of the account holder',
  balance           DECIMAL(15,2)     NOT NULL DEFAULT 0.00 
                                 COMMENT 'Current account balance (>= 0)',
  state            ENUM('ACTIVE','BLOCKED','CLOSED') 
                                 NOT NULL DEFAULT 'ACTIVE' 
                                 COMMENT 'Account status',
  created_at        DATETIME(6)       NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) 
                                 COMMENT 'Record creation timestamp',
  updated_at        DATETIME(6)       NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) 
                                 ON UPDATE CURRENT_TIMESTAMP(6)
                                 COMMENT 'Record last update timestamp',
  PRIMARY KEY (iban),
  INDEX idx_accounts_bank (bank_code),
  CONSTRAINT chk_account_iban
    CHECK ( 
      iban REGEXP '^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{2}[0-9]{10}$'
    ),
  CONSTRAINT fk_account_bank
    FOREIGN KEY (bank_code)
    REFERENCES banks (bank_code)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (balance >= 0)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Table of bank accounts (stores full IBAN)';


-- ------------------------------------------------------------
-- 4) Table: users
--    Maps a phone number to an account (IBAN), now extended 
--    with email and password_hash for login, and linked to MFA.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id               INT             NOT NULL AUTO_INCREMENT 
                                 COMMENT 'Internal auto-increment ID',
  phone            VARCHAR(15)     NOT NULL 
                                 COMMENT 'Unique phone number (e.g. “+50688881234” or “88881234”)',
  account_iban     VARCHAR(24)        NOT NULL 
                                 COMMENT 'Associated account IBAN (FK → accounts.iban)',
  email            VARCHAR(100)    NOT NULL 
                                 COMMENT 'User email (unique, used for login)',
  password_hash    VARCHAR(255)    NOT NULL 
                                 COMMENT 'Hashed password (bcrypt, Argon2, etc.)',
  created_at       DATETIME(6)     NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) 
                                 COMMENT 'User registration timestamp',
  updated_at       DATETIME(6)     NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) 
                                 ON UPDATE CURRENT_TIMESTAMP(6)
                                 COMMENT 'Record last update timestamp',
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_phone (phone),
  UNIQUE KEY uq_user_email (email),
  INDEX idx_user_account (account_iban),
  CONSTRAINT fk_user_account
    FOREIGN KEY (account_iban)
    REFERENCES accounts (iban)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'System users (phone → account, with email and password for login)';


-- ------------------------------------------------------------
-- 5) Table: transactions
--    Records every interbank or intrabank transfer
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
  transaction_id   VARCHAR(36)        NOT NULL 
                                 DEFAULT (UUID()) 
                                 COMMENT 'Automatically generated UUID v4',
  created_at       DATETIME(6)     NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) 
                                 COMMENT 'Creation timestamp (UTC)',
  origin_iban      VARCHAR(24)        NOT NULL 
                                 COMMENT 'Origin account IBAN (FK → accounts.iban)',
  destination_iban VARCHAR(24)        NOT NULL 
                                 COMMENT 'Destination account IBAN (FK → accounts.iban)',
  amount           DECIMAL(15,2)   NOT NULL 
                                 COMMENT 'Transferred amount (always > 0)',
  currency         VARCHAR(3)         NOT NULL DEFAULT 'CRC' 
                                 COMMENT 'ISO 4217 currency code (CRC, USD, EUR)',
  state           ENUM('PENDING','COMPLETED','REJECTED') 
                                 NOT NULL DEFAULT 'PENDING' 
                                 COMMENT 'Transaction status',
  reason      VARCHAR(255)    NULL 
                                 COMMENT 'Description or reason for the transaction',
  hmac_md5         VARCHAR(32)        NOT NULL 
                                 COMMENT 'HMAC-MD5 computed by the sender (hexadecimal)',
  updated_at       DATETIME(6)     NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) 
                                 ON UPDATE CURRENT_TIMESTAMP(6)
                                 COMMENT 'Record last update timestamp',
  PRIMARY KEY (transaction_id),
  INDEX idx_trans_origin (origin_iban),
  INDEX idx_trans_destination (destination_iban),
  INDEX idx_trans_timestamp (created_at),
  CONSTRAINT fk_trans_origin
    FOREIGN KEY (origin_iban)
    REFERENCES accounts (iban)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_trans_destination
    FOREIGN KEY (destination_iban)
    REFERENCES accounts (iban)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (amount > 0)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Record of all transactions performed';


-- ------------------------------------------------------------
-- 6) Table: hmac_keys
--    Stores the shared HMAC keys between pairs of banks
-- ------------------------------------------------------------
CREATE TABLE hmac_keys (
  origin_bank      VARCHAR(5)         NOT NULL 
                                 COMMENT 'Code of the sending bank (FK → banks.bank_code)',
  destination_bank VARCHAR(5)         NOT NULL 
                                 COMMENT 'Code of the receiving bank (FK → banks.bank_code)',
  secret_key          VARBINARY(255)  NOT NULL 
                                 COMMENT 'Shared secret key (binary or Base64)',
  created_at       DATETIME(6)     NOT NULL DEFAULT (CURRENT_TIMESTAMP(6)) 
                                 COMMENT 'Timestamp when the key was created',
  PRIMARY KEY (origin_bank, destination_bank),
  CONSTRAINT fk_hmac_origin
    FOREIGN KEY (origin_bank)
    REFERENCES banks (bank_code)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_hmac_destination
    FOREIGN KEY (destination_bank)
    REFERENCES banks (bank_code)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Shared HMAC keys between banks to sign/validate transactions';


-- ------------------------------------------------------------
-- 7) Table: mfa_codes
--    Stores MFA (multi-factor) codes sent to the user’s email.
--    Each code expires after a certain date/time, and can be marked “used”.
-- ------------------------------------------------------------
CREATE TABLE mfa_codes (
  id                INT             NOT NULL AUTO_INCREMENT
                                 COMMENT 'Internal ID for the MFA entry',
  user_id           INT             NOT NULL 
                                 COMMENT 'FK → users.id (the user to whom this MFA code belongs)',
  mfa_code              VARCHAR(6)      NOT NULL 
                                 COMMENT '6-digit code generated for MFA authentication',
  created_at        DATETIME(6)     NOT NULL DEFAULT (CURRENT_TIMESTAMP(6))
                                 COMMENT 'Timestamp when the code was created (UTC)',
  expires_at        DATETIME(6)     NOT NULL 
                                 COMMENT 'Date/time when this code expires (UTC)',
  used              BOOLEAN         NOT NULL DEFAULT FALSE 
                                 COMMENT 'Marks if the code has already been used (TRUE) or not (FALSE)',
  PRIMARY KEY (id),
  INDEX idx_mfa_user (user_id),
  INDEX idx_mfa_code (mfa_code),
  CONSTRAINT fk_mfa_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'MFA (multi-factor authentication) codes sent by email. Expires at expires_at and can be marked as used.';


-- =====================================================================================
-- END OF SCRIPT: Core tables + extensions for email/password login + MFA functionality
-- =====================================================================================
