package com.workSchedulr.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.workSchedulr.dto.BillDTO;
import com.workSchedulr.exception.BillNotFoundException;
import com.workSchedulr.helper.DateTimeHelper;
import com.workSchedulr.model.Bill;
import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.model.User;
import com.workSchedulr.repository.BillRepository;
import com.workSchedulr.repository.CalendarEventRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BillService {
    private final BillRepository billRepository;
    private final UserService userService;
    private final CalendarEventRepository calendarEventRepository;

    public Bill getBillById(UUID id) {
        return billRepository.findById(id).orElseThrow(BillNotFoundException::new);
    }

    public List<BillDTO> getBillsByDateAndUser(UUID userId, LocalDate startDate, LocalDate endDate) {
        List<Bill> bills;
        if(userId != null){
            bills = billRepository.findBillsByUserIdAndDateRange(userId, startDate, endDate);
        }else {
            bills = billRepository.findBillsByDateRange(startDate, endDate);
        }

        return bills.stream().map(this::mapToFileResponse).collect(Collectors.toList());
    }

    public void generateBills(){
        LocalDate end = LocalDate.now().withDayOfMonth(1);
        LocalDate start = end.minusMonths(1);

        List<User> users = userService.getAllUsers();
        users.forEach(user -> generateBillForUser(user, start, end));
    }

    public void generateBillForUser(UUID userId, LocalDate startDate, LocalDate endDate){
        User user = userService.getUserById(userId);
        generateBillForUser(user, startDate, endDate);
    }

    private void generateBillForUser(User user, LocalDate startDate, LocalDate endDate){
        double hours = getHours(startDate, endDate, user.getId());

        Bill bill = new Bill();
        bill.setFilename(user.getLastName() + "_Bill_" + LocalDate.now() + ".pdf");
        bill.setFileData(generatePdf(user, hours));
        bill.setStartDate(startDate);
        bill.setEndDate(endDate);
        bill.setUserId(user.getId());

        billRepository.save(bill);
    }

    public void regenerateBillForUser(UUID id){
        Bill bill = getBillById(id);
        if(bill.getUserId() == null){
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Missing user in bill");
        }
        User user = userService.getUserById(bill.getUserId());
        LocalDate startDate = bill.getStartDate();
        LocalDate endDate = bill.getEndDate();

        double hours = getHours(startDate, endDate, user.getId());

        bill.setFilename(user.getLastName() + "_Bill_" + LocalDate.now() + ".pdf");
        bill.setFileData(generatePdf(user, hours));
        bill.setStartDate(startDate);
        bill.setEndDate(endDate);
        bill.setUserId(user.getId());

        billRepository.save(bill);
    }

    private BillDTO mapToFileResponse(Bill bill) {
        String downloadURL = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/")
                .path(bill.getFilename())
                .toUriString();
        BillDTO billDTO = new BillDTO();
        billDTO.setId(bill.getId());
        billDTO.setFilename(bill.getFilename());
        billDTO.setUrl(downloadURL);

        return billDTO;
    }

    private double getHours(LocalDate startDate, LocalDate endDate, UUID userId) {
        List<CalendarEvent> events = calendarEventRepository.findEventsByUserAndDateRange(
                userId,
                DateTimeHelper.convertLocalDateToZonedDateTime(startDate) ,
                DateTimeHelper.convertLocalDateToZonedDateTime(endDate)
        );
        return events.stream()
                .mapToDouble(event -> Duration.between(event.getStart(), event.getEnd()).toHours())
                .sum();
    }

    private byte[] generatePdf(User user, double hours) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(byteArrayOutputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Rachunek")
                    .setFont(PdfFontFactory.createFont(StandardFonts.TIMES_BOLD))
                    .setFontSize(14)
                    .setBold());

            document.add(new Paragraph("Użytkownik: " + user.getFirstName() + " " + user.getLastName()));
            document.add(new Paragraph("Liczba godzin: " + hours));
            document.add(new Paragraph("Data: " + LocalDate.now()));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return byteArrayOutputStream.toByteArray();
    }
}
