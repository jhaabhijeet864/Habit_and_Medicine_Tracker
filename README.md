# Daily Habit & Medicine Tracker

A simple web application designed to help users remember to take their medications and follow good daily habits, addressing the common problem of forgetfulness in busy routines.

## ✨ Key Features

- **Add & View Reminders**: Users can add a new medicine or habit with a specific time.
- **Data Persistence**: Reminders are saved to a MongoDB database, so they are not lost on page refresh.
- **Timed Notifications**: The app provides an alert at the exact time a reminder is due.
- **Track Completion**: Users can mark reminders as 'completed' for the day.

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js installed
- Vercel CLI installed (`npm install -g vercel`)
- A MongoDB Atlas account and connection string

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your-username/your-repository-name.git
   ```
2. Navigate to the project directory
   ```sh
   cd your-repository-name
   ```
3. Install backend NPM packages
   ```sh
   cd api
   npm install
   ```
4. Create a `.env` file inside the `api` directory and add your MongoDB connection string:
   ```
   MONGO_URI=your_mongodb_connection_string
   ```
5. Go back to the root directory and start the development server:
   ```sh
   cd ..
   vercel dev
   ```
   The application will be running at `http://localhost:3000`.

## 👥 Team Members

- [Abhinav Singh](https://github.com/abhinav-singh-fr)
- [Abhijeet Jha](https://github.com/jhaabhijeet864)
- [Aastha](https://github.com/Aastha-hub838)

## 🌐 Backend Structure

The backend is structured as follows:

- **server.js**: Backend entry point from master
- **package.json**: Combined dependencies
- **.gitignore**: Combined ignore rules
- **.env.example**: From master - environment variables template
- **README.md**: Combined documentation

- **public/**: Create this folder - move frontend files here

  - **index.html**: Your landing page
  - **assets/**
    - **css/**
    - **js/**
    - **images/**
  - **pages/**
    - **auth/**
      - **login.html**
      - **signup.html**

- **src/**: Backend code from master

  - **routes/**
  - **models/**
  - **controllers/**
  - **middleware/**

- **config/**: Backend configuration from master

  - **database.js**

- **node_modules/**: Auto-generated
