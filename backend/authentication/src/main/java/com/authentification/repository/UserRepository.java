package com.authentification.repository;

import com.authentification.model.User;
import com.authentification.model.UserRole;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>{

  boolean existsByEmail(String email);

  Optional<User> findByEmail(String email);

  Page<User> findAllByUserRoles(UserRole userRoles, Pageable pageable);

  Page<User> findAllByStatus(boolean status,  Pageable pageable);

  Page<User> findAllByUserRolesAndStatus(UserRole userRoles, boolean status, Pageable pageable);

  @Transactional
  void deleteByEmail(String email);

}
