package com.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

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

    private boolean status;

    private Long numberOfHour;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<UUID> userIds = new HashSet<>();
}
