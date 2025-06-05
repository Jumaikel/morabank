export type AccountType = "CORRIENTE" | "AHORROS";
export type AccountStatus = "ACTIVE" | "BLOCKED" | "CLOSED";
export type TransactionStatus = "PENDING" | "COMPLETED" | "REJECTED";
export type UserType = "A" | "C";

export interface Account {
  iban: string;             // VARCHAR(24) (PK)
  accountNumber: string;    // VARCHAR(20) (unique)
  accountType: AccountType; // ENUM('CORRIENTE','AHORROS')
  accountHolder: string;    // VARCHAR(100)
  balance: number;          // DECIMAL(15,2)
  status: AccountStatus;    // ENUM('ACTIVE','BLOCKED','CLOSED')
  createdAt: string;        // DateTime (ISO string)
  updatedAt: string;        // DateTime (ISO string)
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
  originIban: string;       // VARCHAR(24) (FK → accounts.iban)
  destinationIban: string;  // VARCHAR(24) (FK → accounts.iban)
  amount: number;           // DECIMAL(15,2)
  currency: string;         // VARCHAR(3) (e.g. "CRC", "USD", "EUR")
  status: TransactionStatus;// ENUM('PENDING','COMPLETED','REJECTED')
  reason: string | null;    // VARCHAR(255) | NULL
  hmacMd5: string;          // VARCHAR(32)
  updatedAt: string;        // DateTime (ISO string)
}

export interface User {
  identification: string;     // VARCHAR(20) (PK)
  name: string;               // VARCHAR(100)
  lastName: string;           // VARCHAR(100)
  secondLastName: string | null; // VARCHAR(100) | NULL
  phone: string;              // VARCHAR(15) (unique)
  accountIban: string;        // VARCHAR(24) (FK → accounts.iban)
  email: string;              // VARCHAR(100) (unique)
  userType: UserType;         // CHAR(1) ('A' or 'C')
  createdAt: string;          // DateTime (ISO string)
  updatedAt: string;          // DateTime (ISO string)
}
