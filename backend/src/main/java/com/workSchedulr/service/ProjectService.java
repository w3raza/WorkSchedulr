package com.workSchedulr.service;

import com.workSchedulr.model.Project;
import com.workSchedulr.repository.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ProjectService {
    private ProjectRepository projectRepository;
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
}
