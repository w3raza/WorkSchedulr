package com.workSchedulr.controller;

import com.workSchedulr.dto.BillDTO;
import com.workSchedulr.model.Bill;
import com.workSchedulr.service.BillService;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Log
@RestController
@AllArgsConstructor
@RequestMapping("/bill")
public class BillController {
    private final BillService billService;

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')" +
            " or hasRole('ROLE_PROJECT_MANAGER')" +
            " or hasRole('ROLE_DEVELOPER')")
    public ResponseEntity<List<BillDTO>> getBillsByDateAndUser(@Nullable @RequestParam("userId") UUID userId,
                                                            @NotNull @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @NotNull @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<BillDTO> bills = billService.getBillsByDateAndUser(userId, startDate, endDate);
        if (bills.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(bills);
        }
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')" +
            " or hasRole('ROLE_PROJECT_MANAGER')" +
            " or hasRole('ROLE_DEVELOPER')")
    public ResponseEntity<?> downloadBillFile(@PathVariable UUID id) {
        Bill bill = billService.getBillById(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + bill.getFilename() + "\"")
                .body(bill.getFileData());
    }

    @GetMapping("/generate")
    @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
    public ResponseEntity<?> generateBill(@NotNull @RequestParam("userId") UUID userId,
                                            @NotNull @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                            @NotNull @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        billService.generateBillForUser(userId, startDate, endDate);
        return ResponseEntity.ok("Bill regenerate successfully!");
    }

    @GetMapping("/regenerate/{id}")
    @PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
    public ResponseEntity<?> regenerateBill(@NotNull @PathVariable UUID id) {
        billService.regenerateBillForUser(id);
        return ResponseEntity.ok("Bill regenerate successfully!");
    }

    @Scheduled(cron = "0 0 12 1 * *")
    @PostMapping("/generate/all")
    public void generateBills(){
        log.info("Starting Bill generation Task ");
        billService.generateBills();
        log.info("Ending with success Bill generation Task");
    }
}
