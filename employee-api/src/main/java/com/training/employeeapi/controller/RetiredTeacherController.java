package com.training.employeeapi.controller;

import com.training.employeeapi.model.PensionStats;
import com.training.employeeapi.model.PensionStatus;
import com.training.employeeapi.model.RetiredTeacher;
import com.training.employeeapi.service.RetiredTeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pension")
@CrossOrigin(origins = "http://localhost:4200")
public class RetiredTeacherController {

    private final RetiredTeacherService service;

    public RetiredTeacherController(RetiredTeacherService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<RetiredTeacher>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RetiredTeacher> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RetiredTeacher>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) PensionStatus status,
            @RequestParam(required = false) String subject) {
        return ResponseEntity.ok(service.search(name, status, subject));
    }

    @GetMapping("/stats")
    public ResponseEntity<PensionStats> getStats() {
        return ResponseEntity.ok(service.getStats());
    }

    @PatchMapping("/cola")
    public ResponseEntity<List<RetiredTeacher>> applyCola(@RequestParam double percent) {
        return ResponseEntity.ok(service.applyCola(percent));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RetiredTeacher> updateStatus(
            @PathVariable Long id,
            @RequestParam PensionStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
