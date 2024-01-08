package com.workSchedulr.service;

import com.workSchedulr.dto.BillDTO;
import com.workSchedulr.exception.BillNotFoundException;
import com.workSchedulr.model.Bill;
import com.workSchedulr.model.FormOfContract;
import com.workSchedulr.model.User;
import com.workSchedulr.repository.BillRepository;
import com.workSchedulr.repository.CalendarEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BillServiceTest {

    @Mock
    private BillRepository billRepository;

    @Mock
    private UserService userService;

    @Mock
    private CalendarEventRepository calendarEventRepository;

    @InjectMocks
    private BillService billService;

    private UUID billId;
    private Bill bill;

    @BeforeEach
    public void setUp() {
        billId = UUID.randomUUID();
        bill = new Bill();
        bill.setId(billId);
    }

    @Test
    public void whenGetBillById_thenSuccess() {
        when(billRepository.findById(billId)).thenReturn(java.util.Optional.of(bill));
        Bill foundBill = billService.getBillById(billId);
        assertNotNull(foundBill);
        assertEquals(billId, foundBill.getId());
    }

    @Test
    public void whenGetBillById_thenThrowBillNotFoundException() {
        when(billRepository.findById(billId)).thenReturn(Optional.empty());
        assertThrows(BillNotFoundException.class, () -> billService.getBillById(billId));
    }

    @Test
    public void whenGetBillsByDateAndUser_thenSuccess() {
//        Page<Bill> billPage = new PageImpl<>(Collections.singletonList(bill));
//        when(billRepository.findBillsByUserIdAndDateRange(any(), any(), any(), any())).thenReturn(billPage);
//
//        Page<BillDTO> billDTOPage = billService.getBillsByDateAndUser(UUID.randomUUID(), FormOfContract.EMPLOYMENT_CONTRACT, LocalDate.now(), LocalDate.now().plusDays(1), Pageable.unpaged());
//        assertFalse(billDTOPage.isEmpty());
    }

    @Test
    public void whenGeneratePdf_thenSuccess() {
        Bill bill = new Bill();
        bill.setUserId(new User().getId());
        bill.setStartDate(LocalDate.now());
        bill.setEndDate(LocalDate.now().plusDays(1));
        ByteArrayOutputStream mockedPdfOutputStream = new ByteArrayOutputStream();
        mockedPdfOutputStream.writeBytes("PDF CONTENT".getBytes());
        bill.setFileData(mockedPdfOutputStream.toByteArray());

        assertNotNull(bill.getFileData());
        assertTrue(bill.getFileData().length > 0);
    }

    @Test
    public void whenGenerateBills_thenSuccess() {
        // Uzupełnij test
    }

    @Test
    public void whenGenerateBillForUserWithUserId_thenSuccess() {
        // Uzupełnij test
    }

    @Test
    public void whenGenerateBillForUserWithUserObject_thenSuccess() {
        // Uzupełnij test
    }

    @Test
    public void whenRegenerateBillForUser_thenSuccess() {
        // Uzupełnij test
    }

    @Test
    public void whenRegenerateBillForUser_thenThrowResponseStatusException() {
        // Uzupełnij test
    }
}
