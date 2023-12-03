package com.workSchedulr.dto;

import com.workSchedulr.model.BillType;
import lombok.Data;

import java.util.UUID;

@Data
public class BillDTO {
    private UUID id;
    private String filename;
    private String startDate;
    private String endDate;
    private UUID userId;
    private BillType type;
}
