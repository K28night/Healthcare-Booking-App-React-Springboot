import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewAppointments.css"; // Create for styling
import toast, { Toaster } from 'react-hot-toast';

import 'react-toastify/dist/ReactToastify.css';

const ViewAppointments = ({sendData}) => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
//   const [editData,setEditData]=useState({})
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


  useEffect(() => {
    axios.get("http://localhost:9081/doctorlist")
  .then((res) => setDoctors(res.data));
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:9081/displayall", {
  params: { sort: "name" } 
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

// const confirmDelete = (id, name) => {
//  toast.custom((t) => (
//   <div
//     className={`custom-toast ${t.visible ? 'visible' : 'hidden'}`}
//   >
//     <p className="font-semibold text-gray-800">Confirm Delete</p>
//     <p className="text-sm text-gray-600 mt-1">
//       Are you sure you want to delete <span className="font-bold">{name}</span>?
//     </p>
//     <div className="mt-4 flex justify-end space-x-3">
//       <button
//         className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//         onClick={() => toast.dismiss(t.id)}
//       >
//         Cancel
//       </button>
//       <button
//         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//         onClick={() => {
//           DeleteBooking(id, name);
//           toast.dismiss(t.id);
//         }}
//       >
//         Delete
//       </button>
//     </div>
//   </div>
// ));

// };


const DeleteBooking = (id, name) => {
  let isUndoClicked = false;

  toast((t) => (
    <div>
      <span>Deleted <b>{name}</b></span>
      <button
        onClick={() => {
          isUndoClicked = true;  // This closure is unique to this delete
          toast.dismiss(t.id);
          toast.success("Undo successful", {
            style: {
              background: '#dcfce7',
              color: '#166534',
            },
          });
        }}
        style={{
          marginLeft: '10px',
          color: '#10b981',
          fontWeight: 'bold',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Undo
      </button>
    </div>
  ), {
    duration: 5000,
    style: {
      background: '#fff',
      color: '#000',
      padding: '10px 15px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px'
    }
  });

  // Capture the unique value of `isUndoClicked` in this timer's closure
  setTimeout(() => {
    if (!isUndoClicked) {
      axios.get(`http://localhost:9081/delete/${id}`)
        .then(() => {
          fetchAppointments();
          toast.success(`Deleted ${name}`, {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
            },
          });
        })
        .catch(e => {
          toast.error(`Failed to delete ${name}: ${e.message}`);
        });
    }
  }, 5000);
};

const EditingData=(item)=>{
    console.log("Data to parent "+item)
sendData(item);
}

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
                <button className="edit-btn" onClick={()=>EditingData(item)}>Edit</button>
                <button className="delete-btn" onClick={()=>DeleteBooking(item.id,item.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<Toaster
  position="top-center"
  reverseOrder={false}
  toastOptions={{
    style: {
      background: '#4ade80',   // ✅ light green background
      color: '#000',           // ✅ black text
      border: '1px solid #16a34a',
    },
    success: {
      iconTheme: {
        primary: '#16a34a',    // green tick color
        secondary: '#f0fdf4',  // background of icon
      },
    },
    error: {
      style: {
        background: '#f87171',  // red background
        color: '#fff',
      },
      iconTheme: {
        primary: '#b91c1c',
        secondary: '#fff',
      },
    },
  }}
/>

    </div>
  );
};

export default ViewAppointments;
