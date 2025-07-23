import React, { useState, useEffect } from 'react';
import '../styles/AlternativeSlots.css';

const AlternativeSlots = ({ slots, onSlotSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    console.log('Received alternative slots:', slots);
  }, [slots]);

  return (
    <div className="overlay">
        
      <div className="alternative-container">
        <div className="header">
            <h3>{slots[0].doctor} Alternative Slots</h3>
            {/* <button className="close-btn" onClick={onClose}>×</button> */}
            <button onClick={() => onSlotSelect(null)}>x</button>
        </div>
        <div className="alt-slot-list">
          {slots.map((slot, index) => (
            <div
              key={index}
              className={`alt-slot-card fade-in ${
                selectedIndex !== null && selectedIndex !== index
                  ? 'blurred'
                  : selectedIndex === index
                  ? 'focused'
                  : ''
              }`}
             // Inside alt-slot-card
onClick={() => {
  setSelectedIndex(index);
  onSlotSelect({
    doctor: slot.doctorId,      // ✅ Must be passed explicitly
    date: slot.date,
    slot: slot.slot
  });

}}

            >
              {/* <p><strong>Doctor:</strong> {slot.doctorName}</p> */}
              <p><strong>Date:</strong> {slot.date}</p>
              <p><strong>Slot:</strong> {slot.slot}</p>
              <p><strong>Booked:</strong> {slot.booked}/{slot.maxPatients}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlternativeSlots;
