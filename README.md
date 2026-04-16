# Hotel Booking Management System

This is a modern, full-stack hotel booking application that I built to manage room reservations for both guests and administrators. 

**Author:** Turab Manzoor

---

## Overview

The goal of this project was to build a complete token-based booking system from the ground up, separating the backend (.NET 9 Web API) from the frontend (Angular 21). It includes secure role-based access, letting admins manage the hotel's property listings while allowing regular users to search, filter, and easily book their stays.

## Tech Stack

### Frontend
* **Framework:** Angular 21 (Standalone Components)
* **Styling:** Custom responsive UI to keep things looking modern and clean.
* **Architecture:** Component-driven, using RxJS and Services for state and data management.

### Backend
* **Framework:** .NET 9 (Web API)
* **Architecture:** Clean Architecture.
* **Database:** Microsoft SQL Server (`localhost\SQLEXPRESS`).
* **ORM:** Entity Framework Core.
* **Authentication:** JWT (JSON Web Tokens) to handle sessions securely.

## Key Features

**Guest Experience:**
* **Browse Properties:** Users can easily search and browse through available hotels and rooms.
* **Token-Based Booking:** A secure booking flow that uses tokens instead of relying on a third-party payment gateway.
* **Booking History:** Users can track their past and upcoming reservations.
* **Guarded Navigation:** Protected routes so user information stays private.
* **Localized Currency:** Pricing is displayed in Indian Rupees (₹).

**Admin Controls:**
* **Hotel Management:** Full ability to add, update, or remove hotel listings.
* **Room Inventory:** Manage room types, set pricing, and control availability.
* **Dashboard:** A central hub to oversee system metrics and active bookings.

## Prerequisites

If you want to run this locally, you'll need a few things installed:

* [Node.js](https://nodejs.org/) (I recommend v18 or newer)
* [Angular CLI](https://angular.dev/tools/cli) (v21)
* [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express works perfectly)
* Your favorite IDE (like Visual Studio 2022, JetBrains Rider, or VS Code)

## Getting Started

### 1. Database Setup
Make sure your local SQL Server (`localhost\SQLEXPRESS`) is running. The Entity Framework Core migrations will automatically set up the tables for you when the app starts.

### 2. Backend Setup

1. Open your terminal and head over to the backend folder:
   ```bash
   cd backend/HotelBooking.API
   ```
2. Install the necessary packages:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
   *The API will start locally. You can check `launchSettings.json` for the exact port, and Swagger will be available to help you test the endpoints.*

### 3. Frontend Setup

1. Open a new terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the npm dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   *The app will automatically open in your browser at `http://localhost:4200/`.*

## Project Structure

```text
├── backend/                       
│   ├── HotelBooking.API/
│   │   ├── Controllers/           # API Endpoints
│   │   ├── Models/                # Database entities
│   │   ├── Services/              # Core business logic
│   │   ├── Program.cs             # App configuration
│   │   └── appsettings.json       # Connection strings and settings
│
└── frontend/                      
    └── src/
        ├── app/
        │   ├── core/              # Guards, Interceptors, Models
        │   ├── features/          # Auth, Admin and User components
        │   ├── shared/            # Reusable UI bits
        │   └── app.routes.ts      # Routing configuration
        ├── assets/
        └── styles.css             # Main stylesheet
```

## Implementation Details

* **Security:** We use JWT authentication. Interceptors automatically attach `Bearer` tokens to any outgoing HTTP requests.
* **Routing:** Angular's functional Route Guards ensure that specific areas (like the admin dashboard or user profiles) stay protected from unauthorized access.
* **Separation of Concerns:** The backend strictly separates routing (controllers) from the actual business rules (services), making the codebase easier to test and scale.

---
*Created by Turab Manzoor*
