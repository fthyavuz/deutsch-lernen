# Deutsch Lernen - German Learning App

A full-stack web application designed to help users learn German through interactive lessons, flashcards, and quizzes. The app features an AI-powered import system to quickly generate high-quality educational content.

## 🚀 Public Address
The application is reachable at: **[http://your-vps-ip-or-domain.com](http://your-vps-ip-or-domain.com)**

## ✨ Features

- **Interactive Lessons**: Structured learning paths divided into CEFR levels (A1, A2, B1, etc.).
- **AI Content Import**: Generate comprehensive lessons (vocabulary + quizzes) using AI prompts.
- **Flashcards**: Practice vocabulary with a mobile-friendly flashcard interface.
- **Dynamic Quizzes**: Test your knowledge with Multiple Choice, Matching Pairs, and Fill-in-the-blank questions.
- **Progress Tracking**: Registered users can track their completion status and scores for each lesson.
- **Admin Dashboard**: Full control over levels, lessons, vocabularies, and quiz questions.

## 🛠 Tech Stack

- **Frontend**: [Angular](https://angular.dev/) with Vanilla CSS for a premium, custom design.
- **Backend**: [Spring Boot](https://spring.io/projects/spring-boot) (Java) for a robust REST API.
- **Database**: [PostgreSQL](https://www.postgresql.org/) for persistent storage.
- **DevOps**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) for containerization.
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) for automated deployment to VPS.

## 📦 Local Setup

### Prerequisites
- Docker & Docker Compose
- Node.js & Angular CLI (for frontend development)
- Java 21+ & Maven (for backend development)

### Running with Docker
1. Clone the repository:
   ```bash
   git clone https://github.com/fthyavuz/deutsch-lernen.git
   cd deutsch-lernen
   ```
2. Start the application:
   ```bash
   docker-compose up -d
   ```
3. Access the app:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:8080`

## 📄 License
This project is for educational purposes.
