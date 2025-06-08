export type AccountType = "CORRIENTE" | "AHORROS";
export type AccountStatus = "ACTIVO" | "BLOQUEADO" | "CERRADO";
export type TransactionStatus = "PENDING" | "COMPLETED" | "REJECTED";
export type TransactionType = "INTERNA" | "EXTERNA" | "SINPEMOVIL";
export type UserType = "A" | "C";

export interface Account {
  iban: string;             // @db.VarChar(24)
  accountNumber: string;    // @db.VarChar(20)
  accountType: AccountType; // accounts_account_type
  accountHolder: string;    // @db.VarChar(100)
  balance: number;          // @db.Decimal(15,2)
  status: AccountStatus;    // accounts_status
  createdAt: string;        // @db.DateTime(6)
  updatedAt: string;        // @db.DateTime(6)
}

export interface MfaCode {
  id: number;           // INT AUTO_INCREMENT
  userId: string;       // @db.VarChar(20)
  mfaCode: string;      // @db.VarChar(6)
  createdAt: string;    // @db.DateTime(6)
  expiresAt: string;    // @db.DateTime(6)
  used: boolean;        // BOOLEAN
}

export interface Transaction {
  transactionId: string;     // @db.VarChar(36)
  createdAt: string;         // @db.DateTime(6)
  originIban: string | null; // @db.VarChar(24)?
  destinationIban: string | null; // @db.VarChar(24)?
  originPhone: string | null;      // @db.VarChar(15)?
  destinationPhone: string | null; // @db.VarChar(15)?
  transactionType: TransactionType; // transactions_transaction_type
  amount: number;            // @db.Decimal(15,2)
  currency: string;          // @db.VarChar(3)
  status: TransactionStatus; // transactions_status
  description: string | null;// @db.VarChar(255)?
  hmacMd5: string;           // @db.VarChar(32)
  updatedAt: string;         // @db.DateTime(6)
}

export interface User {
  identification: string;      // @db.VarChar(20)
  name: string;                // @db.VarChar(100)
  lastName: string;            // @db.VarChar(100)
  secondLastName: string | null; // @db.VarChar(100)?
  phone: string;               // @db.VarChar(15)
  email: string;               // @db.VarChar(100)
  passwordHash: string;        // @db.VarChar(255)
  userType: UserType;          // CHAR(1)
  accountIban: string;         // @db.VarChar(24)
  createdAt: string;           // @db.DateTime(6)
  updatedAt: string;           // @db.DateTime(6)
}

export type AuditLogsPreviousStatus = "PENDING" | "COMPLETED" | "REJECTED";
export type AuditLogsNewStatus = "PENDING" | "COMPLETED" | "REJECTED";

export interface AuditLog {
  id: number;                   // INT AUTO_INCREMENT
  transactionId: string;        // @db.VarChar(36)
  previousStatus: AuditLogsPreviousStatus | null; // audit_logs_previous_status?
  newStatus: AuditLogsNewStatus;                // audit_logs_new_status
  changedAt: string;            // @db.DateTime(6)
  changedBy: string | null;     // @db.VarChar(100)?
}
