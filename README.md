\# Onyx - Task Management System



Onyx is a modern, full-stack task management application designed to organize daily activities with support for priorities, tagging, and due dates. It utilizes a decoupled client-server architecture with an event-driven messaging layer.



\## 🏗 Architecture



The system follows a standard \*\*N-Tier Architecture\*\* enhanced with \*\*Event-Driven\*\* capabilities:



\* \*\*Frontend (Client-App):\*\* A Single Page Application (SPA) built with \*\*React\*\* and \*\*TypeScript\*\*. It handles the UI/UX and communicates via REST.

\* \*\*Backend (API):\*\* An \*\*ASP.NET Core Web API\*\* that handles requests and publishes events.

\* \*\*Message Broker:\*\* \*\*RabbitMQ\*\* is used for asynchronous communication, decoupling heavy processes from the main API response cycle.

\* \*\*Database:\*\* \*\*SQL Server\*\* accessed via \*\*Entity Framework Core\*\*.



\### Tech Stack

\*\*Frontend:\*\*

\* React 18 + Vite

\* TypeScript

\* Redux Toolkit

\* Material UI v6

\* Vitest (Unit Testing)



\*\*Backend \& Infrastructure:\*\*

\* .NET 8 / Core

\* Entity Framework Core

\* SQL Server

\* \*\*RabbitMQ (Message Broker)\*\*



---



\## 🚀 Getting Started



Follow these instructions to run the project on a local environment.



\### Prerequisites

\* \[Node.js](https://nodejs.org/) (v18 or higher)

\* \[.NET 8 SDK](https://dotnet.microsoft.com/download)

\* SQL Server

\* \*\*Docker Desktop\*\* (For running RabbitMQ)

\* Git



\### 1. Infrastructure Setup (Database \& RabbitMQ)



1\.  \*\*Start RabbitMQ:\*\*

&nbsp;   The easiest way is via Docker. Run this command:

&nbsp;   ```bash

&nbsp;   docker run -d --hostname localhost --name onyx-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management

&nbsp;   ```

&nbsp;   \*Dashboard: `http://localhost:15672` (User: guest, Pass: guest).\*



2\.  \*\*Database:\*\*

&nbsp;   Apply migrations to create the database:

&nbsp;   ```bash

&nbsp;   cd Onyx

&nbsp;   dotnet ef database update

&nbsp;   ```



\### 2. Backend Setup (API)



1\.  \*\*Configure RabbitMQ Connection:\*\*

&nbsp;   Ensure `appsettings.json` has your RabbitMQ config:

&nbsp;   ```json

&nbsp;   "RabbitMQ": {

&nbsp;     "Host": "localhost",

&nbsp;     "Username": "guest",

&nbsp;     "Password": "guest"

&nbsp;   }

&nbsp;   ```

2\.  \*\*Run the API:\*\*

&nbsp;   ```bash

&nbsp;   dotnet run

&nbsp;   ```



\### 3. Frontend Setup (Client)



1\.  Navigate to the client folder:

&nbsp;   ```bash

&nbsp;   cd client-app

&nbsp;   ```

2\.  Install dependencies \& Start:

&nbsp;   ```bash

&nbsp;   npm install

&nbsp;   npm run dev

&nbsp;   ```



---



\## 🧪 Running Tests



The frontend includes a robust unit testing suite using Vitest.



To run the tests:

```bash

cd client-app

npm run test

