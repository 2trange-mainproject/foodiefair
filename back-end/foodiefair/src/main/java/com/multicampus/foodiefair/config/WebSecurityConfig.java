package com.multicampus.foodiefair.config; //WebSecurityConfig

import com.multicampus.foodiefair.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import java.util.Arrays;


@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class WebSecurityConfig {
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("HEAD","POST","GET","DELETE","PUT"));
        config.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.csrf().disable()
                .cors().configurationSource(corsConfigurationSource())
                .and()
                .authorizeRequests()
                .antMatchers("/dashboard/**").access("hasRole('ADMIN')")
                .antMatchers("/api/add-product/**").access("hasRole('ADMIN')")
                .antMatchers("/api/edit-customer/**").access("hasRole('ADMIN')")
                .antMatchers("/api/upload-image/**").access("hasRole('ADMIN')")
                .anyRequest().permitAll()
                .and()
                .rememberMe() // rememberMe 기능 작동함
                .key("remember-key")
                .rememberMeParameter("rememberMe") // default: remember-me, checkbox 등의 이름과 맞춰야함
                .tokenValiditySeconds(3600 * 24 * 30) // 쿠키의 만료시간 설정(초), default: 14일
                .alwaysRemember(false) // 사용자가 체크박스를 활성화하지 않아도 항상 실행, default: false
                .userDetailsService(userDetailsServiceImpl) // 기능을 사용할 때 사용자 정보가 필요함. 반드시 이 설정 필요함.
                .and()
                .build();
    }
}