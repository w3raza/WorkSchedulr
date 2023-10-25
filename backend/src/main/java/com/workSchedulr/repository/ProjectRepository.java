package com.workSchedulr.repository;

import com.workSchedulr.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("SELECT p FROM User u JOIN u.projects p WHERE u.id = :userId")
    Page<Project> findAllProjectsByUserId(@Param("userId") UUID userId, Pageable pageable);
}
