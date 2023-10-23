package com.authentification.service;

import com.authentification.configuration.JwtService;
import com.authentification.dto.LoginRequest;
import com.authentification.dto.RegisterDataDTO;
import com.authentification.dto.UserResponseDTO;
import com.authentification.exception.InvalidPasswordException;
import com.authentification.exception.UserAlreadyExistsException;
import com.authentification.exception.UserNotFoundException;
import com.authentification.model.User;
import com.authentification.model.UserRole;
import com.authentification.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.CharBuffer;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ModelMapper modelMapper = new ModelMapper();

    public String refresh(String login) {
        User user = userRepository.findByEmail(login).orElseThrow(UserNotFoundException::new);
        return jwtService.createToken(login, user.getUserRoles());
    }

    public UserResponseDTO validateToken( String token) {
        Authentication auth = jwtService.validateToken(token);
        org.springframework.security.core.userdetails.User object =  (org.springframework.security.core.userdetails.User)auth.getPrincipal();
        User userOptional = userRepository.findByEmail(object.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        UserResponseDTO userResponseDTO = modelMapper.map(userOptional, UserResponseDTO.class);
        userResponseDTO.setToken(token);
        return userResponseDTO;
    }

    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
    }

    public UserResponseDTO signIn(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        User user = userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
        if (passwordEncoder.matches(CharBuffer.wrap(password), user.getPassword())) {
            UserResponseDTO userResponseDTO = modelMapper.map(user, UserResponseDTO.class);
            userResponseDTO.setToken(jwtService.createToken(userResponseDTO.getEmail(), user.getUserRoles()));
            return userResponseDTO;
        }else{
            throw new InvalidPasswordException();
        }
    }

    @Transactional
    public UserResponseDTO signup(RegisterDataDTO userDTO) throws ResponseStatusException{
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new UserAlreadyExistsException();
        }
        User user = modelMapper.map(userDTO, User.class);

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        if (!violations.isEmpty()) {
            for (ConstraintViolation<User> violation : violations) {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, violation.getMessage());
            }
        }

        user.getUserRoles().add(UserRole.ROLE_USER);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDTO.getPassword())));
        userRepository.save(user);

        UserResponseDTO userResponseDTO = modelMapper.map(user, UserResponseDTO.class);

        userResponseDTO.setToken(jwtService.createToken(userResponseDTO.getEmail(), userResponseDTO.getUserRoles()));
        return userResponseDTO;
    }
}
