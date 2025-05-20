-- Add password field to User table
ALTER TABLE "User" ADD COLUMN "password" TEXT DEFAULT 'defaultpassword' NOT NULL;

-- Update existing users with a default password hash (SHA-256 hash of "password123")
UPDATE "User" SET "password" = '8be3c943b1609fffbfc51aad666d0a04adf83c9d54e59115cff16fba2240f399' WHERE "password" = 'defaultpassword';

-- Make sure the guest user has a password too
UPDATE "User" SET "password" = '8be3c943b1609fffbfc51aad666d0a04adf83c9d54e59115cff16fba2240f399' WHERE "id" = 'guest-user-id'; 