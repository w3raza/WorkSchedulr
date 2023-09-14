package com.authentification.service;

import com.authentification.configuration.JwtService;
import com.authentification.dto.LoginRequest;
import com.authentification.dto.UserDataDTO;
import com.authentification.dto.UserResponseDTO;
import com.authentification.exception.InvalidPasswordException;
import com.authentification.exception.UserNotFoundException;
import com.authentification.model.User;
import com.authentification.model.UserRole;
import com.authentification.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.CharBuffer;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final ModelMapper modelMapper = new ModelMapper();

  public UserResponseDTO signin(LoginRequest loginRequest) {
      String username = loginRequest.getUsername();
      String password = loginRequest.getPassword();
      User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
      if (passwordEncoder.matches(CharBuffer.wrap(password), user.getPassword())) {
        UserResponseDTO userResponseDTO = modelMapper.map(user, UserResponseDTO.class);
        userResponseDTO.setToken(jwtService.createToken(userResponseDTO.getUsername(), user.getUserRoles()));
        return userResponseDTO;
      }else{
        throw new InvalidPasswordException();
      }
  }

  public UserResponseDTO signup(UserDataDTO userDTO) {
    if (userRepository.existsByUsername(userDTO.getUsername())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Username is already in use");
    }
    User user = modelMapper.map(userDTO, User.class);
    user.getUserRoles().add(UserRole.ROLE_USER);
    user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDTO.getPassword())));
    userRepository.save(user);

    UserResponseDTO userResponseDTO = modelMapper.map(user, UserResponseDTO.class);

    userResponseDTO.setToken(jwtService.createToken(userResponseDTO.getUsername(), userResponseDTO.getUserRoles()));
    return userResponseDTO;
  }

  public void delete(String username) {
    userRepository.deleteByUsername(username);
  }

  public String refresh(String username) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    return jwtService.createToken(username, user.getUserRoles());
  }
}
