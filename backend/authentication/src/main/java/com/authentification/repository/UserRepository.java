package com.authentification.repository;

import com.authentification.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>{

  boolean existsByEmail(String email);

  Optional<User> findByEmail(String email);

  @Transactional
  void deleteByEmail(String email);

}
