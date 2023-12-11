package com.workSchedulr.controller;

import com.workSchedulr.dto.BillDTO;
import com.workSchedulr.model.Bill;
import com.workSchedulr.model.FormOfContract;
import com.workSchedulr.service.BillService;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    public ResponseEntity<Page<BillDTO>> getBillsByDateAndUser(@RequestParam(value = "page", defaultValue = "0") int page,
                                                               @RequestParam(value = "size", defaultValue = "10") int size,
                                                               @RequestParam(value = "sort", defaultValue = "filename") String sort,
                                                               @Nullable @RequestParam("userId") UUID userId,
                                                               @Nullable @RequestParam("type") FormOfContract formOfContract,
                                                               @NotNull @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                               @NotNull @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<BillDTO> bills = billService.getBillsByDateAndUser(userId, formOfContract, startDate, endDate, pageable);
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
