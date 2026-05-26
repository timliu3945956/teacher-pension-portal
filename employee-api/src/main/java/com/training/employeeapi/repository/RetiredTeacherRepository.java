package com.training.employeeapi.repository;

import com.training.employeeapi.model.PensionStatus;
import com.training.employeeapi.model.RetiredTeacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetiredTeacherRepository extends JpaRepository<RetiredTeacher, Long> {

    List<RetiredTeacher> findByStatus(PensionStatus status);

    @Query("SELECT t FROM RetiredTeacher t WHERE " +
           "(:name IS NULL OR LOWER(t.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(t.lastName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:subject IS NULL OR t.subject = :subject)")
    List<RetiredTeacher> search(@Param("name") String name,
                                @Param("status") PensionStatus status,
                                @Param("subject") String subject);
}
