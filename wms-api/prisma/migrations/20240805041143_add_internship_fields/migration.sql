/*
  Warnings:

  - Added the required column `endDate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `timeentryproject` DROP FOREIGN KEY `TimeEntryProject_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `timeentryproject` DROP FOREIGN KEY `TimeEntryProject_projectId_fkey`;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `current_school` VARCHAR(191) NULL,
    ADD COLUMN `internship_end_time` DATETIME(3) NULL,
    ADD COLUMN `internship_position` VARCHAR(191) NULL,
    ADD COLUMN `internship_start_time` DATETIME(3) NULL,
    ADD COLUMN `skills` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `timeentryproject` ADD COLUMN `overtime` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `TimeEntryProject` ADD CONSTRAINT `TimeEntryProject_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeEntryProject` ADD CONSTRAINT `TimeEntryProject_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
