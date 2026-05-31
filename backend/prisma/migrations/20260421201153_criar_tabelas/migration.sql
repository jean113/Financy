-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Transacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "usuarioId" TEXT,
    "categoriaId" TEXT,
    CONSTRAINT "Transacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "usuarioId" TEXT,
    CONSTRAINT "Categoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
