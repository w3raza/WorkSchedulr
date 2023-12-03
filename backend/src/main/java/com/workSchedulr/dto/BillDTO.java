package com.workSchedulr.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class BillDTO {
    private UUID id;
    private String filename;
    private String startDate;
    private String endDate;
    private UUID userId;
}
