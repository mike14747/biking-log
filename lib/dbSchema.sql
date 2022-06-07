DROP DATABASE IF EXISTS biking_log_db;
CREATE DATABASE biking_log_db;
USE biking_log_db;

set foreign_key_checks=0;

-- --------------------------------------------------------

CREATE TABLE users (
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    role varchar(255) NOT NULL,
    registered_date date NOT NULL,
    resetPasswordToken varchar(255) DEFAULT NULL,
    resetPasswordExpires datetime DEFAULT NULL,
    PRIMARY KEY (id)
);

-- --------------------------------------------------------

CREATE TABLE data (
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id int UNSIGNED NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    date date NOT NULL,
    miles decimal(5,2) NOT NULL,
    time time,
    avg_speed decimal(3,1),
    temp varchar(255),
    wind_speed varchar(255),
    wind_dir varchar(255),
    location varchar(255),
    notes varchar(255),
    PRIMARY KEY (id)
);

-- --------------------------------------------------------

set foreign_key_checks=1;