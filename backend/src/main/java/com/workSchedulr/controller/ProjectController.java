package com.workSchedulr.controller;

import com.workSchedulr.dto.ProjectDTO;
import com.workSchedulr.mapper.ProjectMapper;
import com.workSchedulr.model.Project;
import com.workSchedulr.service.ProjectService;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
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
    public ResponseEntity<Page<Project>> getProjectsByParams(@Nullable @RequestParam("userId") UUID userId,
                                                             @Nullable @RequestParam Boolean status,
                                                             @Nullable @RequestParam String title, Pageable pageable){
        return ResponseEntity.ok(projectService.getProjectsByParams(userId, status, title, pageable));
    }

    @PostMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createProject(@RequestBody ProjectDTO projectDTO){
        Project project = projectMapper.mapToProject(projectDTO);
        return ResponseEntity.ok(projectService.createProject(project));
    }

    @PatchMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateProject(@RequestBody ProjectDTO projectDTO){
        Project project = projectMapper.mapToProject(projectDTO);
        return ResponseEntity.ok(projectService.updateProject(project));
    }

    @DeleteMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProject(@NotNull @RequestParam UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok("Delete project.");
    }
}
