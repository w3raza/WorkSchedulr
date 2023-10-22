package com.project.controller;

import com.project.dto.UserDto;
import com.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/project")
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping("{userId}")
    public ResponseEntity<List<UserDto>> getUserById(@PathVariable("userId") UUID projectId){
        return ResponseEntity.ok(projectService.getUsersForProject(projectId));
    }
}
