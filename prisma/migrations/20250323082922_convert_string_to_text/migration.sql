-- CreateTable
CREATE TABLE `plan` (
    `planId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `confident` INTEGER NOT NULL,

    PRIMARY KEY (`planId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `uncertainty` (
    `uncertaintyId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT NULL,
    `confidence` INTEGER NOT NULL,
    `actionsToResolve` TEXT NULL,
    `actionsResult` TEXT NULL,
    `planId` INTEGER NOT NULL,

    PRIMARY KEY (`uncertaintyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `uncertainty` ADD CONSTRAINT `uncertainty_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plan`(`planId`) ON DELETE RESTRICT ON UPDATE CASCADE;
