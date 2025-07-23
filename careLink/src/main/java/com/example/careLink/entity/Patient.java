package com.example.careLink.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.validation.constraints.*;

import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // @NotBlank(message = "Patient code is required")
    @Column(nullable = false, unique = true)
    private String code;

    // @NotBlank(message = "Name must not be empty")
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "d_id", nullable = false)
    private Doctor doctor;

    private String timeSlot;

    // @Size(min=10,max=10,message = "Mobile number must be exactly 10 digits long")
    private String mobileNumber;

    @Min(value = 350, message = "Fees must be at least 350")
    private Double fees;

    // @FutureOrPresent(message = "Date cannot be in the past")
    private LocalDate date;

    // @NotNull(message = "Status must be provided as true or false")
    private Boolean status;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }
    // public Boolean getStatus() {
    // return status;
    // }

    public Double getFees() {
        return fees;
    }

    public void setFees(Double fees) {
        this.fees = fees;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Boolean isStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
