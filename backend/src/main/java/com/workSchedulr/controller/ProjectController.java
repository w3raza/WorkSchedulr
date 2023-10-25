package com.workSchedulr.controller;

import com.workSchedulr.model.Project;
import com.workSchedulr.model.User;
import com.workSchedulr.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/project")
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping("{userId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Set<Project>> getProjectByUserId(@PathVariable("userId") UUID userId){
        return ResponseEntity.ok(projectService.getProjectByUserId(userId));
    }
}
