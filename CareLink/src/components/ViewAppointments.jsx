import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewAppointments.css"; // Create for styling

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    doctor: "",
    status: "",
    sortField: "",
    slot:"",
    sortOrder: ""
  });
const [doctors,setDoctors]=useState([]);
axios.get("http://localhost:9081/doctorlist")
  .then((res) => setDoctors(res.data));

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:9081/displayall", {
  params: { sort: "name" } // ✅ Like jQuery's `data: { sort: "name" }`
});
console.log(response.data);
      setAppointments(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const applyFilters = () => {
    let data = [...appointments];

    
      if (filters.search) {
  const keyword = filters.search.toLowerCase();
  data = data.filter(
    a =>
      (a.name && a.name.toLowerCase().includes(keyword)) ||
      (a.code && a.code.toLowerCase().includes(keyword)) ||
      (a.mobileNumber && a.mobileNumber.includes(filters.search))
  );
}

      console.log("Filters"+filters.search);
      console.log("data"+data);
    if (filters.date) data = data.filter(a => a.date === filters.date);
if (filters.doctor) {
  data = data.filter(a => a.doctor.id === parseInt(filters.doctor));
}

    if (filters.status) data = data.filter(a => a.status ==filters.status);
   // ✅ Correct
if (filters.slot) {
  data = data.filter(
    (a) =>
      a.timeSlot &&
      a.timeSlot.toLowerCase().trim() === filters.slot.toLowerCase().trim()
  );
}

    if (filters.sortField) {
      data.sort((a, b) => {
        let valA = a[filters.sortField];
        let valB = b[filters.sortField];
        if (filters.sortOrder === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
    }

    setFiltered(data);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="appointments-container">
      <h2>View Booking Records</h2>

      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by name, code, or mobile number"
          onChange={handleChange}
        />
        <input type="date" name="date" onChange={handleChange} />

        <select name="doctor" onChange={handleChange}>
          <option value="">All Doctors</option>
  {doctors.map(doc => (
   <option key={doc.id} value={doc.id}>
  {doc.name} 
</option>
 ))}
        </select>

        <select name="status" onChange={handleChange}>
          <option value="">All Status</option>
          <option value="1">Waiting List</option>
          <option value="0">Booked</option>
        </select>
       <select
  name="slot"
  value={filters.slot}
  onChange={(e) =>
    setFilters((prev) => ({ ...prev, slot: e.target.value }))
  }
>
          <option value="">All Time Slots</option>
          <option value="9:00-10:00 AM">9:00-10:00 AM</option>
          <option value="10:00-11:00 AM">10:00-11:00 AM</option>
          <option value="11:00-12:00 PM">11:00-12:00 PM</option>
          <option value="1:00-2:00 PM">1:00-2:00 PM</option>
        </select>

        <select name="sortField" onChange={handleChange}>
         
         
  <option value="">Sort Field</option>
  <option value="name">Name</option>
  <option value="code">Code</option>
  <option value="date">Date</option>
  <option value="status">Status</option>
  <option value="timeSlot">Time Slot</option>
</select>

        <select name="sortOrder" onChange={handleChange}>
          <option value="">Sort By Name</option>
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
        </select>

        
      </div>

      <table className="appointments-table">
        <thead>
          <tr>
            <th>SL. No</th>
            <th>Name</th>
            <th>Code</th>
            <th>Mobile Number</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item, index) => (
            
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.code}</td>
              <td>{item.mobileNumber}</td>
              <td>{item.doctor.name}</td>
              <td>{item.date}</td>
              <td>{item.timeSlot}</td>
              <td>{item.fees}</td>
              <td>
                <span
  className={`status-badge ${
    item.status === true
      ? 'badge-red'
      : item.status === false
      ? 'badge-green'
      : 'badge-gray'
  }`}
>
  {item.status === true
    ? 'Waiting List'
    : item.status === false
    ? 'Booked'
    : 'Unknown'}
</span>


              </td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAppointments;
