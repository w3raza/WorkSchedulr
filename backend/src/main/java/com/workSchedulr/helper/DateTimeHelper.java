package com.workSchedulr.helper;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class DateTimeHelper {
    public static ZonedDateTime convertLocalDateToZonedDateTime(LocalDate date){
        return date.atStartOfDay(ZoneId.systemDefault());
    }
}
