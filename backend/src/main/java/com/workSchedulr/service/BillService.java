package com.workSchedulr.service;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.workSchedulr.configuration.PropertiesConfig;
import com.workSchedulr.dto.BillDTO;
import com.workSchedulr.exception.BillNotFoundException;
import com.workSchedulr.helper.DateTimeHelper;
import com.workSchedulr.model.*;
import com.workSchedulr.repository.BillRepository;
import com.workSchedulr.repository.CalendarEventRepository;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Log
@Service
@AllArgsConstructor
public class BillService {
    private final BillRepository billRepository;
    private final UserService userService;
    private final CalendarEventRepository calendarEventRepository;

    private final PropertiesConfig propertiesConfig;

    public Bill getBillById(UUID id) {
        return billRepository.findById(id).orElseThrow(BillNotFoundException::new);
    }

    public Page<BillDTO> getBillsByDateAndUser(UUID userId, FormOfContract formOfContract, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Page<Bill> bills;
        if (formOfContract != null) {
            if (userId != null) {
                bills = billRepository.findBillsByUserIdAndFormOfContractAndDateRange(userId, formOfContract, startDate, endDate, pageable);
            } else {
                bills = billRepository.findBillsByFormOfContractAndDateRange(formOfContract, startDate, endDate, pageable);
            }
        } else {
            if (userId != null) {
                bills = billRepository.findBillsByUserIdAndDateRange(userId, startDate, endDate, pageable);
            } else {
                bills = billRepository.findBillsByDateRange(startDate, endDate, pageable);
            }
        }
        return bills.map(this::mapToFileResponse);
    }

    public void generateBills(){
        LocalDate end = LocalDate.now().withDayOfMonth(1);
        LocalDate start = end.minusMonths(1);

        List<User> users = userService.getAllUsers();
        users.forEach(user -> {
            try {
                generateBillForUser(user, start, end);
            }catch(Exception e){
                log.warning(e.getMessage());
            }
        });
    }

    public void generateBillForUser(UUID userId, LocalDate startDate, LocalDate endDate){
        User user = userService.getUserById(userId);
        generateBillForUser(user, startDate, endDate);
    }

    private void generateBillForUser(User user, LocalDate startDate, LocalDate endDate){
        Bill bill = new Bill();
        fillAndSaveBill(bill, user, startDate, endDate);
    }

    private void fillAndSaveBill(Bill bill, User user, LocalDate startDate, LocalDate endDate){
        bill.setFilename(user.getLastName() + "_Bill_" + LocalDate.now() + ".pdf");
        bill.setStartDate(startDate);
        bill.setEndDate(endDate);
        bill.setUserId(user.getId());
        bill.setFormOfContract(user.getFormOfContract());
        bill.setFileData(generatePdf(user, bill));

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

        fillAndSaveBill(bill, user, startDate, endDate);
    }

    private BillDTO mapToFileResponse(Bill bill) {
        BillDTO billDTO = new BillDTO();
        billDTO.setId(bill.getId());
        billDTO.setFilename(bill.getFilename());
        billDTO.setStartDate(bill.getStartDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        billDTO.setEndDate(bill.getEndDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        billDTO.setUserId(bill.getUserId());
        billDTO.setFormOfContract(bill.getFormOfContract());

        return billDTO;
    }

    private double getHours(LocalDate startDate, LocalDate endDate, UUID userId) {
        List<CalendarEvent> events = calendarEventRepository.findEventsByUserAndDateRange(
                userId,
                DateTimeHelper.convertLocalDateToZonedDateTime(startDate) ,
                DateTimeHelper.convertLocalDateToZonedDateTime(endDate)
        );
        if(events.isEmpty()){
            return 0.0;
        }else {
            return events.stream()
                    .mapToDouble(event -> Duration.between(event.getStart(), event.getEnd()).toHours())
                    .sum();
        }
    }

    private byte[] generatePdf(User user, Bill bill) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            Document document = new Document(new PdfDocument(new PdfWriter(byteArrayOutputStream)));
            document.setFont(font);
            fillDocumentBasedOnFormOfContract(document, user, bill);
            document.close();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot generate pdf");
        }

        return byteArrayOutputStream.toByteArray();
    }

