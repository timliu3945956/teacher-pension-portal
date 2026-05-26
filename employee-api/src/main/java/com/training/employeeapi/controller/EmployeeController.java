package com.training.employeeapi.controller;

import com.training.employeeapi.model.DeptStats;
import com.training.employeeapi.model.Employee;
import com.training.employeeapi.model.SalaryHistory;
import com.training.employeeapi.service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartment(department));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Employee>> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Double maxSalary,
            Pageable pageable) {
        return ResponseEntity.ok(employeeService.searchEmployees(name, department, minSalary, maxSalary, pageable));
    }

    @GetMapping("/{id}/salary-history")
    public ResponseEntity<List<SalaryHistory>> getSalaryHistory(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getSalaryHistory(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<List<DeptStats>> getDepartmentStats() {
        return ResponseEntity.ok(employeeService.getDepartmentStats());
    }

    @PatchMapping("/raise")
    public ResponseEntity<List<Employee>> applyRaise(
            @RequestParam String department,
            @RequestParam double percent) {
        return ResponseEntity.ok(employeeService.applyRaise(department, percent));
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.createEmployee(employee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
