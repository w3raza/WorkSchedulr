package com.workSchedulr.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Size(min = 2, message = "Minimum title length: 2 characters")
    private String title;

    private Integer hours;

    @CreatedDate
    private LocalDateTime createdDate;

    private boolean status;

    @ManyToOne
    private User owner;

    @ManyToMany(mappedBy = "projects")
    private Set<User> managers = new HashSet<>();

    @ManyToMany(mappedBy = "projects")
    private Set<User> users = new HashSet<>();
}
