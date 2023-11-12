package com.workSchedulr.mapper;

import com.workSchedulr.dto.UserDTO;
import com.workSchedulr.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.UUID;

@Mapper(imports = UUID.class, componentModel = "spring")
public abstract class UserMapper {
    @Mapping(target = "password", ignore = true)
    @Named("mapToUser")
    public abstract User mapToUser(UserDTO userDTO);
}
