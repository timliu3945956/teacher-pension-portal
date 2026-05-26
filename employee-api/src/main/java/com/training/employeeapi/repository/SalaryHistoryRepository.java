package com.training.employeeapi.repository;

import com.training.employeeapi.model.SalaryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryHistoryRepository extends JpaRepository<SalaryHistory, Long> {

    List<SalaryHistory> findByEmployeeIdOrderByChangedAtDesc(Long employeeId);
}
