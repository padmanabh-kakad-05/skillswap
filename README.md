# 🚀 SkillSwap – Skill Exchange Platform

SkillSwap is a full-stack web application that enables users to exchange skills with each other through a structured system of requests, session scheduling, and feedback. The platform is designed with real-time capabilities to ensure instant updates for requests, sessions, and notifications.

---

## 📌 Project Overview

SkillSwap allows users to connect and collaborate by sharing knowledge. Users can create profiles, list their skills, explore others’ skills, and initiate skill exchange requests. Once a request is accepted, users can schedule sessions and later provide feedback based on their experience.

The system focuses on simplicity, usability, and real-time interaction to enhance user engagement.

---

## 🧠 Key Features

- 🔄 Send and receive skill exchange requests  
- ✅ Accept or reject requests  
- 📅 Schedule skill exchange sessions  
- 🔔 Real-time notifications for requests and sessions  
- 📊 Dashboard with live statistics  
- ⭐ Feedback and rating system  
- 🔐 Secure authentication and user management  

---

## 🛠️ Tech Stack

### 🔹 Frontend
- Next.js (React Framework)
- JavaScript / TypeScript
- Tailwind CSS
- shadcn/ui components

### 🔹 Backend
- Supabase (Backend-as-a-Service)
- Next.js API routes (if applicable)

### 🔹 Database
- PostgreSQL (via Supabase)

### 🔹 Authentication
- Supabase Auth (JWT-based authentication)

### 🔹 Realtime System
- Supabase Realtime (WebSockets)

---

## 🗂️ Project Structure


app/
dashboard/
explore/
requests/
sessions/
skills/

components/
hooks/
lib/


---

## ⚙️ Setup Instructions

### 1. Clone the repository

git clone https://github.com/yourusername/skillswap.git


### 2. Navigate to the project folder

cd skillswap


### 3. Install dependencies

npm install


### 4. Configure environment variables

Create a file named `.env.local` and add:


NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


### 5. Run the development server

npm run dev


### 6. Open in browser

http://localhost:3000


---

## 🔐 Environment Variables

Make sure the following variables are configured:

- Supabase Project URL  
- Supabase Anonymous Public Key  

---

## 📸 Screenshots

(Add your project screenshots here – dashboard, requests, sessions, etc.)

---

## 🚀 Future Enhancements

- Video call integration for live sessions  
- AI-based skill matching system  
- Payment integration for premium features  
- Mobile application version  

---

## 👨‍💻 Author

**Padmanabh Kakad**  
B.Tech Computer Science & Business Systems  

---

## 📌 Note

This project was developed as part of an academic submission and demonstrates full-stack development using modern technologies with real-time functionality.