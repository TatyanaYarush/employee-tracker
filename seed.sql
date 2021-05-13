-- Department --
INSERT INTO department(department_name)
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
("SQA Specialist", 87000, 1),
("Sales Lead", 100000, 2),
('Sales Rep', 71000, 2),
('HR Manager', 925000, 3),
('HR Rep', 69000, 3),
("Account Manager", 99000, 4),
('Accountant Rep', 67000, 4);

-- Employees --
INSERT INTO employee(first_name, last_name, role_id, manager_id) 
VALUES
('Simon', 'Retpot', 1, null),
('Mia', 'Yarush', 2, 1),
('Eric', 'Gold', 1, null),
('Sean', 'Yarush', 4, 3),
('Roxanne', 'Flenderson', 5, null),
('Ron', 'Werson', 6, 1),
('Ariel', 'Philbin', 7, null),
('Sandra', 'Colotina', 8, 1),
('Mary', 'Gratop', 9, 3),
('Bob', 'Lerson', 10, 5),
('Ronnen', 'Bortom', 11, 3),
('Andra', 'Golks', 9, 5);