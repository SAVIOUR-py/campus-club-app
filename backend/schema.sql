-- Create database schema template container if it does not exist already
CREATE DATABASE IF NOT EXISTS campus_crud;
USE campus_crud;

-- Create our target relational single-table layout module
CREATE TABLE IF NOT EXISTS clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    president VARCHAR(120) NOT NULL,
    category VARCHAR(60) NOT NULL,
    member_count INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Populate our sample records to satisfy our Part A guidelines (at least 10 entries)
INSERT INTO clubs (name, president, category, member_count, description) VALUES
('Computer Science Society', 'Saviour Ntendekelo', 'Academic', 45, 'Fostering innovation in software engineering and technical research networks.'),
('University Choir', 'Mwenya Mwamba', 'Music', 60, 'Singing and organizing vocal arrangements for local festival competitions.'),
('Drama & Theater Association', 'Chileshe Banda', 'Arts', 30, 'Staging classic and original theatrical productions on the community stage.'),
('Emerging Tech Research Lab', 'Genesis Phiri', 'Academic', 25, 'Analyzing semantic context configurations across advanced automation frameworks.'),
('Campus Football Club', 'Kelvin Tembo', 'Sports', 22, 'Competitive sports team participating in structural inter-university leagues.'),
('Poetry & Literary Circle', 'Mutale Kangwa', 'Arts', 15, 'Exploring creative writing dynamics, rhyme syntax patterns, and live spoken word.'),
('Agricultural Engineering Club', 'Lwando Zulu', 'Science', 35, 'Hands-on plant nursery management strategies and rural development research.'),
('AI and Prompt Engineering Guild', 'Saviour Ntendekelo', 'Academic', 50, 'Mastering algorithmic execution loops, generative designs, and testing sequences.'),
('Student Entrepreneurship Hub', 'Bupe Nyirenda', 'Business', 40, 'Incubating startup models, business connections, and project framework launches.'),
('Chess Grandmasters Society', 'Mwansa Kapoya', 'Sports', 18, 'Strategic match simulation tracking, game theory modeling, and campus tournaments.');