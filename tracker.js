//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const colors = require("colors");

// Create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_db",
});

// Questions menu 
const startScreen = () => {
  inquirer
    .prompt({
      type: "list",
      name: "option",
      message: "What would you like to do?\n".yellow,
      choices: [
        {
          name:"View all departments".magenta,
          value: "View all departments"
        },
        {
          name:"View all  roles".magenta,
          value: "View all  roles"
        },
        {
          name:"View all employees".magenta,
          value: "View all employees"
        },
        {
          name:"View all employees by manager".magenta,
          value: "View all employees by manager"
        },
        {
          name:"Add department".green,
          value: "Add department"
        },
        {
          name:"Add role".green,
          value: "Add role"
        },
        {
          name:"Add employee".green,
          value: "Add employee"
        },
        {
          name:"Update employee role".blue,
          value: "Update employee role"
        },
        {
          name:"Update employee manager".blue,
          value: "Update employee manager"
        },
        {
          name:"Delete employee".red,
          value: "Delete employee"
        },
        {
          name:"Delete role".red,
          value: "Delete role"
        },
        {
          name:"Delete department".red,
          value: "Delete department"
        },
        {
          name:"Quit".brightYellow,
          value: "Quit"
        },
      ],
    })

    .then((responce) => {
      switch (responce.option) {
        case "View all departments":
          viewAllDept();
          break;

        case "View all  roles":
          viewAllRole();
          break;

        case "View all employees":
          viewAllEmp();
          break;

        case "View all employees by manager":
          viewAllEmpByMngr();
          break;

        case "Add department":
          addDept();
          break;

        case "Add role":
          addRole();
          break;

        case "Add employee":
          addEmp();
          break;

        case "Update employee role":
          updateEmpRole();
          break;

        case "Update employee manager":
          updateEmpMngr();
          break;

        case "Delete employee":
          deleteEmp();
          break;

        case "Delete role":
          deleteRole();
          break;

        case "Delete department":
          deletDept();
          break;

        case "Quit":
          connection.end();
          break;
      }
    });
};
startScreen();

//View all departments
function viewAllDept() {
  connection.query("SELECT * FROM department", function (err, res) {
    console.table(res);
    startScreen();
  });
}

//View all roles
function viewAllRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    console.table(res);
    startScreen();
  });
}

//View all employees
function viewAllEmp() {
  connection.query(
    `SELECT
     e.id,
     e.first_name, 
     e.last_name,
     role.title,
     department.name AS department,
     role.salary, 
     concat(m.first_name, ' ' ,  m.last_name) AS manager
     FROM employee e 
     LEFT JOIN employee m ON e.manager_id = m.id 
     INNER JOIN role ON e.role_id = role.id 
     INNER JOIN department ON role.department_id = department.id
     ORDER BY ID ASC`,

    function (err, res) {
      console.table(res);
      startScreen();
    }
  );
}

//View employees by manager
function viewAllEmpByMngr() {
  connection.query(
    `SELECT
    e.id,
    e.first_name AS "First Name",
    e.last_name AS "Last Name",
    concat(m.first_name, ' ',m.last_name) as Manager
    FROM employee e
    LEFT OUTER JOIN employee m ON e.manager_id = m.id
    ORDER BY Manager; `,

    function (err, res) {
      console.table(res);
      startScreen();
    }
  );
}

// Add departments
function addDept() {
  inquirer
    .prompt({
      type: "input",
      name: "deptName",
      message: "What is the name of the department?",
    })
    .then(function (answer) {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.deptName],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

// Add roles
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "What's the name of the role?",
      },
      {
        type: "input",
        name: "salaryTotal",
        message: "What is the salary for this role?",
      },
      {
        type: "input",
        name: "deptID",
        message: "What is the department id number?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [answer.roleName, answer.salaryTotal, answer.deptID],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

//Add employees
function addEmp() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "eFirstName",
        message: "What's the first name of the employee?",
      },
      {
        type: "input",
        name: "eLastName",
        message: "What's the last name of the employee?",
      },
      {
        type: "input",
        name: "roleID",
        message: "What is the employee's role id number?",
      },
      {
        type: "input",
        name: "managerID",
        message: "What is the manager id number?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [answer.eFirstName, answer.eLastName, answer.roleID, answer.managerID],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}

//Update roles
function updateEmpRole() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    // console.table(res);
    // startScreen();
    // console.log(res);

    let emploeeChoices = res.map(function (emploee) {
      return {
        name: emploee.first_name + " " + emploee.last_name,
        value: emploee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "eUpdate",
          message: "Which employee would you like to update?",
          choices: emploeeChoices,
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT * FROM role",

          function (err, res) {
            if (err) throw err;
            console.table(res);
            startScreen();

            let roleChoices = res.map(function (role) {
              return {
                name: role.title,
                value: role.id,
              };
            });

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "updateRole",
                  message: "What is their new role?",
                  choices: roleChoices,
                },
              ])
              .then(function (roleAnswer) {
                connection.query("Update employee SET role_id=? WHERE id = ?", [
                  roleAnswer.updateRole,
                  answer.eUpdate,
                ]);
              });
          }
        );
      });
  });
}

//Update employee manager
function updateEmpMngr() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    // console.table(res);
    // startScreen();
    // console.log(res);

    let emploeeNames = res.map(function (emploee) {
      return {
        name: emploee.first_name + " " + emploee.last_name,
        value: emploee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "selectEmployee",
          message: "Which employee has a new manager?",
          choices: emploeeNames,
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT * FROM employee WHERE id!= ?",
          [answer.selectEmployee],

          function (err, res) {
            if (err) throw err;
            console.table(res);
            startScreen();

            let managerNames = res.map(function (emp) {
              return {
                name: emp.first_name + " " + emp.last_name,
                value: emp.id,
              };
            });

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "selectedManager",
                  message: "Who is the employee's manager?",
                  choices: managerNames,
                },
              ])
              .then(function (managerAnswer) {
                console.log("managerAnswer", managerAnswer);
                connection.query(
                  "Update employee SET employee.manager_id=?  WHERE id = ?",
                  [managerAnswer.selectedManager, answer.selectEmployee]
                );
              });
          }
        );
      });
  });
}

//Delete employees
function deleteEmp() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    let emploeeChoices = res.map(function (emploee) {
      return {
        name: emploee.first_name + " " + emploee.last_name,
        value: emploee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "IDtoRemove",
          message: "Which employee would you like to delete?",
          choices: emploeeChoices,
        },
      ])
      .then(function (answer) {
        connection.query(
          "DELETE FROM employee where id = ?",
          [answer.IDtoRemove],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            startScreen();
          }
        );
      });
  });
}

//Delete roles
function deleteRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    let roleChoices = res.map(function (role) {
      return {
        name: role.title,
        value: role.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "removeRole",
          message: "'Select a Role to remove?",
          choices: roleChoices,
        },
      ])
      .then(function (answer) {
        connection.query(
          "DELETE FROM role where id = ?",
          [answer.removeRole],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            startScreen();
          }
        );
      });
  });
}

//Delete department
function deletDept() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    let deptChoices = res.map(function (department) {
      return {
        name: department.name,
        value: department.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "removeDept",
          message: "'Select a Department to remove?",
          choices: deptChoices,
        },
      ])
      .then(function (answer) {
        connection.query(
          "DELETE FROM department where id = ?",
          [answer.removeDept],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            startScreen();
          }
        );
      });
  });
}
