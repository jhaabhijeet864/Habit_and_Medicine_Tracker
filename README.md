# Daily Habit & Medicine Tracker

[cite_start]A simple web application designed to help users remember to take their medications and follow good daily habits, addressing the common problem of forgetfulness in busy routines. [cite: 17, 18] [cite_start]This project is a partial fulfillment of the B.Tech III Semester Mini Project (BCC 351). [cite: 3, 5]

## ✨ Key Features

-   [cite_start]**Add & View Reminders**: Users can add a new medicine or habit with a specific time. [cite: 29]
-   [cite_start]**Data Persistence**: Reminders are saved to a MongoDB database, so they are not lost on page refresh. [cite: 19, 30]
-   [cite_start]**Timed Notifications**: The app provides an alert at the exact time a reminder is due. [cite: 32]
-   [cite_start]**Track Completion**: Users can mark reminders as 'completed' for the day. [cite: 33]

## 🛠️ Technology Stack

-   [cite_start]**Frontend**: HTML, CSS, JavaScript [cite: 43]
-   [cite_start]**Backend**: Node.js, Express.js [cite: 44]
-   [cite_start]**Database**: MongoDB [cite: 45]
-   **Deployment**: Vercel

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js installed
-   Vercel CLI installed (`npm install -g vercel`)
-   A MongoDB Atlas account and connection string

### Installation

1.  Clone the repo
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    ```
2.  Navigate to the project directory
    ```sh
    cd your-repository-name
    ```
3.  Install backend NPM packages
    ```sh
    cd api
    npm install
    ```
4.  Create a `.env` file inside the `api` directory and add your MongoDB connection string:
    ```
    MONGO_URI=your_mongodb_connection_string
    ```
5.  Go back to the root directory and start the development server:
    ```sh
    cd ..
    vercel dev
    ```
    The application will be running at `http://localhost:3000`.

## 👥 Team Members

-   [cite_start]**Abhinav Singh** [https://github.com/abhinav-singh-fr]
-   [cite_start]**Aastha** [https://github.com/Aastha-hub838]
-   [cite_start]**Abhijeet Jha** [https://www.github.com/jhaabhijeet864]
