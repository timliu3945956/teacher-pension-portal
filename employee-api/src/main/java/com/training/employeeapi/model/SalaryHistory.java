package com.training.employeeapi.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties("salaryHistory")
    private Employee employee;

    private Double oldSalary;
    private Double newSalary;
    private LocalDateTime changedAt;
    private String reason;
}
