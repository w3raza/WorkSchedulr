package com.workSchedulr.repository;

import com.workSchedulr.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId")
    Set<Project> findByUserId(@Param("userId") UUID userId);
}
