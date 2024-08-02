const express = require('express');
const pool  = require('./config/connections');
const inquirer = require('inquirer');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

pool.connect();

function startApp() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee managers',
                'View employees by manager',
                'View employees by department',
                'Delete departments',
                'Delete roles',
                'Delete employees',
                'View the total utilized budget of a department',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Update employee managers':
                updateEmployeeManager();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'Delete departments':
                deleteDepartment();
                break;
            case 'Delete roles':
                deleteRole();
                break;
            case 'Delete employees':
                deleteEmployee();
                break;
            case 'View the total utilized budget of a department':
                viewDepartmentBudget();
                break;
            case 'Exit':
                pool.end();
                break;
        }
    });
}

function viewAllDepartments() {
    const query = 'SELECT id, name FROM department';
    pool.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

function viewAllRoles() {
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON role.department_id = department.id
    `;
    pool.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

function viewAllEmployees() {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
               manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `;
    pool.query(query, (err, res) => {
        if (err) throw err;
        const rows = res.rows.map(row => ({
            ...row,
            manager: row.manager_first_name ? `${row.manager_first_name} ${row.manager_last_name}` : 'None'
        }));
        console.table(rows);
        startApp();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department:'
        }
    ]).then(answer => {
        const query = 'INSERT INTO department (name) VALUES ($1)';
        pool.query(query, [answer.name], (err, res) => {
            if (err) throw err;
            console.log('Department added successfully.');
            startApp();
        });
    });
}

function addRole() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows;
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the role title:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the role salary:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]).then(answer => {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
            pool.query(query, [answer.title, answer.salary, answer.department_id], (err, res) => {
                if (err) throw err;
                console.log('Role added successfully.');
                startApp();
            });
        });
    });
}

function addEmployee() {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        const roles = res.rows;
        pool.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            const employees = res.rows;
            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the employee\'s first name:'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the employee\'s last name:'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the employee\'s role:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the employee\'s manager:',
                    choices: [{ name: 'None', value: null }].concat(employees.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    })))
                }
            ]).then(answer => {
                const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
                pool.query(query, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, res) => {
                    if (err) throw err;
                    console.log('Employee added successfully.');
                    startApp();
                });
            });
        });
    });
}

function updateEmployeeRole() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows;
        pool.query('SELECT * FROM role', (err, res) => {
            if (err) throw err;
            const roles = res.rows;
            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employees.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }))
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the new role:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                }
            ]).then(answer => {
                const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
                pool.query(query, [answer.role_id, answer.employee_id], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully.');
                    startApp();
                });
            });
        });
    });
}

function updateEmployeeManager() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows;
        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to update:',
                choices: employees.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the new manager:',
                choices: [{ name: 'None', value: null }].concat(employees.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                })))
            }
        ]).then(answer => {
            const query = 'UPDATE employee SET manager_id = $1 WHERE id = $2';
            pool.query(query, [answer.manager_id, answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee manager updated successfully.');
                startApp();
            });
        });
    });
}

function viewEmployeesByManager() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const managers = res.rows.filter(employee => employee.manager_id === null);
        inquirer.prompt([
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the manager:',
                choices: managers.map(manager => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id
                }))
            }
        ]).then(answer => {
            const query = `
                SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                WHERE employee.manager_id = $1
            `;
            pool.query(query, [answer.manager_id], (err, res) => {
                if (err) throw err;
                console.table(res.rows);
                startApp();
            });
        });
    });
}

function viewEmployeesByDepartment() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows;
        inquirer.prompt([
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]).then(answer => {
            const query = `
                SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                WHERE department.id = $1
            `;
            pool.query(query, [answer.department_id], (err, res) => {
                if (err) throw err;
                console.table(res.rows);
                startApp();
            });
        });
    });
}

function deleteDepartment() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows;
        inquirer.prompt([
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department to delete:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]).then(answer => {
            const query = 'DELETE FROM department WHERE id = $1';
            pool.query(query, [answer.department_id], (err, res) => {
                if (err) throw err;
                console.log('Department deleted successfully.');
                startApp();
            });
        });
    });
}

function deleteRole() {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        const roles = res.rows;
        inquirer.prompt([
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the role to delete:',
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            }
        ]).then(answer => {
            const query = 'DELETE FROM role WHERE id = $1';
            pool.query(query, [answer.role_id], (err, res) => {
                if (err) throw err;
                console.log('Role deleted successfully.');
                startApp();
            });
        });
    });
}

function deleteEmployee() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows;
        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to delete:',
                choices: employees.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            }
        ]).then(answer => {
            const query = 'DELETE FROM employee WHERE id = $1';
            pool.query(query, [answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee deleted successfully.');
                startApp();
            });
        });
    });
}

function viewDepartmentBudget() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows;
        inquirer.prompt([
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]).then(answer => {
            const query = `
                SELECT SUM(role.salary) AS total_budget
                FROM employee
                JOIN role ON employee.role_id = role.id
                WHERE role.department_id = $1
            `;
            pool.query(query, [answer.department_id], (err, res) => {
                if (err) throw err;
                console.log(`Total utilized budget for department: $${res.rows[0].total_budget}`);
                startApp();
            });
        });
    });
}

startApp()
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
