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

<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/7452740a-57e2-49c0-8ef6-9016da596f63" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/a0d569e2-d35e-4844-bd7b-4a6862e27164" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/416daf9f-e0f7-42b2-9b47-ae375c8cd5f0" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/50ee9a8a-d120-412c-87fa-0be4bc68cf27" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/a0a71f23-b4d3-4103-a25a-5e62331f1b87" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/e3a588a1-6e3f-49af-9dbe-bc869f247a3a" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/7cced052-4f29-4020-9c61-9a9420b1fc07" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/44a1349e-aae4-4533-8fa9-8dc05674ec00" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/a5f686eb-9db2-476d-b743-ff7ee826d005" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/ba7603e8-b659-4c88-86a3-dc4cbb96c761" />
<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/828892f8-df65-409d-91e6-ceb20ef9ebf1" />




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
