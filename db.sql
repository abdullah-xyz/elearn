drop table `orders`;
drop table `topics`;
drop table `units`;
drop table `blocks`;
drop table `courses`;
drop table `studentProfiles`;
drop table `contacts`;
drop table `teacherProfiles`;
drop table `adminProfiles`;
drop table `teacherCreationRequests`;
drop table `users`;

CREATE TABLE `users` (
    `id` VARCHAR(6) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `type` ENUM('student', 'teacher', 'admin') NOT NULL,
    `isActive` TINYINT(1) NOT NULL DEFAULT 1,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB;

CREATE TABLE `studentProfiles` (
    `id` VARCHAR(6) NOT NULL,
    `dob` DATE NOT NULL,
    `fatherName` VARCHAR(255) NOT NULL,
    `class` VARCHAR(255) NOT NULL,
    `house` VARCHAR(255) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `pincode` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `institute` VARCHAR(255),
    `phone` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `teacherProfiles` (
    `id` VARCHAR(6) NOT NULL,
    `qualification` VARCHAR(255) NOT NULL,
    `designation` VARCHAR(255) NOT NULL,
    `institute` VARCHAR(255) NOT NULL,
    `department` VARCHAR(255) NOT NULL,
    `coursesAllowed` INT NOT NULL,
    `pincode` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `profile` TEXT,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `teacherCreationRequests` (
    `id` VARCHAR(6) NOT NULL,
    `qualification` VARCHAR(255) NOT NULL,
    `designation` VARCHAR(255) NOT NULL,
    `institute` VARCHAR(255) NOT NULL,
    `department` VARCHAR(255) NOT NULL,
    `pincode` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `profile` TEXT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `isReviewed` TINYINT(1) NOT NULL DEFAULT 0,
    `isAccepted` TINYINT(1) NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB;

CREATE TABLE `contacts` (
    `id` VARCHAR(11) NOT NULL,
    `user` VARCHAR(6) NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `contact` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`user`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `adminProfiles` (
    `id` VARCHAR(6) NOT NULL,
    `employeeId` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `courses` (
    `id` VARCHAR(6) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `registrationFees` INT NOT NULL,
    `stripeRFees` VARCHAR(255) NOT NULL,
    `certification` TINYINT(1) NOT NULL,
    `certificateFees` INT,
    `stripeCFees` VARCHAR(255),
    `level` VARCHAR(255) NOT NULL,
    `credit` INT NOT NULL,
    `duration` INT NOT NULL,
    `instructor` VARCHAR(6) NOT NULL,
    `instructorName` VARCHAR(255) NOT NULL,
    `isApproved` TINYINT(1) NOT NULL DEFAULT 0,
    `isReviewed` TINYINT(1) NOT NULL DEFAULT 0,
    `publish` TINYINT(1) NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`instructor`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `blocks` (
    `id` VARCHAR(11) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `course` VARCHAR(6),
    `ordering` INT NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`course`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `units` (
    `id` VARCHAR(11) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `lecture` VARCHAR(255),
    `block` VARCHAR(11) NOT NULL,
    `text` TEXT,
    `ordering` INT NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`block`) REFERENCES `blocks`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `topics` (
    `id` VARCHAR(11) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `unit` VARCHAR(11) NOT NULL,
    `ordering` INT NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`unit`) REFERENCES `units`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `orders` (
    `id` VARCHAR(11) NOT NULL,
    `course` VARCHAR(6) NOT NULL,
    `student` VARCHAR(6) NOT NULL,
    `certificate` TINYINT(1) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`course`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`student`) REFERENCES `studentProfiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
