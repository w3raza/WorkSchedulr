package com.workSchedulr.model;

public enum FormOfContract {
    MANDATE_CONTRACT("mandate contract"),
    BUSINESS_ACTIVITY("business activity"),
    EMPLOYMENT_CONTRACT("employment contract");

    private final String formOfContract;

    FormOfContract(String formOfContract) {
        this.formOfContract = formOfContract;
    }

    public String getFormOfContract(){
        return formOfContract;
    }
}
