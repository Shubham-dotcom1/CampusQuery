# CampusQuery - Smart Campus Ecosystem

CampusQuery is a comprehensive web application designed to streamline campus life tailored for students, faculty, and administration. It integrates Query Assistant, Notices, Events, and a Marketplace into a single platform.

## Features

1.  **AI Query Assistant**: Powered by Google Gemini, answers student queries contextually.
2.  **Central Notice Hub**: Real-time official notices categorized by department.
3.  **Campus Events Portal**: Interactive calendar and map for campus events.
4.  **Student Marketplace**: Buy and sell items securely within the campus network.
5.  **Admin Dashboard**: Manage content, moderate listings, and view analytics.

## Tech Stack

-   **Frontend**: React (Vite), TailwindCSS, Lucide Icons.
-   **Backend**: Node.js, Express, MongoDB.
-   **AI**: Google Gemini API.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for Gemini API Key)

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
    *(Note: This installs both frontend and backend dependencies if configured, otherwise install server deps in `/server`)*
3.  Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_key
    MONGODB_URI=your_mongodb_url
    JWT_SECRET=your_jwt_secret
    ```
4.  Seed the Database:
    ```bash
    node server/seed.js
    ```
5.  Start the Backend Server:
    ```bash
    node server/index.js
    ```
6.  Start the Frontend (in a new terminal):
    ```bash
    npm run dev
    ```

### Building for Production

```bash
npm run build
```

## Test Credentials

Use these accounts to test different roles:

**Student**
- Email: `student@campus.edu`
- Password: `password123`

**Faculty**
- Email: `faculty@campus.edu`
- Password: `password123`

**Admin**
- Email: `admin@campus.edu`
- Password: `adminpassword`

## Project Structure

-   `src/components`: Reusable UI components.
-   `src/pages`: Route pages.
-   `src/services`: API integrations (Gemini).
-   `server`: Express backend and Mongoose models.

## License

MIT
