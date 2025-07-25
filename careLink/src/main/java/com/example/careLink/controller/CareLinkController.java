package com.example.careLink.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.careLink.entity.Doctor;
import com.example.careLink.entity.Patient;
import com.example.careLink.service.CareLinkService;

// @Controller
@CrossOrigin(origins = "*")
@RestController

public class CareLinkController {

    @Autowired
    private CareLinkService service;

    @GetMapping("/addpatient")
    public String addPatient(Model model) {
        return "addPatient";
    }

    @GetMapping("/viewpatient")
    public String viewPatient(Model model) {
        return "viewPatient";
    }

    @GetMapping("/doctorlist")
    public List<Doctor> listDoctors() {
        return service.getAllDoctor();
    }

    @GetMapping("/validate")
    public ResponseEntity validate(@RequestParam String code) {
         boolean exists = service.existsBycode(code);
    return ResponseEntity.ok(exists);
        
    }

    @PostMapping("/savepatient")
    public ResponseEntity<String> createPatient(@RequestBody Patient patient) {
        return service.savePatient(patient);
    }

    @GetMapping("/displayall")
    public List<Patient> getAllPatient(@RequestParam String sort) {
        return service.getAllPatients(sort);
    }

    @GetMapping("/display/{id}")
    public Patient displayPatient(@PathVariable Long id) {
        return service.getPatientById(id);
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        return service.deletePatientById(id);
    }

    @GetMapping("/codeValidation")
    public boolean codeValidation(@RequestParam Long id, @RequestParam String code) {
        return !service.existsByCodeAndIdNot(code, id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return service.updatePatientById(id, patient);
    }

    @PostMapping("/search")
    public List<Patient> searchPatient(@RequestBody Patient patient) {
        return service.searchPatients(patient);
    }

    // @PostMapping("/checkSlotAvailability")
    // public ResponseEntity<?> checkAvailability(@RequestBody AvailDoctor req) {
    // return ResponseEntity.ok(service.checkAvailability(req));
    // }
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/checkAvailability")
    public ResponseEntity<?> checkAvailability(@RequestParam String dates, @RequestParam String slots,
            @RequestParam Long doctorId) {

        return ResponseEntity.ok(service.checkAvailability(dates, slots, doctorId));
    }
}
