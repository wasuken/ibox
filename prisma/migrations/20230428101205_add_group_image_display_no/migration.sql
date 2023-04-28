-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GroupImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "display_no" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imageId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "tagId" INTEGER,
    CONSTRAINT "GroupImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GroupImage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GroupImage_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GroupImage" ("createdAt", "groupId", "id", "imageId", "tagId", "updatedAt") SELECT "createdAt", "groupId", "id", "imageId", "tagId", "updatedAt" FROM "GroupImage";
DROP TABLE "GroupImage";
ALTER TABLE "new_GroupImage" RENAME TO "GroupImage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
