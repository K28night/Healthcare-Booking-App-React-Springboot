package com.example.careLink.service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;

import javax.validation.ValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*; // (Java util - wrong!)

import com.example.careLink.entity.AvailDoctor;
import com.example.careLink.entity.Doctor;
import com.example.careLink.entity.Patient;
import com.example.careLink.repository.*;

@Service
public class CareLinkService {
    @Autowired
    private DoctorRepository doctor;

    @Autowired
    private PatientRepository patientRpo;

    @Autowired
    private AvailDoctorsRepository availableDoctors;

    @PersistenceContext
    private EntityManager entityManager;

    public Boolean validatePatient(Patient patient, Boolean isUpdate) {
        if ((!isUpdate) && (patient.getName() == null || patient.getName().trim().isEmpty())) {
            throw new ValidationException("Patient name cannot be empty");
        }
        if (patient.getName() != null && !patient.getName().matches("^[a-zA-Z\\s]+$")) {
            throw new ValidationException("Name must contain only letters and spaces.");
        }
        String code = patient.getCode().trim();
        if ((!isUpdate) && (code.isEmpty())) {
            throw new ValidationException("Patient code must not be empty");
        }
        if (!code.matches("^P\\d{3,}$")) {
            throw new ValidationException("Patient code must start with P and follows 3 digits(like P104)");
        }

        if (patientRpo.existsByCode(code) && (!isUpdate)) {
            throw new ValidationException("Patient code must be unique");
        }

        if (patient.getMobileNumber() == null || patient.getMobileNumber().trim().isEmpty() && (!isUpdate)) {
            throw new ValidationException("Patient mobile number cannot be null");
        }
        if (!patient.getMobileNumber().matches("\\d{10}")) {
            throw new ValidationException("Mobile number must be exactly 10 digits and contain only numbers.");
        }
        if (patient.getFees() < 350) {
            throw new ValidationException("Fees must be at least 350");
        }
        if (patient.getDate() == null && (!isUpdate)) {
            throw new ValidationException("Date is cannot be null");
        }
        if ((!isUpdate) && (patient.getDate().isAfter(LocalDate.now()))) {
            throw new ValidationException("Date not be in the past or Future");
        }
        if (!doctor.existsById(patient.getDoctor().getId())) {
            throw new ValidationException("Assigned doctor does not exist");
        }
        if (patient.isStatus() == null && (!isUpdate)) {
            throw new ValidationException("Patient status is cannot be null");
        }
        return true;
    }

    // Create patient
    @SuppressWarnings("unused")
    public ResponseEntity<String> savePatient(Patient patient) {
        Patient save = patientRpo.save(patient);
        if (save != null) {// jpa build-in database operations
            return ResponseEntity.ok("Patient added successfully!");
        } else {
            return ResponseEntity.ok("Failed to add patient");
        }

    }

    public List<Patient> getAllPatients(String sort) {
        return patientRpo.findAll(Sort.by(Sort.Direction.ASC, sort));
    }

    public List<Doctor> getAllDoctor() {
        return doctor.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRpo.findById(id).orElse(null);
    }

    public boolean existsBycode(String code) {
        return patientRpo.existsByCode(code);
    }

