-- Create a guest user if it doesn't exist yet
INSERT INTO "User" (id, name, email, credits, "createdAt", "updatedAt")
SELECT 'guest-user-id', 'Guest Player', 'guest@example.com', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE id = 'guest-user-id'); 