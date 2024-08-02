
INSERT INTO department (name) VALUES 
('Human Resources'),
('Engineering'),
('Marketing'),
('Sales');


INSERT INTO role (title, salary, department_id) VALUES 
('HR Manager', 75000, 1),
('Software Engineer', 90000, 2),
('Marketing Specialist', 60000, 3),
('Sales Representative', 55000, 4),
('HR Assistant', 45000, 1),
('Senior Engineer', 120000, 2),
('Marketing Manager', 85000, 3),
('Sales Manager', 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Jones', 3, NULL),
('Michael', 'Brown', 4, NULL),
('Sarah', 'Davis', 5, 1),
('David', 'Wilson', 6, 2),
('Anna', 'Moore', 7, 3),
('James', 'Taylor', 8, 4),
('Chris', 'Anderson', 2, 2),
('Laura', 'Thomas', 3, 3),
('Robert', 'Jackson', 6, 2),
('Linda', 'White', 1, NULL),
('Paul', 'Harris', 4, 4),
('Nancy', 'Martin', 5, 1),
('Daniel', 'Thompson', 7, 3);