    private void fillDocumentBasedOnFormOfContract(Document document, User user, Bill bill) throws IOException {
        double hours = getHours(bill.getStartDate(), bill.getEndDate(), user.getId());
        Tax tax = calculateTax(hours, user, bill);

        addDateToDocument(document);
        addHeaderToDocument(document, bill);
        addUserDataToDocument(document, user, hours, bill);
        addTaxDataToDocument(document, tax);
    }

    private Tax calculateTax(double hours, User user, Bill bill) {
        Tax tax = new Tax();
        if(user.getHourlyRate() == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Missing hourly rate for: " + user.getLastName());
        }
        tax.setGrossSalary(hours * user.getHourlyRate());

        switch (bill.getFormOfContract()) {
            case MANDATE_CONTRACT -> {
                if (user.isStudent()) {
                    countingTaxesForBillStudentMandateContract(tax, user.getBirth());
                } else {
                    countingTaxesForBillMandateContract(tax, user.getBirth());
                }}
            case BUSINESS_ACTIVITY -> countingTaxesForBillBusinessActivity(tax);
            case EMPLOYMENT_CONTRACT -> countingTaxesForEmploymentContract(tax);
        }

        return tax;
    }

    private void addHeaderToDocument(Document document, Bill bill) throws IOException {
        Paragraph header = new Paragraph("Bill for " + bill.getFormOfContract().getFormOfContract())
                .setFont(PdfFontFactory.createFont(StandardFonts.TIMES_BOLD))
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(14)
                .setBold();
        document.add(header);
    }

    private void addDateToDocument(Document document) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String dateStr = LocalDate.now().format(dateFormatter);

