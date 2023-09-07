# ReactJS Form Connected to Notion Database

**Project Overview:**  
This project is a ReactJS-based web application that integrates with the Notion API to create and manage forms. The application allows users to design custom forms and store submitted data in a Notion database.

## Features

- Create and customize forms using a user-friendly interface.
- Connect to a Notion database to store form submissions.
- Implement Google reCAPTCHA for form security.
- Play videos using React Player.
- Display toast notifications for user feedback.

## Dependencies

### Client Folder

- **react:** 18.2.0
- **react-google-recaptcha:** 3.1.0
- **react-player:** 2.12.0
- **react-toastify:** 8.2.0

### Server Folder

- **@notionhq/client:** 2.2.12
- **cors:** 2.8.5
- **dotenv:** 16.3.1
- **express:** 4.18.2
- **nodemon:** 3.0.1

## Getting Started

To run this application locally, follow these steps:

### IMPORTANT!!!

**Follow the instructions on this YouTube video on how to create a Notion account and how to setup the integration and database:**

<u>https://www.youtube.com/watch?v=WbekTHVISh0</u>

1. Clone the repository:

```
git clone <repository-url>
```

2. Install dependencies for both the client and server folders:

```
cd client
npm install
cd ../server
npm install

```

3. Set up environment variables:

- Create a .env file in the server folder and add your Notion API integration token.
- Configure other environment variables as needed.

4. Start the server:

```
cd ../server
npm start

```

5. Start the client:

```
cd ../client
npm start

```

6. Access the application in your browser at http://localhost:3000.

## Usage

1. Design and customize your forms using the client application.
2. Connect the client to a Notion database by providing the integration token and database information.
3. Implement Google reCAPTCHA for form security.
4. Start receiving and managing form submissions in your Notion database.
5. Enjoy toast notifications for user feedback.

## Contributors

- <u>Emmanuel Jason De Lara</u>
