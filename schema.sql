-- Use the target database
USE sentiment;

-- Create the exports table
CREATE TABLE IF NOT EXISTS exports (
    id INT AUTO_INCREMENT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Create the records table
CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT NOT NULL,
    sentiment VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    export_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (export_id) REFERENCES exports(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

ALTER TABLE exports ADD COLUMN status ENUM('pending', 'processing', 'completed') DEFAULT 'pending';