        Paragraph dateParagraph = new Paragraph(dateStr)
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontSize(10);
        document.add(dateParagraph);
    }

    private void addUserDataToDocument(Document document, User user, double hours, Bill bill) throws IOException {
        document.add(createParagraph("User: ", user.getFirstName() + " " + user.getLastName()));
        document.add(createParagraph("Number of hours: ", String.valueOf(hours)));
        document.add(createParagraph("Hourly rate: ", String.valueOf(user.getHourlyRate())));

        if (bill.getStartDate() != null && bill.getEndDate() != null) {
            document.add(createParagraph("Date of Work Completion: ", bill.getStartDate() + " - " + bill.getEndDate()));
        }
    }

    private void addTaxDataToDocument(Document document, Tax tax) throws IOException {
        if (tax.getGrossSalary() != null) {
            document.add(createParagraph("Gross salary: ", roundDoubleToTwoDecimalPlaces(tax.getGrossSalary())));
        }
        if (tax.getCostOfIncome() != null) {
            document.add(createParagraph("Cost of income: ", roundDoubleToTwoDecimalPlaces(tax.getCostOfIncome())));
        }
        if (tax.getZUSContribution() != null) {
            document.add(createParagraph("Social Insurance Institution (ZUS) contribution: ", roundDoubleToTwoDecimalPlaces(tax.getZUSContribution())));
        }
        if (tax.getRetirementInsurance() != null) {
            document.add(createParagraph("Including pension insurance: ", roundDoubleToTwoDecimalPlaces(tax.getRetirementInsurance())));
        }
        if (tax.getDisabilityPensionInsurance() != null) {
            document.add(createParagraph("Disability insurance: ", roundDoubleToTwoDecimalPlaces(tax.getDisabilityPensionInsurance())));
        }
        if (tax.getSicknessInsurance() != null) {
            document.add(createParagraph("Sickness insurance: ", roundDoubleToTwoDecimalPlaces(tax.getSicknessInsurance())));
        }
        if (tax.getHealthInsurance() != null) {
            document.add(createParagraph("Health insurance: ", roundDoubleToTwoDecimalPlaces(tax.getHealthInsurance())));
        }
        if (tax.getTaxBase() != null) {
            document.add(createParagraph("Tax base: ", roundDoubleToTwoDecimalPlaces(tax.getTaxBase())));
        }
        if (tax.getTaxDeductible() != null) {
            document.add(createParagraph("Subject to deduction: ", roundDoubleToTwoDecimalPlaces(tax.getTaxDeductible())));
        }
        if (tax.getTaxAdvanceToTaxOffice() != null) {
            document.add(createParagraph("Tax advance to the Tax Office: ", roundDoubleToTwoDecimalPlaces(tax.getTaxAdvanceToTaxOffice())));
        }
        if (tax.getVatLevel() != null) {
            document.add(createParagraph("Vat level: ", roundDoubleToTwoDecimalPlaces(tax.getVatLevel())));
        }
        if (tax.getSumVat() != null) {
            document.add(createParagraph("Sum vat: ", roundDoubleToTwoDecimalPlaces(tax.getSumVat())));
        }
        if (tax.getNetSalary() != null) {
            document.add(createParagraph("To be paid out: ", roundDoubleToTwoDecimalPlaces(tax.getNetSalary())));
        }
    }

    private void countingTaxesForBillStudentMandateContract(Tax tax, LocalDate birthDate){
        boolean taxCreditDueToAge = taxCreditDueToAge(birthDate);

        tax.setCostOfIncome(tax.getGrossSalary() * propertiesConfig.getZLECENIE_PODATEK_STUDENT());
        if(!taxCreditDueToAge){
            tax.setRetirementInsurance(tax.getGrossSalary() * propertiesConfig.getSKLADKA_EMERYTALNA());
            tax.setDisabilityPensionInsurance(tax.getGrossSalary() * propertiesConfig.getSKLADKA_UBEZ_RENTOWEGO());
            tax.setSicknessInsurance(propertiesConfig.getSKLADKA_UBEZ_CHOROBOWEGO());
        }else{
            tax.setRetirementInsurance(0.0);
            tax.setDisabilityPensionInsurance(0.0);
            tax.setSicknessInsurance(0.0);
        }

        tax.setZUSContribution(tax.getRetirementInsurance() + tax.getDisabilityPensionInsurance() + tax.getSicknessInsurance());

        if (tax.getGrossSalary() <= propertiesConfig.getKWOTA_RYCZALT()) {
            tax.setTaxBase(tax.getGrossSalary());
        } else {
            tax.setTaxBase(tax.getGrossSalary() - tax.getCostOfIncome() - tax.getZUSContribution());
        }

        tax.setTaxAdvanceToTaxOffice(tax.getTaxBase() * propertiesConfig.getZLECENIE_STUDENT_PODSTAWA_OPODATKOWANIA());
        tax.setTaxBase(tax.getTaxBase());
        tax.setNetSalary(tax.getGrossSalary() - tax.getTaxAdvanceToTaxOffice());
    }

    private void countingTaxesForBillMandateContract(Tax tax, LocalDate birthDate){
        boolean taxCreditDueToAge = taxCreditDueToAge(birthDate);

        tax.setRetirementInsurance(tax.getGrossSalary() * propertiesConfig.getSKLADKA_EMERYTALNA());
        tax.setDisabilityPensionInsurance(tax.getGrossSalary() * propertiesConfig.getSKLADKA_UBEZ_RENTOWEGO());
        tax.setSicknessInsurance(propertiesConfig.getSKLADKA_UBEZ_CHOROBOWEGO());
        tax.setZUSContribution(tax.getRetirementInsurance() + tax.getDisabilityPensionInsurance() + tax.getSicknessInsurance()
        );
        tax.setHealthInsurance(((tax.getGrossSalary() - tax.getZUSContribution())) * propertiesConfig.getSKLADKA_UBEZ_ZRTOWOTNE());
        tax.setCostOfIncome(tax.getHealthInsurance() + tax.getRetirementInsurance());

        tax.setTaxDeductible((tax.getGrossSalary() - tax.getZUSContribution()) * propertiesConfig.getSKLADKA_UBEZ_ZRTOWOTNE_ODLICZENIE());

        if (taxCreditDueToAge) {
            tax.setTaxAdvanceToTaxOffice(0.0);
        } else {
            tax.setTaxAdvanceToTaxOffice(((tax.getCostOfIncome() - tax.getRetirementInsurance() - tax.getDisabilityPensionInsurance()) * (1 - propertiesConfig.getZLECENIE_PODATEK())));
        }

        if (tax.getGrossSalary() <= propertiesConfig.getKWOTA_RYCZALT()) {
            tax.setTaxBase(tax.getGrossSalary());
            if (!taxCreditDueToAge) {
                tax.setTaxAdvanceToTaxOffice(tax.getGrossSalary() * propertiesConfig.getRYCZALT());
            }
        } else {
            tax.setTaxBase(tax.getGrossSalary() - tax.getCostOfIncome() - tax.getZUSContribution());
        }

        tax.setNetSalary(tax.getGrossSalary() - tax.getZUSContribution() - tax.getHealthInsurance() - tax.getTaxAdvanceToTaxOffice());
    }

    private void countingTaxesForBillBusinessActivity(Tax tax){
        tax.setVatLevel(propertiesConfig.getVAT());
        tax.setNetSalary(tax.getGrossSalary());
        tax.setSumVat(tax.getNetSalary() * propertiesConfig.getVAT());
        tax.setGrossSalary(tax.getNetSalary() + tax.getSumVat());
    }

    private void countingTaxesForEmploymentContract(Tax tax) {
        double grossSalary = tax.getGrossSalary();

        double retirementInsurance = grossSalary * propertiesConfig.getSKLADKA_EMERYTALNA();
        double disabilityPensionInsurance = grossSalary * propertiesConfig.getSKLADKA_UBEZ_RENTOWEGO();
        double sicknessInsurance = grossSalary * propertiesConfig.getSKLADKA_UBEZ_CHOROBOWEGO();

        tax.setRetirementInsurance(retirementInsurance);
        tax.setDisabilityPensionInsurance(disabilityPensionInsurance);
        tax.setSicknessInsurance(sicknessInsurance);

        double healthInsuranceContribution = grossSalary * propertiesConfig.getSKLADKA_UBEZ_ZRTOWOTNE();
        tax.setHealthInsurance(healthInsuranceContribution);

        double socialInsuranceContribution = retirementInsurance + disabilityPensionInsurance + sicknessInsurance;
        double taxBase = grossSalary - socialInsuranceContribution;
        tax.setTaxBase(taxBase);

        double taxAdvance = taxBase * propertiesConfig.getTAX_RATE();
        tax.setTaxAdvanceToTaxOffice(taxAdvance);

        double netSalary = grossSalary - socialInsuranceContribution - healthInsuranceContribution - taxAdvance;
        tax.setNetSalary(netSalary);
    }


    private boolean taxCreditDueToAge(LocalDate birthDate) {
        int userAge = Period.between(birthDate, LocalDate.now()).getYears();
        return userAge < propertiesConfig.getSTUDENT_AGE();
    }

    private Paragraph createParagraph(String toBold, String toRegular) throws IOException {
        PdfFont bold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

        Paragraph p = new Paragraph();
        p.add(new Text(toBold).setFont(bold));
        p.add(new Text(toRegular));
        return p;
    }

    private String roundDoubleToTwoDecimalPlaces(Double to){
        BigDecimal db = new BigDecimal(Double.toString(to));
        db = db.setScale(2, RoundingMode.HALF_UP);
        return db.toString();
    }
}
