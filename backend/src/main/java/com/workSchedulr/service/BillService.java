package com.workSchedulr.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.workSchedulr.exception.BillNotFoundException;
import com.workSchedulr.helper.DateTimeHelper;
import com.workSchedulr.model.Bill;
import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.model.User;
import com.workSchedulr.repository.BillRepository;
import com.workSchedulr.repository.CalendarEventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class BillService {
    private final BillRepository billRepository;
    private final UserService userService;
    private final CalendarEventRepository calendarEventRepository;

    public Bill getBillById(UUID id) {
        return billRepository.findById(id).orElseThrow(BillNotFoundException::new);
    }

    public List<Bill> getBillsByDateAndUser(UUID userId, LocalDate startDate, LocalDate endDate) {
        if(userId != null){
            return billRepository.findBillsByUserIdAndDateRange(userId, startDate, endDate);
        }else {
            return billRepository.findBillsByDateRange(startDate, endDate);
        }
    }

    public void regenerateBillForUser(UUID userId, LocalDate startDate, LocalDate endDate){
        User user = userService.getUserById(userId);

        List<CalendarEvent> events = calendarEventRepository.findEventsByUserAndDateRange(
                user.getId(),
                DateTimeHelper.convertLocalDateToZonedDateTime(startDate) ,
                DateTimeHelper.convertLocalDateToZonedDateTime(endDate)
        );
        double hours = events.stream()
                .mapToDouble(event -> Duration.between(event.getStart(), event.getEnd()).toHours())
                .sum();

        Bill bill = new Bill();
        bill.setStartDate(ZonedDateTime.now().withDayOfMonth(1));
        bill.setEndDate(ZonedDateTime.now().withDayOfMonth(ZonedDateTime.now().toLocalDate().lengthOfMonth()));
        bill.setFilename(user.getLastName() + "_Bill_" + LocalDate.now() + ".pdf");
        bill.setFileData(generatePdf(user, hours));

        billRepository.save(bill);
    }

    public void generateBills(){
        //implement generating bills for all user that have status enable once in month
    }

    public byte[] generatePdf(User user, double hours) {
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
