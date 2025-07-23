package com.example.careLink.repository;

import org.springframework.stereotype.Repository;

import com.example.careLink.entity.AvailDoctor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AvailDoctorsRepository extends JpaRepository<AvailDoctor, Long> {

      // AvailDoctor findByDoctorsAndDatesAndSlots(Doctor doctorId, String date,
      // String slot);
@Query("SELECT availDoctor.nopatients FROM AvailDoctor availDoctor "
     + "WHERE availDoctor.dates = :dates AND availDoctor.slots = :slots AND "
     + "availDoctor.doctors.id = :doctorId")
Integer fetchTimeSlot(@Param("doctorId") Long doctorId,
                      @Param("slots") String slots,
                      @Param("dates") String dates);

      @SuppressWarnings("null")
      List<AvailDoctor> findAll();

      @Query("SELECT a FROM AvailDoctor a WHERE a.doctors.id = :doctorId AND a.dates > :today AND COALESCE(a.patients, 0) > 0")
      List<AvailDoctor> findAllFutureByDoctorId(@Param("doctorId") Long doctorId,@Param("today") String today);

   @Query(value = "SELECT patients FROM avail_doctor WHERE dates = :dates AND slots = :slots AND d_id = :doctorId LIMIT 1", nativeQuery = true)
Integer fetchPatientbooked(@Param("doctorId") Long doctorId,
                                 @Param("dates") String dates,
                                 @Param("slots") String slots);



      // List<AvailDoctor> fetchTimeSlot(int doctorId, String slots, String dates);

}
