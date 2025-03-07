# Login/Register System with User and Admin Interaction in Reactjs / Firebase

This is a **Login/Register System** project that features user and admin interactions. It includes functionalities such as:

- **User Registration and Login**
- **Admin Login with Two-Way Authentication**
- **OTP for Forgot Password**
- **CAPTCHA Verification for User Login**
- **Admin Control Over User Accounts (Activate/Deactivate)**

## Features

### 1. **User Registration and Login**
- Users can create an account and log in securely.
- User credentials are stored in a MySQL database.
- Passwords are hashed and stored securely using JWT for authentication.

### 2. **Admin Login with Two-Way Authentication**
- Admins can log in with an added layer of security via two-way authentication.
- This feature ensures that only authorized personnel can access the admin panel.

### 3. **OTP Code for Forgot Password**
- Users can request an OTP (One-Time Password) to reset their password.
- OTP is sent to the user's registered email address using **Nodemailer**.

### 4. **CAPTCHA Verification**
- CAPTCHA is integrated into the login page to prevent automated bot attacks and ensure human-only logins.

### 5. **Admin Control Over User Accounts (Activate/Deactivate)**
- Admins have the ability to **activate** or **deactivate** user accounts.
- Deactivated accounts will be unable to log in until reactivated by an admin.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **Email Service**: Nodemailer
- **CAPTCHA**: Google reCAPTCHA

## Installation

### Prerequisites

- Node.js installed
- MySQL installed
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/jubenDv/login-system.git
cd login-system
2. Install Dependencies
bash
Copy
Edit
npm install
3. Set Up MySQL Database
Create a MySQL database and configure your .env file with the database connection details:
env
Copy
Edit
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=your-database-name
4. Start the Server
bash
Copy
Edit
npm start
The server will start on http://localhost:5000. You can access the login and registration features at this address.

How to Use
Register as a User: Go to the registration page and create a new account with your email and password.
Login as a User: Once registered, log in with your credentials.
Forgot Password: If you forget your password, you can request an OTP to reset it.
Admin Login: Admins can log in with their credentials and manage users. The admin login page includes a second layer of authentication for added security.
CAPTCHA Verification: Every login attempt will be verified with CAPTCHA to prevent bots.
Admin User Management: Admins can activate or deactivate user accounts from the admin panel. Deactivated accounts will not be able to log in until reactivated by the admin.
Admin Controls
Activate User Account: Admin can enable a previously deactivated account, allowing the user to log in again.
Deactivate User Account: Admin can disable a user account, preventing them from logging in until the account is reactivated.
Contributing
Feel free to fork the repository, make changes, and submit a pull request. Contributions are welcome!

License
This project is licensed under the MIT License.
