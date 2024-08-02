
SELECT id AS department_id, 
name AS department_name
FROM departments;


SELECT roles.id 
AS role_id, roles.title 
AS job_title, roles.salary, departments.name 
AS department_name
FROM roles
JOIN departments ON roles.department_id = departments.id;


SELECT employees.id 
AS employee_id, employees.first_name, employees.last_name, roles.title 
AS job_title, departments.name AS department_name, roles.salary, manager.first_name 
AS manager_first_name, manager.last_name AS manager_last_nameFROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees AS manager ON employees.manager_id = manager.id;


INSERT INTO departments (name)
VALUES ($1); 


INSERT INTO roles (title, salary, department_id)
VALUES ($1, $2, $3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ($1, $2, $3, $4); 


UPDATE employees
SET role_id = $2 
WHERE id = $1; 

ALTER TABLE employee DROP CONSTRAINT employee_role_id_fkey;


ALTER TABLE employee ADD CONSTRAINT employee_role_id_fkey FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE;
