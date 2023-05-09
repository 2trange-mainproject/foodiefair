package com.multicampus.foodiefair;

import com.multicampus.foodiefair.config.PrincipalDetails;
import com.multicampus.foodiefair.dao.IUserDAO;
import com.multicampus.foodiefair.dto.UserDTO;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Log4j2
public class UserRoleTest {

    @Autowired
    private IUserDAO userRepository;

    @Test
    public void userRoleTest() {
        String userEmail = "admin1234@naver.com"; // 테스트할 유저 이메일을 사용하세요.

        UserDTO user = userRepository.getUserByEmail(userEmail);
        assertNotNull(user, "User not found with email: " + userEmail);

        PrincipalDetails principalDetails = new PrincipalDetails(user);
        Collection<? extends GrantedAuthority> authorities = principalDetails.getAuthorities();

        assertNotNull(authorities, "No authorities found for user: " + userEmail);
        assertFalse(authorities.isEmpty(), "No authorities found for user: " + userEmail);

        log.info("User email: " + userEmail);
        log.info("Authorities: " + authorities);

        // 특정 권한이 있는지 확인하려면 아래와 같이 사용할 수 있습니다.
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")), "User does not have ROLE_ADMIN");
    }
}