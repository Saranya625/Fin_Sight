# Fin-Sight: Personal Finance Dashboard

Fin-Sight is a comprehensive personal finance management application designed to help users track their income and expenses, visualize their financial data, and generate insightful reports. It features a robust backend built with Node.js and Express.js, a responsive frontend developed with React, and uses MongoDB for data storage.

## Features

-   **User Authentication:** Secure registration and login for individual users.
-   **Transaction Management:** Add, view, edit, and delete income and expense transactions.
-   **Dashboard Overview:** A personalized dashboard displaying key financial metrics and summaries.
-   **Financial Reporting:** Generate detailed reports in various formats (CSV, PDF) and preview data.
-   **Email Reports:** Option to send reports directly to your email.
-   **Data Visualization:** Charts and graphs to visualize spending patterns and income trends.
-   **Responsive UI:** A clean and intuitive user interface built with React.

## Technologies Used

### Backend

-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web application framework for Node.js.
-   **MongoDB:** NoSQL database for storing financial data.
-   **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
-   **json2csv:** For generating CSV reports.
-   **PDFKit:** For generating PDF reports.
-   **Nodemailer:** For sending email reports.
-   **bcryptjs:** For password hashing.
-   **jsonwebtoken:** For user authentication (JWT).
-   **cors:** For enabling Cross-Origin Resource Sharing.
-   **dotenv:** For managing environment variables.

### Frontend

-   **React:** JavaScript library for building user interfaces.
-   **Vite:** Fast build tool for modern web projects.
-   **Lucide React:** Icon library for React.
-   **React Router DOM:** For navigation within the application.
-   **Axios (or Fetch API):** For making API requests to the backend.
-   **CSS:** For styling the application.

## Setup and Installation

Follow these steps to set up and run the Fin-Sight project locally.

### Prerequisites

-   Node.js (v14 or higher)
-   npm (Node Package Manager)
-   MongoDB instance (local or cloud-based like MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/Saranya625/Fin_Sight.git
cd Fin_Sight
```

### 2. Backend Setup

Navigate to the `project/finance-backend` directory:

```bash
cd project/finance-backend
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file in the `project/finance-backend` directory and add your environment variables. Replace the placeholder values with your actual MongoDB connection string and email credentials:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

**Note:** For `EMAIL_USER` and `EMAIL_PASS`, if you are using Gmail, you might need to set up an App Password. Refer to Google's documentation on how to generate an App Password.

### 3. Frontend Setup

Navigate to the `project/react-dashboard` directory:

```bash
cd ../react-dashboard
```

Install frontend dependencies:

```bash
npm install
```

## Running the Application

### 1. Start the Backend Server

From the `project/finance-backend` directory, run:

```bash
nodemon server.js # or node server.js if nodemon is not installed
```

The backend server will typically run on `http://localhost:5000`.

### 2. Start the Frontend Development Server

From the `project/react-dashboard` directory, run:

```bash
npm run dev
```

The frontend application will typically open in your browser at `http://localhost:5173` (or a similar port).

## Project Structure

```
Fin_Sight/
├── project/
│   ├── finance-backend/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── .env
│   │   ├── package.json
│   │   └── server.js
│   └── react-dashboard/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   └── services/
│       ├── package.json
│       └── vite.config.js
└── README.md
```

<<<<<<< HEAD
=======
## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.
>>>>>>> 1d9455b (Your meaningful commit message here)
