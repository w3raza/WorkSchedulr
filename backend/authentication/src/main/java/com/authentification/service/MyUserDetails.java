package com.authentification.service;

import com.authentification.model.User;
import com.authentification.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyUserDetails implements UserDetailsService {
  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    final Optional<User> userOptional = userRepository.findByUsername(username);

    if (userOptional.isEmpty()) {
      throw new UsernameNotFoundException("User '" + username + "' not found");
    }
    final User user = userOptional.get();
    return org.springframework.security.core.userdetails.User//
        .withUsername(username)
        .password(user.getPassword())
        .authorities(user.getUserRoles())
        .accountExpired(false)
        .accountLocked(false)
        .credentialsExpired(false)
        .disabled(false)
        .build();
  }
}
