-- CreateTable
CREATE TABLE `UserBookmark` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `workId` VARCHAR(191) NOT NULL,
    `status` ENUM('VIEWING', 'ON_HOLD', 'PLANNED', 'COMPLETED', 'DROPPED') NOT NULL DEFAULT 'PLANNED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserBookmark` ADD CONSTRAINT `UserBookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBookmark` ADD CONSTRAINT `UserBookmark_workId_fkey` FOREIGN KEY (`workId`) REFERENCES `UserWork`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
