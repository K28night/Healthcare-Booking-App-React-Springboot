import React, { useState,useEffect } from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './ViewAppointments';
import '../styles/AppointmentSwitcher.css';

const AppointmentSwitcher = () => {
  const [view, setView] = useState('form');
  const [message, setMessage] = useState({});
  useEffect(() => {
  console.log("Updated message:", message);
}, [message]);
const handleEditData = (data) => {
  console.log("Received from child:", data);
  // Set it in state or do anything else
    setMessage(data);

  setView('form')
};

  return (
    <div className="appointment-container">
      <div className="switcher">
         <div className={`switch-bg ${view}`}></div>
        <button
          className={view === 'form' ? 'active' : ''}
          onClick={() => setView('form')}
        >
          Book Appointment
        </button>
        <button
          className={view === 'list' ? 'active' : ''}
          onClick={() => setView('list')}
        >
          View Appointments
        </button>
      </div>

      <div className="content">
        {view === 'form' ? <AppointmentForm onSubmitSuccess={() => setMessage({})} receivedData={message}/> : <AppointmentList sendData={handleEditData} />}
      </div>
    </div>
  );
};

export default AppointmentSwitcher;
