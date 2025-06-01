export type AccountsState = 'ACTIVE' | 'BLOCKED' | 'CLOSED';
export type TransactionsState = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface Account {
  iban: string;             // VARCHAR(24) (PK)
  bankCode: string;         // VARCHAR(5)  (FK → banks.bankCode)
  accountHolder: string;    // VARCHAR(100)
  balance: number;          // DECIMAL(15,2)
  state: AccountsState;     // ENUM('ACTIVE','BLOCKED','CLOSED')
  createdAt: string;        // DateTime (ISO string)
  updatedAt: string;        // DateTime (ISO string)
}

export interface Bank {
  bankCode: string;        // VARCHAR(5)   (PK)
  name: string;            // VARCHAR(100)
  address: string | null;  // VARCHAR(255) | NULL
  createdAt: string;       // DateTime (ISO string)
  updatedAt: string;       // DateTime (ISO string)
}

export interface HmacKey {
  originBank: string;        // VARCHAR(5)    (PK partial, FK → banks.bankCode)
  destinationBank: string;   // VARCHAR(5)    (PK partial, FK → banks.bankCode)
  secretKey: string;         // VARBINARY(255) → Base64 in JSON
  createdAt: string;         // DateTime (ISO string)
}

export interface MfaCode {
  id: number;           // INT AUTO_INCREMENT (PK)
  userId: string;       // VARCHAR(20) (FK → users.identification)
  mfaCode: string;      // VARCHAR(6)
  createdAt: string;    // DateTime (ISO string)
  expiresAt: string;    // DateTime (ISO string)
  used: boolean;        // BOOLEAN
}

export interface Transaction {
  transactionId: string;    // CHAR(36) UUID (PK)
  createdAt: string;        // DateTime (ISO string)
  originIban: string;       // CHAR(24) (FK → accounts.iban)
  destinationIban: string;  // CHAR(24) (FK → accounts.iban)
  amount: number;           // DECIMAL(15,2)
  currency: string;         // CHAR(3) (e.g. "CRC", "USD", "EUR")
  state: TransactionsState; // ENUM('PENDING','COMPLETED','REJECTED')
  reason: string | null;    // VARCHAR(255) | NULL
  hmacMd5: string;          // CHAR(32)
  updatedAt: string;        // DateTime (ISO string)
}

export interface User {
  identification: string;  // VARCHAR(20) (PK)
  name: string;            // VARCHAR(100)
  lastName: string;        // VARCHAR(100)
  phone: string;           // VARCHAR(15) (unique)
  accountIban: string;     // VARCHAR(24) (FK → accounts.iban)
  email: string;           // VARCHAR(100) (unique)
  passwordHash: string;    // VARCHAR(255)
  createdAt: string;       // DateTime (ISO string)
  updatedAt: string;       // DateTime (ISO string)
}
