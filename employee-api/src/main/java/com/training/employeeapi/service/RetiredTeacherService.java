package com.training.employeeapi.service;

import com.training.employeeapi.exception.ResourceNotFoundException;
import com.training.employeeapi.model.PensionStats;
import com.training.employeeapi.model.PensionStatus;
import com.training.employeeapi.model.RetiredTeacher;
import com.training.employeeapi.repository.RetiredTeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RetiredTeacherService {

    private final RetiredTeacherRepository repo;

    public RetiredTeacherService(RetiredTeacherRepository repo) {
        this.repo = repo;
    }

    public List<RetiredTeacher> getAll() {
        return repo.findAll();
    }

    public RetiredTeacher getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Retired teacher not found with id: " + id));
    }

    public List<RetiredTeacher> search(String name, PensionStatus status, String subject) {
        return repo.search(name, status, subject);
    }

    public PensionStats getStats() {
        List<RetiredTeacher> all = repo.findAll();
        long activeCount    = all.stream().filter(t -> t.getStatus() == PensionStatus.ACTIVE).count();
        long suspendedCount = all.stream().filter(t -> t.getStatus() == PensionStatus.SUSPENDED).count();
        long deceasedCount  = all.stream().filter(t -> t.getStatus() == PensionStatus.DECEASED).count();
        double totalPayout  = all.stream()
                .filter(t -> t.getStatus() == PensionStatus.ACTIVE)
                .mapToDouble(t -> t.getMonthlyPension() != null ? t.getMonthlyPension() : 0)
                .sum();
        double avgPension = activeCount > 0 ? totalPayout / activeCount : 0;
        return new PensionStats(all.size(), activeCount, suspendedCount, deceasedCount, totalPayout, avgPension);
    }

    public List<RetiredTeacher> applyCola(double percent) {
        List<RetiredTeacher> active = repo.findByStatus(PensionStatus.ACTIVE);
        if (active.isEmpty()) {
            throw new ResourceNotFoundException("No active pensioners found.");
        }
        double multiplier = 1 + (percent / 100.0);
        active.forEach(t -> {
            if (t.getMonthlyPension() != null) {
                t.setMonthlyPension(Math.round(t.getMonthlyPension() * multiplier * 100.0) / 100.0);
            }
        });
        return repo.saveAll(active);
    }

    public RetiredTeacher updateStatus(Long id, PensionStatus status) {
        RetiredTeacher teacher = getById(id);
        teacher.setStatus(status);
        return repo.save(teacher);
    }
}
