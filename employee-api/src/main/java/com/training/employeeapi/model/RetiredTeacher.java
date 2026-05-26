package com.training.employeeapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "retired_teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RetiredTeacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String teacherId;

    private String subject;

    private Integer yearsOfService;

    private LocalDate retirementDate;

    private LocalDate pensionStartDate;

    private Double monthlyPension;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PensionStatus status;
}
