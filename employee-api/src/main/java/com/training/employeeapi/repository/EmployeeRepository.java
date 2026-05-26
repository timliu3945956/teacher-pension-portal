package com.training.employeeapi.repository;

import com.training.employeeapi.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDepartment(String department);

    boolean existsByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:name IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:department IS NULL OR e.department = :department) AND " +
           "(:minSalary IS NULL OR e.salary >= :minSalary) AND " +
           "(:maxSalary IS NULL OR e.salary <= :maxSalary)")
    Page<Employee> search(@Param("name") String name,
                          @Param("department") String department,
                          @Param("minSalary") Double minSalary,
                          @Param("maxSalary") Double maxSalary,
                          Pageable pageable);
}
