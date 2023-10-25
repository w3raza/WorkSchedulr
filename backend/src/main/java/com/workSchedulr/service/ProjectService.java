package com.workSchedulr.service;

import com.workSchedulr.model.Project;
import com.workSchedulr.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class ProjectService {
    private ProjectRepository projectRepository;
    public Set<Project> getProjectByUserId(UUID userId){
        return projectRepository.findByUserId(userId);
    }
}
