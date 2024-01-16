CREATE DATABASE enroll;

CREATE TABLE programs (
    program_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    program_type VARCHAR(50) NOT NULL,
    registrations_status VARCHAR(10) CHECK (registrations_status IN ('Open', 'closed')) NOT NULL,
    description TEXT,
    placement_assurance BOOLEAN NOT NULL,
    image_url VARCHAR(500),
    university_name VARCHAR(255) NOT NULL,
    learning_hours INTEGER NOT NULL,
    duration VARCHAR(50) NOT NULL,
    certificate_diploma VARCHAR(100) NOT NULL,
    eligibility_criteria TEXT
);
CREATE TABLE programsdraft (
    program_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    program_type VARCHAR(50) NOT NULL,
    registrations_status VARCHAR(10) CHECK (registrations_status IN ('open', 'closed')) NOT NULL,
    description TEXT,
    placement_assurance BOOLEAN NOT NULL,
    image_url VARCHAR(500),
    university_name VARCHAR(255) NOT NULL,
    learning_hours INTEGER NOT NULL,
    duration VARCHAR(50) NOT NULL,
    certificate_diploma VARCHAR(100) NOT NULL,
    eligibility_criteria TEXT
);

CREATE TABLE faculty (
    faculty_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    linkedin_url VARCHAR(500)
);

CREATE TABLE programFaculty (
    program_id INTEGER REFERENCES Programs(program_id),
    faculty_id INTEGER REFERENCES Faculty(faculty_id),
    PRIMARY KEY (program_id, faculty_id)
);
