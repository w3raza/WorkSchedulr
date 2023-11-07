package com.workSchedulr.mapper;

import com.workSchedulr.dto.ProjectDTO;
import com.workSchedulr.model.Project;
import org.mapstruct.Mapper;

import java.util.UUID;

@Mapper(imports = UUID.class, componentModel = "spring", uses = { UserMapper.class})
public abstract class ProjectMapper {
    public abstract Project mapToProject(ProjectDTO projectDTO);
}
