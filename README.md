"🏥Prescripto

#Doctor Appointment Booking Web Application

Prescripto is a production-grade healthcare orchestration platform designed to streamline the connection between patients and medical professionals. This web application allows patients to book doctor appointments online through a seamless, real-time interface. It features a high-performance frontend for browsing specialized doctors, selecting verified time slots, and processing secure payments.

The system includes a robust Admin Dashboard that provides centralized control over clinical schedules, appointment tracking, and patient management. By integrating a secure payment gateway and a multi-role authentication system, Prescripto ensures a reliable and professional experience for all stakeholders in the healthcare ecosystem.

🛰️ Live Ecosystem

Patient Hub: https://prescriipto.netlify.app

Admin Command Center: https://prescriptionadmin.netlify.app

#Key Features

Patient Booking System: An intuitive interface where patients can filter doctors by specialty, view comprehensive profiles, and book available 30-minute appointment slots.

Admin Dashboard: A powerful management suite for administrators to onboard new doctors, monitor system-wide appointments, and update booking statuses in real-time.

Doctor Dashboard: A specialized view for medical professionals to track their scheduled consultations, manage their availability, and view total earnings.

Payment Gateway Integration: Secure transaction processing using Stripe (Test Mode) to facilitate instant appointment confirmations.

User Authentication: Multi-layered security using JWT and Bcrypt to provide distinct access levels for Patients, Doctors, and Administrators.

Cloud Media Management: Integration with Cloudinary for optimized hosting and delivery of high-resolution doctor profile imagery.

#Technologies

Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB Atlas (Cloud)

Payment Gateway: Stripe (Test Mode)

Authentication: JSON Web Tokens (JWT)

Image Hosting: Cloudinary CDN

#Engineering Impact

Deployment Architecture: Successfully deployed as a monorepo across Netlify (Frontend/Admin) and Render (Backend), overcoming complex CORS and environment synchronization challenges.

Scalability: Implemented an atomic slot-booking logic that prevents race conditions and "double-booking" errors during high-traffic periods.

Persistence: Configured custom redirect rules to handle the React Router lifecycle on static hosting, ensuring zero "404 Not Found" errors on page refresh.
", this is my broken readme
