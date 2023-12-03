package com.workSchedulr.dto;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class BillDTO {
    private UUID id;
    private String filename;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private String url;
    private UUID userId;
}
