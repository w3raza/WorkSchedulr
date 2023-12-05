package com.workSchedulr.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String filename;

    //@Lob
    @Column(name = "file_data")
    private byte[] fileData;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    private FormOfContract formOfContract;
}
