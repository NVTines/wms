-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th8 06, 2024 lúc 05:21 AM
-- Phiên bản máy phục vụ: 10.4.24-MariaDB
-- Phiên bản PHP: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cham_cong`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `employee`
--

CREATE TABLE `employee` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('MANAGER','EMPLOYEE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `current_school` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `internship_end_time` datetime(3) DEFAULT NULL,
  `internship_position` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `internship_start_time` datetime(3) DEFAULT NULL,
  `skills` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `employee`
--

INSERT INTO `employee` (`id`, `code`, `email`, `password`, `fullname`, `role`, `current_school`, `internship_end_time`, `internship_position`, `internship_start_time`, `skills`) VALUES
('3456503b-6c54-46f6-8c9a-9f072676f3b0', 'E556662448', 'an.nguyenviet.13.10@gmail.com', '$2a$10$RwpGCMpSysy2ofuCNvPZDe4vv7oqXyVaGEGZfI7jimD1ATFnfmsFK', 'Nguyễn Việt An', 'EMPLOYEE', 'CS3, CS3 premium', '2024-07-29 17:00:00.000', 'Fullstack', '2024-05-11 17:00:00.000', 'Python, Javascript, SQL'),
('3675179f-a7d0-42bb-a6a6-6ee7e4158d39', 'E751351138', 'trinhanthanh@gmail.com', '$2a$10$dviCV6NMVPVTBnda.Nq87uQ9Yyo4Nn8jPBSLtk2gjl21aZUboIcUG', 'Trịnh An Thành', 'EMPLOYEE', 'BC62, Node42', '2024-10-14 17:00:00.000', 'Fullstack', '2024-08-04 17:00:00.000', 'JavaScript, TypeScript, SQL'),
('5c3657f5-1651-48b8-b5c1-831f2405de39', 'E151210983', 'thaian111203@gmail.com', '$2a$10$GtzEwk48VSaVX8wmcHkHaeTdPwC2t4USuJQf5rqChOi1k5pWFo8US', 'Huỳnh Dương Thái An', 'EMPLOYEE', 'Đại học Sài Gòn', '2024-09-02 17:00:00.000', 'Other', '2024-06-02 17:00:00.000', 'Java, Python, C++, PHP'),
('6945da11-7e0b-489c-ba7e-6d6cd71e9059', 'E586196662', 'ngovantin28072002@gmail.com', '$2a$10$9Cc5Jj68RRpSnHT3dmG.8.SiId6wVlTi0SZE848h.uATYUmZWigG6', 'Ngô Văn Tín', 'EMPLOYEE', 'Đại học Sài Gòn', '2024-08-20 17:00:00.000', 'Backend', '2024-05-20 17:00:00.000', 'None'),
('73387fbd-7b07-4469-a10c-3c33044cf840', 'E285143115', 'nthinh.dev@gmail.com', '$2a$10$qumCNrBJTP1LAP6ma5UCh.GG0b6KKNzTAPTKZbe.GrZ9DNfOH.Ice', 'Nguyễn Phúc Thịnh', 'EMPLOYEE', 'Đại học Sài Gòn', '2024-08-20 17:00:00.000', 'Fullstack', '2024-05-20 17:00:00.000', 'Typescript, Javascript, C#, Python, Java, PHP, C/C++'),
('76607bff-77b3-4b45-850f-7932bb7f5819', 'E768421531', 'minhthienlhtst@gmail.com', '$2a$10$zml/06lQJYRNzwpFO6fMXeQHxzwawidcsY55y4LcdihzlVnKKtsDS', 'Trần Minh Thiện', 'EMPLOYEE', 'Đại học Sài Gòn', '2024-08-27 17:00:00.000', 'Backend', '2024-05-27 17:00:00.000', 'C#'),
('79b330f4-c3a4-4a40-8cf7-24a725d0350c', 'E216497526', 'huonggiang7657@gmail.com', '$2a$10$ffcKTKx0xWuWgBhiN4oZnew/2pCLYVLrArhW4C8ioXyHiCHBHw1Hy', 'Nguyễn Ngọc Hương Giang', 'EMPLOYEE', 'Đại học Tôn Đức Thắng', '2024-10-21 17:00:00.000', 'Backend', '2024-07-21 17:00:00.000', '   	 Javascript, Python, Java'),
('a1e516a6-80f5-45f7-9a3f-fdd995c051eb', 'E247480770', 'trungphamvantrung123@gmail.com', '$2a$10$5SavE1tDoRn1QJt11jhiw.yfnEL0F2CnsfnMrJBVYPkhk4cHXed/q', 'Phạm Văn Trung', 'EMPLOYEE', 'BC62, BC java 06', '2024-09-30 17:00:00.000', 'Fullstack', '2024-07-31 17:00:00.000', 'Java, Javaccript'),
('a2380e52-2746-4cf8-ad5d-d135d1076850', 'E840565707', 'nguhuukien03@gmail.com', '$2a$10$1uA7pUc/9Ml3QGUVZ/ZTOe/2u6rfMhGGYYCaIhc..X2t08I/FtD5e', 'Ngũ Hữu Kiên', 'EMPLOYEE', 'Đại học Sài Gòn', '2024-08-20 17:00:00.000', 'Other', '2024-05-20 17:00:00.000', 'Python, C/C++, PHP, Ruby, Java, HTML, CSS, JS,'),
('cbf2c5ac-f17f-41f0-add3-df1ef5daf7f1', 'M00001', 'Joe.Maggio7@yahoo.com', '$2a$10$dCoSGcj2aRvl6lyIWJxUhuprYSh01P3sAA4mAhnawABHHswz9/Gza', 'Kelsi Smitham', 'MANAGER', NULL, NULL, NULL, NULL, NULL),
('da9cbbed-9d46-4319-a605-fac38d0917e6', 'E514913120', 'Dinhphi9c@gmail.com', '$2a$10$YUS0wQ39gskRq4UDO/64Y.oWXfpKdCs1a7ISs0FqlOp2lEIROMjRS', 'Dương Đình Phi', 'EMPLOYEE', 'None', '2024-10-07 17:00:00.000', 'Fullstack', '2024-07-07 17:00:00.000', 'None');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `project`
--

CREATE TABLE `project` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('NOT_STARTED','ONGOING','COMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('LEAVE','PROJECT','OVERTIME') COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeLeave` enum('SICK','ANNUAL','VACATION','CLASS_SCHEDULE','INTERN') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `limit` int(11) NOT NULL,
  `startedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `startDate` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `project`
--

INSERT INTO `project` (`id`, `code`, `name`, `description`, `status`, `type`, `typeLeave`, `limit`, `startedAt`, `updatedAt`, `endDate`, `startDate`) VALUES
('333cb876-88e5-420a-b99e-c6d378e76c19', 'SICK_LEAVE', 'Nghỉ bệnh', 'Nghỉ bệnh', 'ONGOING', 'LEAVE', 'SICK', 12, '2024-08-05 04:12:50.770', '2024-08-05 04:12:50.770', '2030-12-31 00:00:00.000', '2024-08-05 04:12:50.757'),
('3fccfc4b-5655-40e3-982e-072f85c6943b', 'P471651143', 'Cybersoft Intern', NULL, 'ONGOING', 'PROJECT', NULL, 10, '2024-08-05 09:48:18.246', '2024-08-05 09:48:18.246', '2024-08-30 17:00:00.000', '2024-08-04 17:00:00.000'),
('abe207db-8d49-4226-bed9-0bb8e4ecb681', 'VACATION_LEAVE', 'Nghỉ lễ', 'Nghỉ lễ', 'ONGOING', 'LEAVE', 'VACATION', 12, '2024-08-05 04:12:50.770', '2024-08-05 04:12:50.770', '2030-12-31 00:00:00.000', '2024-08-05 04:12:50.757');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `timeentryproject`
--

CREATE TABLE `timeentryproject` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `hours` int(11) NOT NULL,
  `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `overtime` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('33429575-d008-4b44-93ec-de88907d6217', 'cad2c1a7cdba67e8afe425d01c52471af5ec6e3388eebda993ec0b4b2d30288d', '2024-08-05 04:11:42.246', '20240613060438_init', NULL, NULL, '2024-08-05 04:11:41.959', 1),
('758ea432-6956-4de4-90ad-40294e051fc9', '86ba282f5b474703cbd45826d854a5a7497f44f071e78eeb9734ead80ba5f663', '2024-08-05 04:11:43.476', '20240805041143_add_internship_fields', NULL, NULL, '2024-08-05 04:11:43.230', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Employee_code_key` (`code`),
  ADD UNIQUE KEY `Employee_email_key` (`email`);

--
-- Chỉ mục cho bảng `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Project_code_key` (`code`);

--
-- Chỉ mục cho bảng `timeentryproject`
--
ALTER TABLE `timeentryproject`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TimeEntryProject_employeeId_fkey` (`employeeId`),
  ADD KEY `TimeEntryProject_projectId_fkey` (`projectId`);

--
-- Chỉ mục cho bảng `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `timeentryproject`
--
ALTER TABLE `timeentryproject`
  ADD CONSTRAINT `TimeEntryProject_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `TimeEntryProject_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
