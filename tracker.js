//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const colors = require("colors");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_db",
});

// // connect to the mysql server and sql database
// connection.connect((err) => {
//     if (err) throw err;
//     console.log(`connected as id ${connection.threadId}`);
//     connection.end();
//   });

const startScreen = () => {
  inquirer
    .prompt({
      type: "list",
      name: "option",
      message: "What would you like to do?\n",
      choices: [
        "View all departments",
        "View all  roles",
        "View all employees",
        "View all employees by manager",
        "Add department",
        "Add role",
        "Add employee",
        "Update employee role",
        "Update employee manager",
        "Delete employee",
        "Delete role",
        "Delete department",
        "Quit",
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

// console.log(startScreen);
//View
function viewAllDept() {
  connection.query("SELECT * FROM department", function (err, res) {
    console.table(res);
    //   console.log(err)
    startScreen();
  });
}

function viewAllRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    console.table(res);
    startScreen();
  });
}

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

///????
function viewAllEmpByMngr() {
  connection.query(
    `SELECT
        e.id,
        e.first_name AS "First Name",
        e.last_name AS "Last Name",
        concat(m.first_name, ' ',m.last_name) as Manager
        FROM employee e
        LEFT OUTER JOIN employee m ON e.manager_id = m.employee_id
        ORDER BY Manager; `,

    function (err, res) {
      console.table(res);
      startScreen();
    }
  );
}

// Add Dept
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

//// Add Role
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

///Add Emp
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

//update Role
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
          "SELECT * FROM employee",

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
                console.log("managerAnswer", managerAnswer)
                // connection.query(
                //   "Update employee SET employee.manager_id=?  WHERE id = ? Like '%Manager%'",
                //   [managerAnswer.selectedManager.value, answer.selectedManager]
                // );
              });
          }
        );
      });
  });
}

//Delete an employee
// function deleteEmp() {
//   connection.query(
//     `SELECT 
//       e.id,
//       e.first_name, 
//       e.last_name,
//       FROM employee`,

//     function (err, res) {
//       let employeeNames = res.map(function (emploee) {
//         return {
//           name: emploee.first_name + " " + emploee.last_name,
//           value: emploee.id,
//         };
//       });

//       inquirer
//         .prompt([
//           {
//             type: "list",
//             name: "chosenEmployee",
//             message: "Which employee would you like to delete?",
//             choices: employeeNames,
//           },
//         ])
//         .then(function (answer) {
//           connection.query(
//             "SELECT * FROM employee",

//             function (err, res) {
//               if (err) throw err;
//               console.table(res);
//               startScreen();

//               let employeeChoices = res.map(function (role) {
//                 return {
//                   name: e.first_name + ' ' +  e.first_name,
//                   value: role.id,
//                 };
//               });

//               inquirer
//                 .prompt([
//                   {
//                     type: "list",
//                     name: "deleteEmp",
//                     message: "What is their new role?",
//                     choices: employeeChoices,
//                   },
//                 ])
//                 .then(function (roleAnswer) {
//                   connection.query(
//                     "DELETE FROM employee WHERE employee.id = ?",
//                     [employeeAnswer.updateRole, answer.eUpdate]
//                   );
//                 });
//             }
//           );
//         });
//     }
//   );
// }




function deleteEmp() {
  connection.query("SELECT * FROM employee")


  inquirer
    .prompt([
      {
        type: "input",
        name: "IDtoRemove",
        message: "Which employee would you like to delete??",
      },

    ])
    .then(function (answer) {
      connection.query(
        "DELETE FROM employees where ?`, { id: answer.IDtoRemove })",
        [answer.IDtoRemove],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          startScreen();
        }
      );
    });
}
