package com.example.careLink.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class AvailDoctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dates;

    private String slots;

    private Integer nopatients;

    private Integer patients;

    

@ManyToOne
@JoinColumn(name = "d_id")  // ensure this matches the DB column name
private Doctor doctors;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDates() {
        return dates;
    }

    public void setDates(String dates) {
        this.dates = dates;
    }

    public String getSlots() {
        return slots;
    }

    public void setSlots(String slots) {
        this.slots = slots;
    }

    public Integer getNopatients() {
        return nopatients;
    }

    public void setNopatients(Integer nopatients) {
        this.nopatients = nopatients;
    }

    public Doctor getDoctors() {
        return doctors;
    }

    public void setDoctors(Doctor doctor) {
        this.doctors = doctor;
    }
    public Integer getPatients() {
        return patients;
    }

    public void setPatients(Integer patients) {
        this.patients = patients;
    }

}
