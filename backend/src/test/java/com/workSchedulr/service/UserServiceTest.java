package com.workSchedulr.service;

import com.workSchedulr.dto.UserUpdateDTO;
import com.workSchedulr.model.User;
import com.workSchedulr.model.UserRole;
import com.workSchedulr.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetUserById() {
        UUID userId = UUID.randomUUID();
        User expectedUser = new User();

        when(userRepository.findById(userId)).thenReturn(Optional.of(expectedUser));

        User result = userService.getUserById(userId);
        assertEquals(expectedUser, result);
    }

    @Test
    public void testGetAllUserAsAdmin() {
        User adminUser = new User();
        adminUser.setUserRoles(Collections.singleton(UserRole.ROLE_ADMIN));
        List<User> allUsers = Arrays.asList(new User(), new User());

        when(userRepository.findAll()).thenReturn(allUsers);
        //TODO
    }


    @Test
    public void testGetAllUserAsManager() {
        User managerUser = new User();
        UUID managerId = UUID.randomUUID();
        managerUser.setId(managerId);
        managerUser.setUserRoles(Collections.singleton(UserRole.ROLE_MANAGER));
        Set<User> managedUsers = new HashSet<>(Arrays.asList(new User(), new User()));

        when(userService.getCurrentUser()).thenReturn(managerUser);
        when(userRepository.findUsersByManagerId(managerId)).thenReturn(managedUsers);

        Set<User> result = userService.getAllUserForManager(managerUser);

        assertTrue(result.contains(managerUser));
        assertTrue(result.containsAll(managedUsers));
        assertEquals(managedUsers.size(), result.size());
    }

    @Test
    public void testCreateUser() {
        User newUser = new User();
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        User result = userService.createUser(newUser);
        assertEquals(newUser, result);
    }

    @Test
    public void testUpdateUser() {
        UUID userId = UUID.randomUUID();
        UserUpdateDTO dto = new UserUpdateDTO();
        User existingUser = new User();

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        User result = userService.updateUser(userId, dto);
        //TODO
    }

    @Test
    public void testChangeStatus() {
        UUID userId = UUID.randomUUID();
        User user = new User();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.changeStatus(userId);
        //TODO
    }

    @Test
    public void testDelete() {
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));

        userService.delete(email);
        verify(userRepository, times(1)).deleteByEmail(email);
    }
}
