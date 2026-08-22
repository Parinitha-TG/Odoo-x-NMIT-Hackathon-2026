Dayflow — Human Resource Management System

Every workday, perfectly aligned.

Dayflow is a Human Resource Management System (HRMS) designed to digitize and streamline core employee and HR operations in one centralized platform.

The system is designed around two primary user roles: Employee and Admin / HR Officer. It brings together employee profiles, attendance, leave management, payroll visibility, and HR approval workflows in a single web application.

1. Problem Statement
   
Organizations often manage employee information and HR operations across disconnected systems, spreadsheets, messages, and manual processes.

This creates challenges such as:

Difficulty tracking daily attendance and working hours

Limited visibility into leave applications and approval status

Difficulty accessing salary and payroll information

Manual maintenance of employee profile information

Time-consuming HR approval workflows

Lack of centralized employee and attendance information

HR teams also need a reliable way to manage employees, review attendance, approve leave requests, and manage payroll-related information.

Dayflow's Solution

Dayflow provides a centralized HR workspace with role-based access, allowing employees and HR administrators to access the features relevant to their responsibilities.

The objective is to make HR operations:

Simple → Centralized → Transparent → Easy to use

2. User Roles

Employee

An Employee can:

Access their personal dashboard

View their profile

Check in and check out

View daily and weekly attendance

Apply for leave

Track leave request status

View salary and payroll information

View company holidays

Receive notifications

Edit permitted personal profile fields

Admin / HR Officer

An Admin / HR Officer can:

Access the HR dashboard

View employee information

View attendance records across employees

Review leave requests

Approve or reject leave requests

Add comments to leave decisions

Manage employee information

View payroll information

Manage salary structures

Access organization-level HR information

3. Functional Requirements

Dayflow is designed around the following core HRMS requirements.

3.1 Authentication & Authorization

The system supports the planned authentication flow:

Sign Up

Employee ID

Email

Password

Role selection: Employee / HR

Password security rules

Email verification

Sign In

Email and password

Incorrect credential error handling

Role-based redirection to the appropriate dashboard

Authentication and authorization should be connected to the project's backend before being considered production-ready.

3.2 Dashboard

Employee Dashboard

The employee dashboard provides quick access to:

Profile

Attendance

Leave Requests

Payroll

Notifications

Logout

It can also display:

Current attendance status

Check-in time

Working hours

Attendance overview

Recent activity

Pending leave requests

Upcoming holidays

Payroll information

Admin / HR Dashboard

The HR dashboard provides organization-level visibility into:

Employee list

Attendance records

Leave approvals

Payroll information

Workforce statistics

HR users can switch between employees and access information according to their permissions.

3.3 Employee Profile Management

Employees can view:

Personal details

Job details

Salary structure

Documents

Profile picture

Employees can edit only permitted fields:

Address

Phone number

Profile picture

Admin / HR users can edit complete employee information.

3.4 Attendance Management

Dayflow supports:

Daily attendance view

Weekly attendance view

Check-in

Check-out

Working-hour tracking

Attendance statuses include:

Present

Absent

Half-day

Leave

Employees can view their own attendance.

Admin / HR users can view attendance records for all employees.

3.5 Leave & Time-Off Management

Employees can submit leave requests using:

Paid Leave

Sick Leave

Unpaid Leave

A request contains:

Leave type

Start date

End date

Remarks

Leave request statuses:

Pending

Approved

Rejected

HR Approval Workflow

Admin / HR users can:

View all leave requests

Approve requests

Reject requests

Add comments

Update the employee's leave status

The final implementation should ensure that approval changes are reflected in the employee's records.

3.6 Payroll / Salary Management

Employee Payroll View

Employees have read-only access to payroll information such as:

Salary details

Net pay

Pay date

Salary breakdown

Payslip information

Admin Payroll Control

Admin / HR users can:

View payroll information for all employees

Update salary structures

Review payroll accuracy

3.7 Notifications & Reports

Dayflow can provide notifications for:

Leave request updates

Payslip availability

HR announcements

Policy updates

The system can also be extended with analytics and reports such as:

Attendance reports

Salary reports

Payslips

Workforce summaries

4. Application Flow

Employee Flow

                ┌─────────────────────┐
                │   Sign Up / Sign In │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Employee Dashboard  │
                └──────────┬──────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   Attendance          Leave             Profile
        │                  │                  │
 Check-in/out       Apply for Leave      View / Edit
 Daily / Weekly     Track Status         Allowed Fields
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                       Payroll
                           │
                           ▼
                     Notifications

Admin / HR Flow

                ┌─────────────────────┐
                │   Sign In as HR     │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   HR Dashboard      │
                └──────────┬──────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   Employees          Attendance          Leave Requests
        │                  │                  │
 View / Manage       View All Records    Approve / Reject
 Employees           & Status            + Comments
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                       Payroll
                           │
                           ▼
                  Salary Management

