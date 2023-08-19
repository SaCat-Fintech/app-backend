# SaCat-backend
Backend using Fastify

## Prerequisites

Before you start working with this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (version 18.17.1 or higher)
- [npm](https://www.npmjs.com/get-npm) (Node.js package manager, version 9.6.7 or higher

## Installation

To get started, you'll need to install the following packages as development dependencies:

### json-server

```bash
npm install json-server --save-dev
```

This will install `json-server` locally the project.

### nodemon

```bash
npm install  nodemon --save-dev
```

This will install `nodemon` locally the project.

Once you've installed these dependencies, you're ready to work with the project and run the necessary scripts.

## Running the Project

To run the project, use the following scripts defined in your `package.json`:

### Start Fastify and JSON Server

```bash
npm start
```

This command will simultaneously start both Fastify and JSON Server, allowing you to work with your application and data.

### Start Fastify

```bash
npm run start:fastify
```

This command will start your Fastify server.

### Start JSON Server

```bash
npm run start:json-server
```

This command will start JSON Server, serving data from the `db.json` file on port 3001.

### Development Mode with Nodemon

```bash
npm run dev
```

This command will start your Fastify server using Nodemon, which will automatically restart the server whenever changes are made to the code.

Feel free to use these commands to work with your project efficiently.

