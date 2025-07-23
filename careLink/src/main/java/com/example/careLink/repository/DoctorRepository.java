package com.example.careLink.repository;

import org.springframework.stereotype.Repository;

import com.example.careLink.entity.*;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}
