# Employee Tracker
 [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

  ## Table of Contents
  * [Description](#description)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Features](#features)
  * [Database Schema](#database-schema)
  * [Licenses](#licenses)
  * [Contributing](#contributing)
  * [Questions](#questions)
  * [Credits](#credits)

  ## Description
  The Employee Management System is a command-line application built with Node.js, Express, and PostgreSQL. It allows users to manage a company's employee database by viewing, adding, updating, and deleting departments, roles, and employees. It also provides functionalities to view employees by manager, view employees by department, and view the total utilized budget of a department.

  ## Installation
  1. **Clone the repository**
    ```bash
    git clone https://github.com/AnamarisOrtiz/employee-tracker.git
    cd employee-management-system
    ```

  2. **Install dependencies**
    ```bash
    npm install
    ```

  3. **Set up PostgreSQL database**
    - Ensure you have PostgreSQL installed and running on your machine.
    - Create a new database in PostgreSQL.
    - Update the database connection details in `server.js` with your PostgreSQL credentials.

  4. **Create database schema**
    - Run the following SQL commands to create the necessary tables in your PostgreSQL database:
    
    

  ## Usage

  1. **Start the application**
    ```bash
    node server.js
    ```

  2. **Follow the prompts**
    - You will be presented with a list of actions to choose from.
    - Select an action and follow the prompts to view, add, update, or delete data in the database.


  ## Features

  - **View all departments**: Displays a table with department names and IDs.
  - **View all roles**: Displays a table with job titles, role IDs, department names, and salaries.
  - **View all employees**: Displays a table with employee IDs, first names, last names, job titles, department names, salaries, and manager names.
  - **Add a department**: Prompts for the department name and adds it to the database.
  - **Add a role**: Prompts for the role title, salary, and department, and adds the role to the database.
  - **Add an employee**: Prompts for the employee's first name, last name, role, and manager, and adds the employee to the database.
  - **Update an employee role**: Prompts to select an employee and their new role, and updates the employee's role in the database.
  - **Update employee managers**: Prompts to select an employee and their new manager, and updates the employee's manager in the database.
  - **View employees by manager**: Prompts to select a manager and displays all employees reporting to that manager.
  - **View employees by department**: Prompts to select a department and displays all employees in that department.
  - **Delete departments**: Prompts to select a department and deletes it from the database.
  - **Delete roles**: Prompts to select a role and deletes it from the database.
  - **Delete employees**: Prompts to select an employee and deletes them from the database.
  - **View the total utilized budget of a department**: Prompts to select a department and displays the combined salaries of all employees in that department.

## Database Schema

- **Department Table**
    ```sql
    CREATE TABLE department (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) UNIQUE NOT NULL
    );
    ```

- **Role Table**
    ```sql
    CREATE TABLE role (
        id SERIAL PRIMARY KEY,
        title VARCHAR(30) UNIQUE NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INTEGER NOT NULL,
        FOREIGN KEY (department_id) REFERENCES department(id)
    );
    ```

- **Employee Table**
    ```sql
    CREATE TABLE employee (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INTEGER NOT NULL,
        manager_id INTEGER,
        FOREIGN KEY (role_id) REFERENCES role(id),
        FOREIGN KEY (manager_id) REFERENCES employee(id)
    );
    ```

  ## Licenses
  This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

  ## Contributing
  GitHub

  ## Questions
  Have questions about this project?  
  GitHub: https://github.com/AnamarisOrtiz  
  Email: anamarisortiz@hotmail.com

  ## Credits
  Anamaris Ortiz









