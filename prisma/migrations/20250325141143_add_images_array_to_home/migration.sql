-- Add your schema changes first
ALTER TABLE "Home" ADD COLUMN "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Then add the data migration
UPDATE "Home" 
SET "images" = ARRAY["photo"]
WHERE "photo" IS NOT NULL;