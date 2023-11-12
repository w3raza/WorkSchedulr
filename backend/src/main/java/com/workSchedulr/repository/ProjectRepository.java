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

    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId AND p.status = :status")
    Page<Project> findAllByUsersAndStatus(@Param("userId") UUID userId, @Param("status") boolean status, Pageable pageable);

    Page<Project> findAllByStatus(Boolean status, Pageable pageable);

    Page<Project> findAllByStatusAndTitleContaining(Boolean status, String title, Pageable pageable);
    Page<Project> findAllByTitleContaining(String title, Pageable pageable);

    @Query("SELECT p FROM User u JOIN u.projects p WHERE u.id = :userId AND (:searchTerm IS NULL OR p.title LIKE %:searchTerm%)")
    Page<Project> findAllByUsersAndTitleContaining(@Param("userId") UUID userId, @Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId AND p.status = :status AND (:searchTerm IS NULL OR p.title LIKE %:searchTerm%)")
    Page<Project> findAllByUsersAndStatusAndTitleContaining(@Param("userId") UUID userId, @Param("status") boolean status, @Param("searchTerm") String searchTerm, Pageable pageable);

}
