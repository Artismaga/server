-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `verificationTokenKey`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `accountKey`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NULL,
    `scopes` INTEGER NOT NULL DEFAULT -1,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `browser` VARCHAR(191) NULL,
    `platform` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('USER', 'ORGANIZATION', 'BOT', 'SYSTEM') NOT NULL DEFAULT 'USER',
    `moderationStatus` ENUM('UNMODERATED', 'SUSPENDED', 'TERMINATED', 'UNDER_INVESTIGATION') NOT NULL DEFAULT 'UNMODERATED',
    `name` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL DEFAULT '',
    `displayName` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `profilePicture` TEXT NULL,
    `profileBanner` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `firstSeen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedAt` DATETIME(3) NULL,
    `matureProfile` BOOLEAN NOT NULL DEFAULT false,
    `links` JSON NOT NULL,
    `settings` JSON NOT NULL,
    `metadata` JSON NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `userKey`(`name`, `domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMembership` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `membershipId` VARCHAR(191) NOT NULL,
    `transactionId` TEXT NOT NULL,

    UNIQUE INDEX `membershipKey`(`userId`, `membershipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `workId` VARCHAR(191) NOT NULL,
    `workPart` TEXT NULL,
    `transactionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSubscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `priority` INTEGER NOT NULL,
    `permissions` INTEGER NOT NULL DEFAULT 0,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserWork` (
    `id` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL DEFAULT '',
    `workId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publishedAt` DATETIME(3) NULL,
    `lastUpdated` DATETIME(3) NOT NULL,
    `type` ENUM('UNKNOWN', 'ART', 'NOVEL', 'COMIC', 'VIDEO', 'AUDIO') NOT NULL DEFAULT 'UNKNOWN',
    `status` ENUM('UNPUBLISHED', 'RELEASING', 'HIATUS', 'DISCONTINUED', 'COMPLETED') NOT NULL DEFAULT 'UNPUBLISHED',
    `moderationStatus` ENUM('UNMODERATED', 'SUSPENDED', 'TERMINATED', 'UNDER_INVESTIGATION') NOT NULL DEFAULT 'UNMODERATED',
    `mature` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `totalRatings` INTEGER NOT NULL DEFAULT 0,
    `views` INTEGER NOT NULL DEFAULT 0,
    `translations` JSON NOT NULL,
    `metadata` JSON NOT NULL,
    `officialProof` JSON NOT NULL,

    UNIQUE INDEX `userWorkKey`(`domain`, `workId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkView` (
    `id` VARCHAR(191) NOT NULL,
    `workDomain` VARCHAR(191) NOT NULL DEFAULT '',
    `workId` VARCHAR(191) NOT NULL,
    `workPart` VARCHAR(191) NOT NULL,
    `userDomain` VARCHAR(191) NOT NULL DEFAULT '',
    `userName` VARCHAR(191) NOT NULL,
    `firstViewed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `viewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `workViewKey`(`workDomain`, `workId`, `workPart`, `userDomain`, `userName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkAsset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `resource` TEXT NOT NULL,
    `metadata` JSON NOT NULL,

    UNIQUE INDEX `workAssetKey`(`workId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `workReviewKey`(`workId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Language` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Franchise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `domain` VARCHAR(191) NOT NULL DEFAULT '',
    `franchiseId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `allowFanWorks` BOOLEAN NOT NULL DEFAULT true,
    `cover` TEXT NULL,
    `banner` TEXT NULL,
    `translations` JSON NOT NULL,

    UNIQUE INDEX `franchiseKey`(`franchiseId`, `domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnalyticsItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `value` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `analyticsKey`(`key`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FederatedServer` (
    `domain` VARCHAR(191) NOT NULL,
    `discoveredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `publicKey` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`domain`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FFlag` (
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL DEFAULT '',
    `type` ENUM('FLAG', 'INT', 'STRING', 'LIST') NOT NULL DEFAULT 'FLAG',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_authors` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_authors_AB_unique`(`A`, `B`),
    INDEX `_authors_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_publishers` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_publishers_AB_unique`(`A`, `B`),
    INDEX `_publishers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_groups` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_groups_AB_unique`(`A`, `B`),
    INDEX `_groups_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_workGenres` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_workGenres_AB_unique`(`A`, `B`),
    INDEX `_workGenres_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_workLanguages` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_workLanguages_AB_unique`(`A`, `B`),
    INDEX `_workLanguages_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_franchiseGenres` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_franchiseGenres_AB_unique`(`A`, `B`),
    INDEX `_franchiseGenres_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_workFranchises` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_workFranchises_AB_unique`(`A`, `B`),
    INDEX `_workFranchises_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMembership` ADD CONSTRAINT `userMemberships` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMembership` ADD CONSTRAINT `userMembers` FOREIGN KEY (`membershipId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTransaction` ADD CONSTRAINT `userPaidWorks` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTransaction` ADD CONSTRAINT `userTransactions` FOREIGN KEY (`workId`) REFERENCES `UserWork`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSubscription` ADD CONSTRAINT `userSubscriptions` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSubscription` ADD CONSTRAINT `userSubscribers` FOREIGN KEY (`subscriptionId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkAsset` ADD CONSTRAINT `WorkAsset_workId_fkey` FOREIGN KEY (`workId`) REFERENCES `UserWork`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkReview` ADD CONSTRAINT `WorkReview_workId_fkey` FOREIGN KEY (`workId`) REFERENCES `UserWork`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkReview` ADD CONSTRAINT `WorkReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_authors` ADD CONSTRAINT `_authors_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_authors` ADD CONSTRAINT `_authors_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserWork`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_publishers` ADD CONSTRAINT `_publishers_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_publishers` ADD CONSTRAINT `_publishers_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserWork`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_groups` ADD CONSTRAINT `_groups_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_groups` ADD CONSTRAINT `_groups_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_workGenres` ADD CONSTRAINT `_workGenres_A_fkey` FOREIGN KEY (`A`) REFERENCES `Genre`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_workGenres` ADD CONSTRAINT `_workGenres_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserWork`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_workLanguages` ADD CONSTRAINT `_workLanguages_A_fkey` FOREIGN KEY (`A`) REFERENCES `Language`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_workLanguages` ADD CONSTRAINT `_workLanguages_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserWork`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_franchiseGenres` ADD CONSTRAINT `_franchiseGenres_A_fkey` FOREIGN KEY (`A`) REFERENCES `Franchise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_franchiseGenres` ADD CONSTRAINT `_franchiseGenres_B_fkey` FOREIGN KEY (`B`) REFERENCES `Genre`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_workFranchises` ADD CONSTRAINT `_workFranchises_A_fkey` FOREIGN KEY (`A`) REFERENCES `Franchise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_workFranchises` ADD CONSTRAINT `_workFranchises_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserWork`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
