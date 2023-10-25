package com.workSchedulr.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

//  private final AuthenticationEntryPoint authenticationEntryPoint;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    // Disable CSRF (cross site request forgery)
    http.csrf(AbstractHttpConfigurer::disable);

    // No session will be created or used by spring security
    http.sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    // If a user try to access a resource without having enough permissions
//    http.exceptionHandling(customizer -> customizer.authenticationEntryPoint(authenticationEntryPoint));

    // Entry points
    http.authorizeHttpRequests((requests) -> requests
            .requestMatchers(HttpMethod.GET, "/user/**").permitAll()
            .requestMatchers(HttpMethod.PATCH, "/user/**").permitAll()
            .requestMatchers(HttpMethod.DELETE, "/user/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/auth/refresh").permitAll()
            .requestMatchers(HttpMethod.GET, "/auth/signout").permitAll()
            .requestMatchers(HttpMethod.POST, "/auth/signin").permitAll()
            .requestMatchers(HttpMethod.POST, "/auth/signup").permitAll()
            .requestMatchers(HttpMethod.GET, "/project/**").permitAll()
        // Disallow everything else..
            .anyRequest()
            .authenticated());

    // Optional, if you want to test the API from a browser
    // http.httpBasic();

    return http.build();
  }
}
