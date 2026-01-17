# Onyx Task Management System

A full-stack task management application built with .NET 8, React (Vite), SQL Server, and RabbitMQ.

## 🚀 Quick Start (Docker)

The easiest way to run the application is using Docker. Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Onyx



Run with Docker Compose: docker-compose up --build

Access the application:

Frontend: http://localhost:3000

Backend API: http://localhost:5000

RabbitMQ Dashboard: http://localhost:15672 (Guest/Guest)

🛠 Tech Stack
Backend: .NET 8 API (Entity Framework Core)

Frontend: React (TypeScript) + Vite

Database: Microsoft SQL Server 2022

Message Broker: RabbitMQ

Infrastructure: Docker & Docker Compose

🗄️ Database Setup
If the database doesn't initialize automatically, run the following command to apply migrations:
dotnet ef database update --project Onyx/Onyx.csproj --connection "Server=localhost,1433;Database=OnyxDb;User Id=sa;Password=YourStrong!Password123;TrustServerCertificate=True;"

  
