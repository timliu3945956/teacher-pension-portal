package com.training.employeeapi.service;

import com.training.employeeapi.exception.ResourceNotFoundException;
import com.training.employeeapi.model.DeptStats;
import com.training.employeeapi.model.Employee;
import com.training.employeeapi.model.SalaryHistory;
import com.training.employeeapi.repository.EmployeeRepository;
import com.training.employeeapi.repository.SalaryHistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final SalaryHistoryRepository salaryHistoryRepository;

    public EmployeeService(EmployeeRepository employeeRepository, SalaryHistoryRepository salaryHistoryRepository) {
        this.employeeRepository = employeeRepository;
        this.salaryHistoryRepository = salaryHistoryRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }

    public Page<Employee> searchEmployees(String name, String department, Double minSalary, Double maxSalary, Pageable pageable) {
        return employeeRepository.search(name, department, minSalary, maxSalary, pageable);
    }

    public List<SalaryHistory> getSalaryHistory(Long employeeId) {
        getEmployeeById(employeeId);
        return salaryHistoryRepository.findByEmployeeIdOrderByChangedAtDesc(employeeId);
    }

    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("An employee with email " + employee.getEmail() + " already exists");
        }
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        Employee existing = getEmployeeById(id);
        Double oldSalary = existing.getSalary();
        existing.setFirstName(updatedEmployee.getFirstName());
        existing.setLastName(updatedEmployee.getLastName());
        existing.setEmail(updatedEmployee.getEmail());
        existing.setDepartment(updatedEmployee.getDepartment());
        existing.setSalary(updatedEmployee.getSalary());
        Employee saved = employeeRepository.save(existing);
        if (!Objects.equals(oldSalary, updatedEmployee.getSalary())) {
            salaryHistoryRepository.save(
                new SalaryHistory(null, saved, oldSalary, saved.getSalary(), LocalDateTime.now(), "Manual update")
            );
        }
        return saved;
    }

    public void deleteEmployee(Long id) {
        Employee existing = getEmployeeById(id);
        employeeRepository.delete(existing);
    }

    public List<Employee> applyRaise(String department, double percentIncrease) {
        List<Employee> group = employeeRepository.findByDepartment(department);
        if (group.isEmpty()) {
            throw new ResourceNotFoundException("No employees found in department: " + department);
        }
        double multiplier = 1 + (percentIncrease / 100.0);
        String reason = String.format("%.1f%% raise applied to %s department", percentIncrease, department);
        LocalDateTime now = LocalDateTime.now();
        List<SalaryHistory> historyEntries = new ArrayList<>();
        group.forEach(e -> {
            if (e.getSalary() != null) {
                Double oldSalary = e.getSalary();
                e.setSalary(Math.round(e.getSalary() * multiplier * 100.0) / 100.0);
                historyEntries.add(new SalaryHistory(null, e, oldSalary, e.getSalary(), now, reason));
            }
        });
        List<Employee> saved = employeeRepository.saveAll(group);
        salaryHistoryRepository.saveAll(historyEntries);
        return saved;
    }

    public List<DeptStats> getDepartmentStats() {
        Map<String, List<Employee>> byDept = employeeRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Employee::getDepartment));

        return byDept.entrySet().stream()
                .map(entry -> {
                    String dept = entry.getKey();
                    List<Employee> group = entry.getValue();
                    long headcount = group.size();
                    double total = group.stream().mapToDouble(e -> e.getSalary() != null ? e.getSalary() : 0).sum();
                    double avg = headcount > 0 ? total / headcount : 0;
                    double min = group.stream().mapToDouble(e -> e.getSalary() != null ? e.getSalary() : 0).min().orElse(0);
                    double max = group.stream().mapToDouble(e -> e.getSalary() != null ? e.getSalary() : 0).max().orElse(0);
                    return new DeptStats(dept, headcount, total, avg, min, max);
                })
                .sorted(Comparator.comparing(DeptStats::getDepartment))
                .collect(Collectors.toList());
    }
}
