/*
  Warnings:

  - You are about to drop the column `password` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);
INSERT INTO "new_Usuario" ("atualizadoEm", "criadoEm", "email", "id", "nome") SELECT "atualizadoEm", "criadoEm", "email", "id", "nome" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
