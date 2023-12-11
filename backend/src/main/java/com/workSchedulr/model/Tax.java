package com.workSchedulr.model;

import lombok.Data;

@Data
public class Tax {
    private Double grossSalary; //Wynagrodzenie brutto
    private Double costOfIncome; //Koszty uzyskania
    private Double ZUSContribution; //Składka ZUS
    private Double taxAdvanceToTaxOffice; //Zaliczka podatku do Urząd Skarbowy
    private Double healthInsurance; //Ubezpieczenie zdrowotne
    private Double sicknessInsurance; //Ubezpiecznie chorobowe
    private Double retirementInsurance; //Ubzepieczenie emrytalne
    private Double disabilityPensionInsurance; //Ubzepieczenie Rentowe
    private Double taxDeductible; //Podlega odliczeniu
    private Double taxBase; //Podstawa do opodatkowania
    private Double netSalary; //Wynagrodznie netto
    private Double vatLevel; //procent vatu
    private Double sumVat; //suma vatu
}
