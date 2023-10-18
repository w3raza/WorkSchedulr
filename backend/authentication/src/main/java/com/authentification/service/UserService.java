package com.authentification.service;

import com.authentification.dto.UserUpdateDTO;
import com.authentification.exception.UserNotFoundException;
import com.authentification.model.User;
import com.authentification.model.UserRole;
import com.authentification.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public User getUserById(UUID userId){
    return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
  }

  public Page<User> getUsersByParams(Pageable pageable, String userRole){
    if(userRole != null){
      return getByUserRole(pageable, userRole);
    }
    return userRepository.findAll(pageable);
  }

  public User updateUser(UUID id, UserUpdateDTO dto){
    User user = getUserById(id);

    if(dto.getPassword() != null) user.setPassword(dto.getPassword());
    if(dto.getEmail() != null) user.setEmail(dto.getEmail());
    if(dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
    if(dto.getLastName() != null) user.setLastName(dto.getLastName());
    if(dto.getPhone() != null) user.setPhone(dto.getPhone());
    if(dto.getBirth() != null) user.setBirth(dto.getBirth());
    user.setStudent(dto.isStudent());

    return userRepository.save(user);
  }

  public User changeStatus(UUID id){
    User user = getUserById(id);
    user.setStatus(!user.isStatus());

    return userRepository.save(user);
  }

  public void delete(String email) {
    userRepository.deleteByEmail(email);
  }

  private Page<User> getByUserRole(Pageable pageable, String userRole){
      UserRole userRoleEnum = convertStringToUserRoleEnum(userRole);
      return userRepository.findAllByUserRoles(userRoleEnum, pageable);

  }

  private UserRole convertStringToUserRoleEnum(String userRole){
    try {
      return UserRole.valueOf(userRole);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Cannot cast to enum string: " + userRole);
    }
  }
}
