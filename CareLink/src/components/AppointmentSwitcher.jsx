import React, { useState } from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './ViewAppointments';
import '../styles/AppointmentSwitcher.css';

const AppointmentSwitcher = () => {
  const [view, setView] = useState('form');

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
        {view === 'form' ? <AppointmentForm /> : <AppointmentList />}
      </div>
    </div>
  );
};

export default AppointmentSwitcher;
