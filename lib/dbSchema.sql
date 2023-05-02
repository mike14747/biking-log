CREATE TABLE users (
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    salt varchar(255) NOT NULL,
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
    user_id int UNSIGNED NOT NULL,
    date date NOT NULL,
    distance decimal(5,2) NOT NULL,
    time_duration time,
    avg_speed decimal(3,1),
    temperature varchar(255),
    wind_speed varchar(255),
    wind_dir varchar(255),
    location varchar(255),
    notes varchar(255),
    PRIMARY KEY (id),
    KEY user_id_idx (user_id)
);

-- --------------------------------------------------------
