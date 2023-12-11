package com.workSchedulr.mapper;

import org.mapstruct.Mapper;

import java.util.UUID;

@Mapper(imports = UUID.class, componentModel = "spring")
public abstract class BillMapper {
}
