/*
  Warnings:

  - Made the column `usuarioId` on table `Categoria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoriaId` on table `Transacao` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuarioId` on table `Transacao` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "usuarioId" TEXT NOT NULL,
    CONSTRAINT "Categoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Categoria" ("atualizadoEm", "cor", "criadoEm", "descricao", "icone", "id", "titulo", "usuarioId") SELECT "atualizadoEm", "cor", "criadoEm", "descricao", "icone", "id", "titulo", "usuarioId" FROM "Categoria";
DROP TABLE "Categoria";
ALTER TABLE "new_Categoria" RENAME TO "Categoria";
CREATE TABLE "new_Transacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    CONSTRAINT "Transacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transacao" ("atualizadoEm", "categoriaId", "criadoEm", "data", "descricao", "id", "tipo", "usuarioId", "valor") SELECT "atualizadoEm", "categoriaId", "criadoEm", "data", "descricao", "id", "tipo", "usuarioId", "valor" FROM "Transacao";
DROP TABLE "Transacao";
ALTER TABLE "new_Transacao" RENAME TO "Transacao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
