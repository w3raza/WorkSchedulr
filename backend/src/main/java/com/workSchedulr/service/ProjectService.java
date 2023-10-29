package com.workSchedulr.service;

import com.workSchedulr.model.Project;
import com.workSchedulr.repository.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public Page<Project> getProjectByUserId(UUID userId, Pageable pageable){
        if(userId != null) {
            return projectRepository.findAllProjectsByUserId(userId, pageable);
        }else{
            return getAllProjects(pageable);
        }
    }

    public Page<Project> getAllProjects(Pageable pageable){
        return projectRepository.findAll(pageable);
    }

    public Project createProject(Project project){
        project.setCreatedDate(Instant.now());
        if(project.getOwner() == null){
            project.setOwner(userService.getCurrentUser());
        }
        return projectRepository.save(project);
    }
}