    public ResponseEntity<String> deletePatientById(Long id) {
        patientRpo.deleteById(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }

    public ResponseEntity<?> updatePatientById(Long id, Patient newPatient) {
        Patient exsist = patientRpo.findById(id).orElse(null);
        if (exsist != null) {
            if (validatePatient(newPatient, true)) {
                exsist.setName(newPatient.getName());
                exsist.setCode(newPatient.getCode());
                exsist.setDate(newPatient.getDate());
                exsist.setFees(newPatient.getFees());
                exsist.setMobileNumber(newPatient.getMobileNumber());
                exsist.setStatus(newPatient.isStatus());
                exsist.setDoctor(newPatient.getDoctor());
                exsist.setTimeSlot(newPatient.getTimeSlot());
                patientRpo.save(exsist);

                return ResponseEntity.ok("Patient updation success");
            }
        }
        return ResponseEntity.ok("Patient id not found");
    }

    public boolean existsByCodeAndIdNot(String code, Long id) {
        return patientRpo.existsByCodeAndIdNot(code, id);
    }

    public List<Patient> searchPatients(Patient filter) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Patient> query = cb.createQuery(Patient.class);
        Root<Patient> root = query.from(Patient.class);
        List<Predicate> predicates = new ArrayList<>();

        String names = filter.getName();
        if (names != null && !names.trim().isEmpty()) {
            String lower = "%" + names.toLowerCase() + "%";
            Predicate byName = cb.like(cb.lower(root.get("name")), lower);
            Predicate byCode = cb.like(cb.lower(root.get("code")), lower);
            Predicate byMobile = cb.like(cb.lower(root.get("mobileNumber")), lower);

            predicates.add(cb.or(byName, byCode, byMobile));
        }
        // String code=filter.getCode();
        // if(code !=null && !code.trim().isEmpty()){
        // predicates.add(cb.equal(root.get("code"),code));
        // }
        if (filter.getDate() != null) {
            predicates.add(cb.equal(root.get("date"), filter.getDate()));
        }
        if (filter.getFees() != null) {
            predicates.add(cb.equal(root.get("fees"), filter.getFees()));
        }
        if (filter.getDoctor().getId() > 0) {
            predicates.add(cb.equal(root.get("doctor").get("Id"), filter.getDoctor().getId()));
        }
        if (filter.isStatus() != null) {
            predicates.add(cb.equal(root.get("status"), filter.isStatus()));
        }
        String slot = filter.getTimeSlot();
        if (slot != null) {
            predicates.add(cb.like(root.get("timeSlot"), "%" + slot.trim() + "%"));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));

        String sort = filter.getCode();
        if (sort != null && !sort.isEmpty()) {

            if (sort.equals("doctor.name")) {
                query.orderBy(cb.asc(root.get("doctor").get("name")));
            } else if (sort.equals("status")) {
                query.orderBy(cb.desc(root.get(sort)));
            } else {
                query.orderBy(cb.asc(root.get(sort)));
            }

        }
        // query.orderBy(cb.asc(root.get("name")));
        return entityManager.createQuery(query).getResultList();
    }

  public ResponseEntity<?> checkAvailability(String dates, String slots, Long doctorId) {
    Map<String, Object> response = new HashMap<>();
    String today = LocalDate.now().toString();
    System.out.println(doctorId);
    // System.out.println(slots);
    // System.out.println(dates);
    Integer totalAvailable = availableDoctors.fetchTimeSlot(doctorId, slots, dates);

    // No slot configured or no available capacity
    if (totalAvailable == null || totalAvailable <= 0) {
        List<AvailDoctor> alternatives = availableDoctors.findAllFutureByDoctorId(doctorId,today);
        List<Map<String, Object>> altList = new ArrayList<>();

        for (AvailDoctor alt : alternatives) {
            Map<String, Object> map = new HashMap<>();
            map.put("doctor", alt.getDoctors().getName());
            map.put("date", alt.getDates());
            map.put("slot", alt.getSlots());
            map.put("maxPatients", alt.getNopatients());
            map.put("booked", alt.getPatients());
            altList.add(map);
        }

        response.put("available", false);
        response.put("alternatives", altList);
        return ResponseEntity.ok(response);
    }

    // Check how many are already booked
    Integer bookedPatients = availableDoctors.fetchPatientbooked(doctorId, dates, slots);

    // let booked=bookedPatients[0];
    // // if(bookedPatients==null)bookedPatients=0;

    // // If available slots are left
    if (bookedPatients <= totalAvailable && bookedPatients>0) {
        response.put("available", true);
    } else {
        response.put("available", false);
        response.put("waitingList", true);
    }

    return ResponseEntity.ok(response);
}

}
