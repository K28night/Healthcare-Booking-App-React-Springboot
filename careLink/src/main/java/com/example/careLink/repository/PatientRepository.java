package com.example.careLink.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.careLink.entity.*;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {
    boolean existsById(String id);// Spring Data JPA auto-implements this

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);
    // int countByDoctorAndDateAndTimeSlot(Doctor doctorId, String dates, String
    // slots);
    // int countByDoctorAndDateAndTimeSlot(long id, String dates, String slots);
    // fetchPatientint bookedPatients = patientRpo.fetchPatient(doctorId, dates,
    // slots);

    @Query("SELECT COUNT(patient.name) FROM Patient patient "
            + " WHERE patient.date=:dates AND patient.timeSlot=:slots AND "
            + " patient.doctor.Id=:doctorId")
    Integer fetchPatient(@Param("doctorId") Long doctorId, @Param("dates") LocalDate dated,
            @Param("slots") String slots);
}
