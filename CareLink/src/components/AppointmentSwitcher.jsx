import React, { useState,useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './ViewAppointments';
import '../styles/AppointmentSwitcher.css';

const AppointmentSwitcher = () => {
  const [view, setView] = useState('form');
    // Refs for animation containers
  const nodeRef = useRef(null);
  const [message, setMessage] = useState({});
//   useEffect(() => {
//   console.log("Updated message:", message);
// }, [message]);

  const handleEditData = (data) => {
    console.log("Received from child:", data);

    setMessage(data);//to send data to parent

    setView('form')//to switch the form
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
     <SwitchTransition mode="out-in">
          <CSSTransition
            key={view}
            timeout={300}
            classNames="fade"
              nodeRef={nodeRef}
            unmountOnExit
          >
      <div className="content" ref={nodeRef}>
        {view === 'form' ? <AppointmentForm 
        onSubmitSuccess={() => setMessage({})} 
        receivedData={message}/> : <AppointmentList 
        sendData={handleEditData} />}
      </div>
      </CSSTransition></SwitchTransition>
    </div>
  );
};

export default AppointmentSwitcher;
