package com.workSchedulr.controller;

import com.workSchedulr.dto.ProjectDTO;
import com.workSchedulr.mapper.ProjectMapper;
import com.workSchedulr.model.Project;
import com.workSchedulr.service.ProjectService;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/project")
public class ProjectController {
    private final ProjectService projectService;
    private final ProjectMapper projectMapper;

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Page<Project>> getProjectByUserId(@Nullable @RequestParam("userId") UUID userId, Pageable pageable){
        return ResponseEntity.ok(projectService.getProjectByUserId(userId, pageable));
    }

    @PostMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createProject(@RequestBody ProjectDTO projectDTO){
        Project project = projectMapper.mapToProject(projectDTO);
        return ResponseEntity.ok(projectService.createProject(project));
    }
}
