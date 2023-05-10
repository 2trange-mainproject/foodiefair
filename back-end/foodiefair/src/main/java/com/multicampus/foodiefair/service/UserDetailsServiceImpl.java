package com.multicampus.foodiefair.service; //UserDetailsServiceImpl

import com.multicampus.foodiefair.config.PrincipalDetails;
import com.multicampus.foodiefair.dao.IUserDAO;
import com.multicampus.foodiefair.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final IUserDAO userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        UserDTO user = userRepository.getUserByEmail(userEmail);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + user.getUserName());
        }
        System.out.println("loadUserByUsername user : " + user.getUserName());
        return new PrincipalDetails(user);
    }
}