5. Core Modules

Dashboard

Central overview of employee or HR activities.

Attendance

Daily and weekly attendance tracking with check-in/check-out and attendance status.

Leave

Leave application, tracking, approval, rejection, and comments.

Payroll

Employee salary visibility and HR payroll management.

Profile

Employee information, job details, salary structure, documents, and profile picture.

Notifications

Updates about leave, payroll, policies, and HR announcements.

HR Overview

Organization-level employee, attendance, leave, and payroll visibility.

6. Technology Stack

Frontend

React

Vite

JavaScript / JSX

CSS

Lucide React

Responsive web design

Development Tools

Visual Studio Code

Git

GitHub

Lovable for UI development and prototyping

Backend

The project includes a backend component for implementing server-side functionality.

The backend can provide:

Authentication

Role-based authorization

Employee management

Attendance management

Leave management

Payroll management

Notifications

Data persistence

The frontend and backend should be connected through APIs as the implementation progresses.

7. High-Level Architecture

                    ┌──────────────────────┐
                    │      Employee        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Dayflow Frontend  │
                    │    React + Vite UI   │
                    └──────────┬───────────┘
                               │
                    ┌──────────┼───────────┐
                    │          │           │
                    ▼          ▼           ▼
              Attendance     Leave      Payroll
                    │          │           │
                    └──────────┼───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │   APIs + HR Logic    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Database        │
                    │    HR Information    │
                    └──────────────────────┘

8. Project Structure

A typical project structure is:

Dayflow/
│
├── backend/
│   └── Backend services and server-side code
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── data/
│   │   └── styles/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.*
│
├── .gitignore
└── README.md

The exact structure may evolve as modules are integrated.

9. Running the Project Locally

Frontend

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

If Lucide React is not already installed:

npm install lucide-react

Start the development server:

npm run dev

Open the local Vite URL shown in the terminal, normally:

http://localhost:5173/

Backend

Backend setup depends on the backend implementation and its required environment variables or services. Follow the backend-specific setup instructions in its directory.

10. UI / UX Design

Dayflow follows a modern enterprise HRMS design approach.

Design principles include:

Clean and professional interface

Consistent typography

Clear navigation

Responsive layouts

Accessible controls

Meaningful icons

Clear status indicators

Consistent spacing

Minimal visual clutter

Role-specific navigation

Desktop, tablet, and mobile support

The interface is designed to feel like a real HR management product rather than a collection of unrelated screens.

11. Security Considerations

Because an HRMS handles sensitive employee information, the production implementation should include:

Secure authentication

Role-based authorization

Password hashing

Protected API endpoints

Input validation

Secure session/token handling

HTTPS

Database access controls

Protection of payroll and personal information

Audit logging for important HR actions

Sensitive credentials, API keys, passwords, and secrets must never be committed to GitHub.

12. Development Workflow

The project is developed collaboratively using Git and GitHub.

Recommended workflow:

Pull latest changes
        ↓
Work on assigned branch / feature
        ↓
Make changes
        ↓
Test locally
        ↓
git status
        ↓
git add
        ↓
git commit
        ↓
git push
        ↓
Pull Request / Team Review
        ↓
Merge

Contributors should:

Pull the latest team changes before starting work.

Work only on their assigned feature or branch.

Test changes locally.

Use clear commit messages.

Avoid overwriting another contributor's work.

Follow the team's agreed review and merge process.

13. Current Project Status

The current project focuses on establishing the Dayflow HRMS experience, including:

Employee dashboard

HR overview

Attendance interface

Check-in / check-out interface

Leave management interface

Payroll interface

Employee profile

Notifications

Settings

Responsive navigation and UI

The remaining production functionality, including backend-connected authentication, persistent data, role-based authorization, and complete HR workflows, should be connected and tested as development progresses.

14. Future Enhancements

Potential future improvements include:

Complete backend authentication

Email verification

Database integration

Real-time attendance synchronization

Automated payroll processing

Payslip PDF generation

Email notifications

Advanced HR analytics

Employee search and filtering

Advanced leave policies

Attendance reports

Exportable HR reports

Audit logs

Mobile / PWA support

Organization-level configuration

Automated HR workflows

15. Expected Impact

Dayflow aims to:

Reduce manual HR processes

Centralize employee information

Improve attendance visibility

Simplify leave applications and approvals

Improve payroll transparency

Reduce HR communication overhead

Give HR teams better workforce visibility

Provide employees with a single place to manage their workday information

16. Project Motto

Dayflow — Every workday, perfectly aligned.

Dayflow brings employee and HR operations together into one organized, accessible, and scalable HRMS platform.
