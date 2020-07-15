DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT default 0,
  CONSTRAINT fk_department
    FOREIGN KEY (department_id) 
        REFERENCES department(id)
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  CONSTRAINT fk_roles
    FOREIGN KEY (role_id) 
        REFERENCES role(id)
  manager_id INT 0,
  CONSTRAINT fk_manager
    FOREIGN KEY (manager_id) 
        REFERENCES employee(id)
  PRIMARY KEY (id)
);