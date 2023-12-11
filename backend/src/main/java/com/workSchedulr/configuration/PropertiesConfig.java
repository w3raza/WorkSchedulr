package com.workSchedulr.configuration;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Getter
@Configuration
@PropertySource("classpath:taxes.properties")
public class PropertiesConfig {
    /**
     * Maximum age for tax credit
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.wiek-dla-ulgi-studenta}")
    private int STUDENT_AGE;

    /**
     * Max gross amount for taxation "Ryczalt"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.kwota-ryczalt}")
    private int KWOTA_RYCZALT;

    /**
     * Tax as a percentage needed to calculate "zaliczkaUS"
     *  for "Umowa Zlecenie"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.proc-kosztu-uzyskania}")
    private double ZLECENIE_PODATEK;

    /**
     * Tax as a percentage needed to calculate "koszt uzyskania przychodu"
     * for "Umowa Zlecenie" and "Student"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.student.proc-kosztu-uzyskania}")
    private double ZLECENIE_PODATEK_STUDENT;

    /**
     * Tax as a percentage needed to calculate "zaliczkaUS"
     * for "Umowa Zlecenie" and "Student"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.student.podstawa-opodatkowania}")
    private double ZLECENIE_STUDENT_PODSTAWA_OPODATKOWANIA;

    /**
     * The percentage needed to calculate "skladka emerytalna"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.skladka-emerytalna}")
    private double SKLADKA_EMERYTALNA;

    /**
     * The percentage needed to calculate "skladka ubezpieczenia zdrtowotnego"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.skladka-ubez-zdrowotne}")
    private double SKLADKA_UBEZ_ZRTOWOTNE;

    /**
     * The percentage needed to calculate "ubezpieczenie podlegające odliczeniu"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.skladka-ubez-zdrowotne-odliczenie}")
    private double SKLADKA_UBEZ_ZRTOWOTNE_ODLICZENIE;

    /**
     * The percentage needed to calculate "skladka ubezpieczenia rentowego"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.skladka-rentowa}")
    private double SKLADKA_UBEZ_RENTOWEGO;

    /**
     * The percentage needed to calculate "skladka ubezpieczenia chorobowego"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.skladka-ubez-chorobowego}")
    private double SKLADKA_UBEZ_CHOROBOWEGO;

    /**
     * Tax as a percentage for taxation "Ryczalt"
     * to calculate "zaliczkaUS"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zlecenie.ryczalt.proc}")
    private double RYCZALT;

    /**
     * Tax as a percentage needed to calculate "podatek Vat"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.vat}")
    private double VAT;

    /**
     * Tax as a percentage needed to calculate "podatek Vat"
     * */
    @SuppressWarnings("squid:S116")
    @Value("${tax.zero-vat}")
    private double ZERO_VAT;

    @Value("${tax.podatek-dochodowy}")
    private double TAX_RATE;
}
