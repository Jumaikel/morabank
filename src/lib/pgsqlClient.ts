import { PrismaClient as PgsqlPrismaClient } from "@/generated/pgsqlClient";

let pgsqlPrisma: PgsqlPrismaClient;

if (process.env.NODE_ENV === "production") {
  pgsqlPrisma = new PgsqlPrismaClient();
} else {
  // En desarrollo guardamos la instancia en global para evitar recrearla en cada reload
  // @ts-ignore
  if (!global.pgsqlPrisma) {
    // @ts-ignore
    global.pgsqlPrisma = new PgsqlPrismaClient();
  }
  // @ts-ignore
  pgsqlPrisma = global.pgsqlPrisma;
}

export default pgsqlPrisma;
