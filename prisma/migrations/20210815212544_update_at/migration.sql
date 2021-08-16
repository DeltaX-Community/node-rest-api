-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "createAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_groups" ("createAt", "description", "id", "isActive", "name", "updatedAt") SELECT "createAt", "description", "id", "isActive", "name", "updatedAt" FROM "groups";
DROP TABLE "groups";
ALTER TABLE "new_groups" RENAME TO "groups";
CREATE UNIQUE INDEX "groups.name_unique" ON "groups"("name");
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "createAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_users" ("createAt", "email", "fullName", "id", "isActive", "passwordHash", "updatedAt", "username") SELECT "createAt", "email", "fullName", "id", "isActive", "passwordHash", "updatedAt", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users.username_unique" ON "users"("username");
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");
CREATE TABLE "new_permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "createAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_permissions" ("createAt", "description", "id", "isActive", "name", "updatedAt") SELECT "createAt", "description", "id", "isActive", "name", "updatedAt" FROM "permissions";
DROP TABLE "permissions";
ALTER TABLE "new_permissions" RENAME TO "permissions";
CREATE UNIQUE INDEX "permissions.name_unique" ON "permissions"("name");
CREATE TABLE "new_photos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "createAt" DATETIME NOT NULL DEFAULT (datetime('now')),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_photos" ("createAt", "id", "isActive", "url", "userId") SELECT "createAt", "id", "isActive", "url", "userId" FROM "photos";
DROP TABLE "photos";
ALTER TABLE "new_photos" RENAME TO "photos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
