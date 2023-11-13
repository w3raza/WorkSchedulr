package com.workSchedulr.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Size(min = 5, max = 255, message = "Minimum title length: 5 characters")
    String title;

    @NotNull(message = "Time of start, can't be null")
    private LocalDateTime startTime;

    @NotNull(message = "Time of end, can't be null")
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    Project project;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User owner;
}
