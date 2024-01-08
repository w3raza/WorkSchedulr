package com.workSchedulr.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

import com.workSchedulr.exception.ProjectNotFoundException;
import com.workSchedulr.exception.UserUnAuthorizedException;
import com.workSchedulr.model.Project;
import com.workSchedulr.model.User;
import com.workSchedulr.model.UserRole;
import com.workSchedulr.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.*;

public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private ProjectService projectService;

    private UUID projectId;
    private Project project;
    private User user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        projectId = UUID.randomUUID();
        project = new Project();
        project.setId(projectId);
        project.setTitle("Test Project");
        project.setCreatedDate(LocalDateTime.now());
        project.setStatus(true);

        user = new User();
        user.setId(UUID.randomUUID());
        user.setUserRoles(Collections.singleton(UserRole.ROLE_USER));
    }

    @Test
    public void whenGetProjectById_thenReturnProject() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        Project foundProject = projectService.getProjectById(projectId);
        assertNotNull(foundProject);
        assertEquals(projectId, foundProject.getId());
    }

    @Test
    public void whenGetProjectById_thenThrowException() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());
        assertThrows(ProjectNotFoundException.class, () -> projectService.getProjectById(projectId));
    }

    @Test
    public void whenGetProjectsByParams_thenReturnPage() {
        Page<Project> expectedPage = new PageImpl<>(Collections.singletonList(project));
        when(userService.getCurrentUser()).thenReturn(user);
        //TODO
    }

    @Test
    public void whenGetProjectsByParams_thenUserUnAuthorizedException() {
        when(userService.getCurrentUser()).thenReturn(null);
        //TODO
    }

    @Test
    public void whenCreateProject_thenReturnSavedProject() {
        when(userService.getCurrentUser()).thenReturn(user);
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Project createdProject = projectService.createProject(new Project());
        assertNotNull(createdProject);
    }

    @Test
    public void whenUpdateProject_thenReturnUpdatedProject() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Project updatedProject = new Project();
        updatedProject.setId(projectId);
        updatedProject.setTitle("Updated Project");

        Project result = projectService.updateProject(updatedProject);
        assertNotNull(result);
        assertEquals("Updated Project", result.getTitle());
    }

    @Test
    public void whenDeleteProject_thenSuccess() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        doNothing().when(projectRepository).deleteById(projectId);

        assertDoesNotThrow(() -> projectService.deleteProject(projectId));
        verify(projectRepository, times(1)).deleteById(projectId);
    }

    @Test
    public void whenDeleteProject_thenThrowException() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        assertThrows(ProjectNotFoundException.class, () -> projectService.deleteProject(projectId));
    }
}
