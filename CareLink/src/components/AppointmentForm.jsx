import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/appointmentForm.css';
import InputField from './InputField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlternativeSlots from './AlternativeSlots'

const generateCode = () => 'APT' + Math.floor(1000 + Math.random() * 9000);

const checkCodeExists = async (code) => {
  try {
    const response = await axios.get('http://localhost:9081/validate', {
      params: { code }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking code:', error);
    return true; // assume it exists to be safe
  }
};

const generateUniqueCode = async () => {
  let unique = false;
  let newCode = '';
  while (!unique) {
    newCode = generateCode();
    const exists = await checkCodeExists(newCode);
    if (!exists) unique = true;
  }
  return newCode;
};

const AppointmentForm = ({receivedData,onSubmitSuccess}) => {//destruct the data coming from the parent comp
   const [formData, setFormData] = useState({
     name: '',
    code: generateCode(),
    fees: '350',
    mobile: '',
    date: '',
    doctor: '',
    slot: '',
    status: true
   })
  useEffect(() => {
    setFormData({
      name: receivedData.name || '',
      code: receivedData.code || generateCode(),
      fees: receivedData.fees || '350',
      mobile: receivedData.mobileNumber || '',
      date: receivedData.date || '',
      doctor: receivedData.doctor?.id || '',
      slot: receivedData.timeSlot || '',
      status: receivedData.status === true ? false : true
    });

   if (receivedData && receivedData.name) {
    setShowSubmit(true);
  }
  }, [receivedData]);

const clearForm = async () => {
  
  const uniqueCode = await generateUniqueCode();
  setFormData({
    name: '',
    code: uniqueCode,
    fees: '350',
    mobile: '',
    date: '',
    doctor: '',
    slot: '',
    status: true
  });
  onSubmitSuccess();//clear the data from parent
  setErrors({});
  setAvailabilityChecked(false);
  setIsAvailable(false);
  toast.info("Form cleared");
};


const handleAlternativeSelect = (slotData) => {
   if (!slotData) {
    console.log("User cancelled selection");
    setAltSlots([]);
  }else{
   setFormData(prev => ({
  ...prev,
  // doctor: slotData.doctor, // ✅ should now match <option value={doc.id}>
  date: slotData.date,
  slot: slotData.slot,
  status:false,
})
  
);
  
  toast.success("Slot auto-filled from suggestions");
  setIsAvailable(true);
  setWaitingList(false);
  setShowSubmit(true)
  setAltSlots([]);
}
};

  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  // const [bookStatus,setBookStatus]=useState('');
  const [checking, setChecking] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [doctors,setDoctors]=useState([])
  const [waitingList, setWaitingList] = useState(false);
  const [altSlots, setAltSlots] = useState([]);

  const slots = ['9:00-10:00 AM', '10:00-11:00 AM', '11:00-12:00 PM','1:00-2:00 PM'];

  useEffect(() => {
    const setCode = async () => {
      const uniqueCode = await generateUniqueCode();
      if(!(receivedData && receivedData.name)){
      setFormData((prev) => ({ ...prev, code: uniqueCode }));}
     axios.get("http://localhost:9081/doctorlist")
  .then((res) => setDoctors(res.data));

    };
    setCode();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (['doctor', 'date', 'slot'].includes(name)) {
      setAvailabilityChecked(false);
      setIsAvailable(false);
      setShowSubmit(false)
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z ]{3,}$/.test(formData.name)) {
      newErrors.name = 'Name should be at least 3 characters and contain only letters';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (!/^APT\d{4,}$/.test(formData.code)) {
      newErrors.code = 'Code must start with "APT" followed by at least 4 digits';
    }

    if (!formData.fees || Number(formData.fees) <= 0) {
      newErrors.fees = 'Enter valid fees amount';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be exactly 10 digits';
    }

    if (!formData.date) {
      newErrors.date = 'Booking date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

if (!formData.doctor) newErrors.doctorId = 'Select a doctor';

    if (!formData.slot) newErrors.slot = 'Select a slot';

    return newErrors;
  };

  const checkAvailability = async () => {
    if (!formData.doctor || !formData.slot || !formData.date) {
      toast.error('Select doctor, date and slot to check availability');
      return;
    }
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        toast.error('Date cannot be in the past');
        return;
      }
    setChecking(true);
    try {
      const response = await axios.post('http://localhost:9081/checkAvailability', null, {
        params: {
        doctorId: formData.doctor,
        slots: formData.slot,
        dates: formData.date
      }
    });
    console.log("Submitting data:", formData);
 if (response.data.body.available) {
      toast.success("Slot is available!");
      setIsAvailable(true);
      setWaitingList(false);
      setShowSubmit(true);
       setFormData(prev => ({
  ...prev,
  status: false  // Booked
}));

      setAltSlots([]);
    } else if (response.data.body.waitingList) {
      toast.info("Slot is full. Patient will be added to waiting list.");
      setIsAvailable(true); // still allow submission
      setWaitingList(true);
      setShowSubmit(true); 
      setFormData(prev => ({
  ...prev,
  status: true // Waiting List
}));

      setAltSlots([]);
    } else {
      toast.error("Slot not available. Showing alternative slots.");
      setIsAvailable(false);
      setWaitingList(false);
      setShowSubmit(false); 
      setAltSlots(response.data.body.alternatives || []);
    }

      // if (!(response.data.body.available)) {
      //   toast.success('Slot is available!');
      //   setIsAvailable(true);
      //      setShowSubmit(true); 
      // } else {
      //   toast.error('Slot is already booked!');
      //   console.log(response.data)
      //   setIsAvailable(false);
           
      // }

      setAvailabilityChecked(true);
    } catch (error) {
      console.error('Availability check failed:', error);
      toast.error('Error checking availability');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    console.log("Submitting form:", formData);
    e.preventDefault();
   
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!availabilityChecked || !isAvailable) {
    toast.error('Please check availability before submitting.');
    return;
  }
    try {
         if (receivedData && receivedData.name) {
      const response = await axios.put(`http://localhost:9081/update/${receivedData.id}`,{
     
      name: formData.name,
      code: formData.code,
      date: formData.date,
      fees: formData.fees,
      mobileNumber: formData.mobile,
      doctor: { id: formData.doctor },
      status: formData.status , // Or just boolean true/false
      timeSlot: formData.slot
        
});
if(response.data){
     toast.success('Appointment Edited!');
    onSubmitSuccess();
  }
         }
else{
     const response = await axios.post('http://localhost:9081/savepatient',{
      name: formData.name,
      code: formData.code,
      date: formData.date,
      fees: formData.fees,
      mobileNumber: formData.mobile,
      doctor: { id: formData.doctor },
      status: formData.status , // Or just boolean true/false
      timeSlot: formData.slot
});
if(response.data){
     toast.success('Appointment Booked!');
  }
}

    }
    catch(e){
      toast.error('Error occured in booking'+e)
    }
    
   

    setFormData({
      name: '',
      code: generateCode(),
      fees: '350',
      mobile: '',
      date: '',
      doctor: '',
      slot: '',
      status: ''
    });

    setErrors({});
    setAvailabilityChecked(false);
    setIsAvailable(false);
     setWaitingList(false);//hide waithing list message
    setShowSubmit(false);//clear form
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Book an Appointment</h2>
        {waitingList && (
  <p style={{ color: "orange" }}>This booking will go to waiting list.</p>
)}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Name</label>
            <InputField type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Appointment Code</label>
            <InputField type="text" name="code" value={formData.code} onChange={handleChange} disabled />
            {errors.code && <p className="error">{errors.code}</p>}
          </div>

          <div className="form-group">
            <label>Fees (₹)</label>
            <InputField type="number" name="fees" value={formData.fees} onChange={handleChange} />
            {errors.fees && <p className="error">{errors.fees}</p>}
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <InputField type="tel" name="mobile" value={formData.mobile} onChange={handleChange} />
            {errors.mobile && <p className="error">{errors.mobile}</p>}
          </div>

          <div className="form-group">
            <label>Booking Date</label>
            <InputField type="date" name="date" value={formData.date} onChange={handleChange} />
            {errors.date && <p className="error">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label>Doctor Name</label>

            <select name="doctor" value={formData.doctor} onChange={handleChange}>
  <option value="">Select a doctor</option>
  {doctors.map(doc => (
   <option key={doc.id} value={doc.id}>
  {doc.name} ({doc.department})
</option>

  ))}
</select>

            {errors.doctor && <p className="error">{errors.doctor}</p>}
          </div>

          <div className="form-group">
            <label>Slot</label>
            <InputField
              label="Slot"
              name="slot"
              type="select"
              value={formData.slot}
              onChange={handleChange}
              options={slots}
              error={errors.slot}
            />
            {errors.slot && <p className="error">{errors.slot}</p>}
          </div>
         <div className="form-group">
  <label>Status</label>
  <input
    type="text"
    value={
      (receivedData && receivedData.status)?
      (receivedData.status===false)? "Booked":"Waiting List" :
      waitingList ? "Waiting List" : "Booked"
    }
    disabled
  />
</div>

          
          <div className="form-group buttons-row">
            {!showSubmit&&(<button
              type="button"
              className="check-button"
              onClick={checkAvailability}
              disabled={checking}
            >
              {checking ? 'Checking...' : 'Check Availability'}
            </button>)}

             {showSubmit && (
 <button onClick={handleSubmit} className="check-button">
  Submit
</button>
  )}
  
              <button
    type="button"
    className="clear-button"
    onClick={clearForm}
  >
    Clear Form
  </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" theme="colored" autoClose={3000} />
    {altSlots.length > 0  &&(

   <AlternativeSlots
    slots={altSlots}
    onSlotSelect={handleAlternativeSelect}
   
  />
//  onClose={() => altSlots([])}
)}

    </div>
  );
};

export default AppointmentForm;
