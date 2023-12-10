package com.workSchedulr.model;

public enum FormOfContract {
    MANDATE_CONTRACT("Umowa zlecenie"),
    BUSINESS_ACTIVITY("Działalność gospodarcza");

    private final String formOfContract;

    FormOfContract(String formOfContract) {
        this.formOfContract = formOfContract;
    }

    public String getFormOfContract(){
        return formOfContract;
    }
}
