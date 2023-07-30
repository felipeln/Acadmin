# Project

Acadmin is a gym management system that was developed by me as  my Conclusion Project for my Bachelor's degree in Information Systems.

# Screens
## Login.  
![login](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/cb599c9416ca7202577414e0ea990e53daa0d70f/Login.png)

## Dashboard
![dashboard](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/15e0b78b11435f8bf5ebad27a28049ee3fbddd1f/dashboard.png)

## Register
![Register](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/dashboard_cadastro.png)

## Scheduling
![Scheduling](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/dashboard_agendamento.png)

## Users Management
![management](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/dashboard_gerenciamento.png)

## Finance
### Financial overall
![finance_overall](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/dashboard_financeiro.png)
### Financial table
![finance_table](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/dashboard_financeiro_2.png)

## Reports

### Types of report
![types_of_report](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/dashboard_relatorios_1.png)
### Report options
![report_options](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/dashboard_relatorios_2.png)
### Generated report
![report_photo_1](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/relatorio-1.png)

![report_photo_2](https://gist.githubusercontent.com/felipeln/8d4ad3a2cf863b434c551fdf41b617c7/raw/a95054f9f8bfbc44eb6a90b12350e353d7d717d1/relatorio-2.png)

## Features

- Customer, Employee, and Instructor Registration
- Class Scheduling
- Customer, Employee, and Instructor Management
- Financial Dashboard and Payment System
- Generation of Managerial Reports
  - Financial Report
  - Customers Report
  - Employee Report:


## If you wanna run this project, follow this instructions:

  1. Clone this repository
   ```
    git clone  https://github.com/felipeln/Acadmin

    cd Acadmin
   ```

  2. Setup Environment variable
     1. Create an `.env` file


     2. Inside the `.env` create the `MONGODB_URI` variable and set the credentials to the database.


     3. I recommend use **Atlas mongoDb database** that is online and provides an easy way to have an database for free.

  3. Install Project dependencies
  ```
  npm install
  ```
  
  1. Run `npm start` to run the project.
   
  2. When you run the project an default user will be created, with this credentials:
     1. Email = `admin`
     2. Senha = `admin`


  6. Use the credentials above to login into the system.
   
  7. If you face any error when try to generate an `Relatorio`, follow the instructions bellow:


     1. if you are trying to run on wsl or Linux, checkout this article [link](https://pptr.dev/troubleshooting#running-puppeteer-on-wsl-windows-subsystem-for-linux)


     2. if you are not using Linux or WSL, make sure you have google-chrome installed


     3. If you had to install google-chrome, use this command `npm install puppeteer` and run the project again with `npm start`