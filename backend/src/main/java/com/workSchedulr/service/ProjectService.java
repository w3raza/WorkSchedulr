package com.workSchedulr.service;

import com.workSchedulr.exception.ProjectNotFoundException;
import com.workSchedulr.model.Project;
import com.workSchedulr.repository.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId).orElseThrow(ProjectNotFoundException::new);
    }

    public Page<Project> getProjectsByParams(UUID userId, Boolean status, String title, Pageable pageable) {
        if (userId != null) {
            if (status != null) {
                return title == null || title.isEmpty() ?
                        projectRepository.findAllByUsersAndStatus(userId, status, pageable) :
                        projectRepository.findAllByUsersAndStatusAndTitleContaining(userId, status, title, pageable);
            } else {
                return title == null || title.isEmpty() ?
                        projectRepository.findAllProjectsByUserId(userId, pageable) :
                        projectRepository.findAllByUsersAndTitleContaining(userId, title, pageable);
            }
        } else if (status != null) {
            return title == null || title.isEmpty() ?
                    projectRepository.findAllByStatus(status, pageable) :
                    projectRepository.findAllByStatusAndTitleContaining(status, title, pageable);
        } else {
            return title == null || title.isEmpty() ?
                    getAllProjects(pageable) :
                    projectRepository.findAllByTitleContaining(title, pageable);
        }
    }

    public Page<Project> getAllProjects(Pageable pageable){
        return projectRepository.findAll(pageable);
    }

    public Project createProject(Project project){
        project.setCreatedDate(LocalDateTime.now());
        if(project.getOwner() == null){
            project.setOwner(userService.getCurrentUser());
        }
        return projectRepository.save(project);
    }

    public Project updateProject(Project updatedProject){
        Project project = getProjectById(updatedProject.getId());

        Optional.ofNullable(updatedProject.getTitle()).ifPresent(project::setTitle);
        Optional.ofNullable(updatedProject.getHours()).ifPresent(project::setHours);
        project.setStatus(updatedProject.isStatus());
        Optional.ofNullable(updatedProject.getOwner()).ifPresent(project::setOwner);
        Optional.ofNullable(updatedProject.getManagers()).ifPresent(project::setManagers);
        Optional.ofNullable(updatedProject.getUsers()).ifPresent(project::setUsers);

        return projectRepository.save(project);
    }

    public void deleteProject(UUID id) {
        projectRepository.findById(id).orElseThrow(ProjectNotFoundException::new);
        projectRepository.deleteById(id);
    }
}
