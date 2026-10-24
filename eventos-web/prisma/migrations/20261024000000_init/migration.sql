CREATE TABLE "User" ("id" TEXT PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "password" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'USER');
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "Event" ("id" TEXT PRIMARY KEY, "title" TEXT NOT NULL, "description" TEXT NOT NULL, "date" TEXT NOT NULL, "time" TEXT NOT NULL, "location" TEXT NOT NULL, "image" TEXT NOT NULL);
CREATE TABLE "Registration" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL, "eventId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE);
CREATE UNIQUE INDEX "Registration_userId_eventId_key" ON "Registration"("userId", "eventId");
