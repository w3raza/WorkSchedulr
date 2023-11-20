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
    @Query("SELECT p FROM Project p JOIN p.users u JOIN p.managers m WHERE (u.id = :userId OR m.id = :userId)")
    Page<Project> findAllByUsersAndManagers(@Param("userId")UUID userId, Pageable pageable);
    @Query("SELECT p FROM Project p JOIN p.users u JOIN p.managers m WHERE p.status = :status AND (u.id = :userId OR m.id = :userId)")
    Page<Project> findAllByUsersAndManagersAndStatus(@Param("userId") UUID userId, @Param("status") Boolean status, Pageable pageable);
    @Query("SELECT p FROM Project p JOIN p.users u JOIN p.managers m WHERE p.status = :status AND LOWER(p.title) LIKE LOWER(CONCAT('%',:title,'%')) AND (u.id = :userId OR m.id = :userId)")
    Page<Project> findAllByUsersAndManagersAndStatusAndTitleContaining(@Param("userId") UUID userId, @Param("status") Boolean status, @Param("title") String title, Pageable pageable);
    @Query("SELECT p FROM Project p JOIN p.users u JOIN p.managers m WHERE LOWER(p.title) LIKE LOWER(CONCAT('%',:title,'%')) AND (u.id = :userId OR m.id = :userId)")
    Page<Project> findAllByUsersAndManagersAndTitleContaining(@Param("userId") UUID userId, @Param("title") String title, Pageable pageable);
    Page<Project> findAllByStatus(Boolean status, Pageable pageable);
    Page<Project> findAllByStatusAndTitleContaining(Boolean status, String title, Pageable pageable);
    Page<Project> findAllByTitleContaining(String title, Pageable pageable);
}
