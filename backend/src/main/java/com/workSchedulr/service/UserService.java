package com.workSchedulr.service;

import com.workSchedulr.dto.UserUpdateDTO;
import com.workSchedulr.exception.UserNotFoundException;
import com.workSchedulr.model.User;
import com.workSchedulr.model.UserRole;
import com.workSchedulr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public User getUserById(UUID userId) {
    return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
  }

  public Page<User> getUsersByParams(Pageable pageable, String userRole, Boolean status) {
    return Optional.ofNullable(userRole)
            .map(role -> status != null ? getByUserRoleAndStatus(role, status, pageable) : getByUserRole(role, pageable))
            .orElseGet(() -> Optional.ofNullable(status)
                    .map(st -> userRepository.findAllByStatus(st, pageable))
                    .orElse(userRepository.findAll(pageable)));
  }

  public User updateUser(UUID id, UserUpdateDTO dto) {
    User user = getUserById(id);

    Optional.ofNullable(dto.getPassword()).ifPresent(user::setPassword);
    Optional.ofNullable(dto.getEmail()).ifPresent(user::setEmail);
    Optional.ofNullable(dto.getFirstName()).ifPresent(user::setFirstName);
    Optional.ofNullable(dto.getLastName()).ifPresent(user::setLastName);
    Optional.ofNullable(dto.getPhone()).ifPresent(user::setPhone);
    Optional.ofNullable(dto.getBirth()).ifPresent(user::setBirth);
    user.setStudent(dto.isStudent());

    return userRepository.save(user);
  }

  public User changeStatus(UUID id) {
    User user = getUserById(id);
    user.setStatus(!user.isStatus());
    return userRepository.save(user);
  }

  public void delete(String email) {
    userRepository.deleteByEmail(email);
  }

  private Page<User> getByUserRoleAndStatus(String userRole, Boolean status, Pageable pageable) {
    UserRole userRoleEnum = convertStringToUserRoleEnum(userRole);
    return userRepository.findAllByUserRolesAndStatus(userRoleEnum, status, pageable);
  }

  private Page<User> getByUserRole(String userRole, Pageable pageable) {
    UserRole userRoleEnum = convertStringToUserRoleEnum(userRole);
    return userRepository.findAllByUserRoles(userRoleEnum, pageable);
  }

  private UserRole convertStringToUserRoleEnum(String userRole) {
    try {
      return UserRole.valueOf(userRole);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Cannot cast to enum string: " + userRole);
    }
  }
}
