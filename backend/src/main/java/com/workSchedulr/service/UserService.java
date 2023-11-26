package com.workSchedulr.service;

import com.workSchedulr.dto.UserUpdateDTO;
import com.workSchedulr.exception.UserNotFoundException;
import com.workSchedulr.exception.UserUnAuthorizedException;
import com.workSchedulr.model.User;
import com.workSchedulr.model.UserRole;
import com.workSchedulr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.CharBuffer;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public User getUserById(UUID userId) {
    return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
  }

  public Set<User> getAllUser(){
    User user = getCurrentUser();

    if (user == null) {
      throw new UserUnAuthorizedException();
    }

    if (!user.hasRole(UserRole.ROLE_ADMIN)) {
      return getAllUserForManager(user);
    }else{
      return getAllUserForAdmin();
    }
  }

  private Set<User> getAllUserForAdmin(){
    return new HashSet<>(userRepository.findAll());
  }

  private Set<User> getAllUserForManager(User user){
    Set<User> usersManagedBy = userRepository.findUsersByManagerId(user.getId());
    usersManagedBy.add(user);
    return usersManagedBy;
  }

  public Page<User> getUsersByParams(String userRole, Boolean status, Pageable pageable) {
    Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("lastName"));

    return Optional.ofNullable(userRole)
            .map(role -> status != null ? getByUserRoleAndStatus(role, status, sortedPageable) : getByUserRole(role, sortedPageable))
            .orElseGet(() -> Optional.ofNullable(status)
                    .map(st -> userRepository.findAllByStatus(st, sortedPageable))
                    .orElse(userRepository.findAll(sortedPageable)));
  }

  public User getCurrentUser() {
    if(SecurityContextHolder.getContext().getAuthentication() != null) {
      UserDetails userDetails =  (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

      if (userDetails != null) {
        String username = userDetails.getUsername();
        Optional<User> user = userRepository.findByEmail(username);

        if (user.isPresent()) {
          return user.get();
        }
      }
    }

    return null;
  }

  public User createUser(User user) {
    if(user.getPassword() != null){
      user.setPassword(passwordEncoder.encode(CharBuffer.wrap(user.getPassword())));
    }
    return userRepository.save(user);
  }

  public User updateUser(UUID id, UserUpdateDTO dto) {
    User user = getUserById(id);
    if(dto.getPassword() != null){
      user.setPassword(passwordEncoder.encode(CharBuffer.wrap(dto.getPassword())));
    }
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
    userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
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
