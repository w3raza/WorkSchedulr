package com.workSchedulr.repository;

import com.workSchedulr.model.User;
import com.workSchedulr.model.UserRole;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>{

  boolean existsByEmail(String email);

  Optional<User> findByEmail(String email);

  Page<User> findAllByUserRoles(UserRole userRoles, Pageable pageable);

  Page<User> findAllByStatus(boolean status,  Pageable pageable);

  Page<User> findAllByUserRolesAndStatus(UserRole userRoles, boolean status, Pageable pageable);

  @Transactional
  void deleteByEmail(String email);

}