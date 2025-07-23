import React from "react";

function Header(){
    return(
        <div>
       <header>

  <img src="/image0_large-removebg-preview.png" alt="CareLink Logo" />


  <nav className="links">
    <a href="#home">Home</a>
    <a href="#appointments">Appointments</a>
    <a className="about" href="#about">About</a>

  </nav>


  <button className="addButton" type="button">Login</button>
</header>


<button className="fab" aria-label="Add Appointment">+</button>
</div>
    )
}
export default Header