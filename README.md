# healthcare-booking-app-react-springboot


This project is a full-stack **Healthcare Booking System** built using **React.js** for the frontend and **Spring Boot** for the backend. It enables users (patients) to book time slots, view appointment status, and manage schedules efficiently. Health centers can also manage available time slots and update appointment statuses.

---

## Features

### Health Center 
- View available time slots
- Book appointments
- View status (Pending / Booked / Confirmed)
- Cancel appointment
- Update appointment status (Confirmed, Pending)
- See filtered lists by doctor or status

---

## 🛠️ Technologies Used

| Frontend       | Backend         | Database   |
|----------------|------------------|-------------|
| React.js       | Spring Boot (Java) | MySQL       |
| Axios (API)    | Spring Data JPA  |      HQL       |
| TailwindCSS / CSS |  |   |

---

## Core Logic

### Appointment Booking
- Check if a time slot is available
- Book if `status = false`
- Once booked: set `status = true` and store patient details

### Conditional Styling
- Appointment cards:
  - **Green** if status is `"Booked"` or `true`
  - **Red** if status is `"Pending"` or `false`

### Status Handling

```js
status: formData.status === 'Pending' ? false : true;
```

### Slot Format

```json
{
  "timeSlot": "11:00-12:00 PM",
  "status": false,
  "name": "Alan"
}
```

### Sample API Calls (Axios)

```js
// Get all appointments
const response = await axios.get("http://localhost:9081/displayall", {
  params: { sort: "name" }
});
```

```js
// Book a slot
await axios.post("http://localhost:9081/bookSlot", {
  name: "Alan",
  mobileNumber: "7518734525",
  timeSlot: "11:00-12:00 PM"
});
```

---

## Folder Structure

```
/appointment-booking-system
├── backend/               ← Spring Boot
│   └── src/main/java/...  ← Controllers, Services, Models
├── frontend/              ← React.js
│   ├── src/components/    ← UI Components
│   └── src/pages/         ← Pages like ViewAppointments, BookSlot
```

---

## How to Run

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## UI Preview

> *(Add screenshots or GIFs here if needed)*
![CareLink Screenshot](./ScreenerShot/screenshot-2025-07-29.png)
---





## 📌 Status Colors Legend

| Status       | Color     |
|--------------|-----------|
| Booked       | 🟩 Green   |
| Pending      | 🟥 Red     |

---

## License

MIT License

---

## Author

Developed by **ALAN P J**

> Feel free to fork, clone, and contribute!
