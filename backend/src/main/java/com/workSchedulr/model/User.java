package com.workSchedulr.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.*;

@Entity
@Data // Create getters and setters
@Table(name = "users")
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotNull
  @Size(min = 8, message = "Minimum password length: 8 characters")
  private String password;

  @Size(min = 4, max = 255, message = "Minimum username length: 4 characters")
  @Column(unique = true, nullable = false)
  private String email;

  @NotNull
  @Size(min = 2, message = "Minimum first name length: 2 characters")
  private String firstName;

  @NotNull
  @Size(min = 2, message = "Minimum last name length: 2 characters")
  private String lastName;

  @NotNull
  @Size(min = 9, message = "Minimum phone length: 9 characters")
  private String phone;

  @NotNull
  private LocalDate birth;

  private boolean isStudent;

  private boolean status;

  private FormOfContract formOfContract;

  private Double hourlyRate;

  @Enumerated(EnumType.STRING)
  @CollectionTable(name="user_role")
  @ElementCollection(fetch = FetchType.EAGER)
  private Set<UserRole> userRoles = new HashSet<>();

  @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  @JsonIgnore
  private Set<Project> projects = new HashSet<>();

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<CalendarEvent> calendarEvents = new ArrayList<>();

  public User() {
    this.userRoles.add(UserRole.ROLE_USER);
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return userRoles;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  public boolean hasRole(UserRole role) {
    return userRoles.contains(role);
  }

  public List<CalendarEvent> getCalendarEvents(){
    return new ArrayList<>();
  }
}
