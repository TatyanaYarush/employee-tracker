-- Department --
INSERT INTO departments(department_name)
VALUES 
('Management'),
('Engineering'),
('Human Resources'),
('Finance'),
('Sales'),

-- Role --
INSERT INTO roles(title, salary, department_id)
VALUES
('Engineering Manager', 138000, 1),
("Software Engineer", 110000, 1),
("Web Developer", 90000, 1),
('QA Manager', 115000, 1),
("Software Quality Assurance Specialist", 87000, 1),
("Sales Lead", 100000, 2),
('Sales Rep', 71000, 2),
('HR Manager', 925000, 3),
('HR Rep', 69000, 3),
("Account Manager", 99000, 4),
('Accountant Rep', 67000, 4);

-- Employees --
INSERT INTO employees(first_name, last_name, role_id, manager_id) 
VALUES
('Simon', 'Retpot', 1, null),
('Mia', 'Yarush', 5, 1),
('Eric', 'Gold', 1, null),
('Sean', 'Yarush', 2, 5),
('Roxanne', 'Flenderson', 3, 2),
('Ron', 'Werson', 6, 10),
('Ariel', 'Philbin', 3, 4);
('Sandra', 'Colotina', 5, 8),
('Mary', 'Gratop', 7, 2),
('Bob', 'Lerson', 3, 8),
('Ronnen', 'Bortom', 8, 3),
('Andra', 'Golks', 1, 9);