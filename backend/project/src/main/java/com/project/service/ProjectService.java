package com.project.service;

import com.project.dto.UserDto;
import com.project.model.Project;
import com.project.repository.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;

    public List<UserDto> getUsersForProject(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found project with id: " + projectId));
        Set <UUID> userIds = project.getUserIds();

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<List<UserDto>> response = restTemplate.exchange(
                "http://localhost:8081/user?ids=" + userIds.stream().map(Object::toString)
                        .collect(Collectors.joining(",")),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        return response.getBody();
    }
}