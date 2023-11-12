package com.workSchedulr.configuration;

import java.io.UnsupportedEncodingException;
import java.util.*;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.workSchedulr.model.UserRole;
import com.workSchedulr.service.MyUserDetails;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import org.springframework.web.server.ResponseStatusException;

@Component
@RequiredArgsConstructor
public class JwtService {

  /**
   * THIS IS NOT A SECURE PRACTICE! For simplicity, we are storing a static key here. Ideally, in a
   * microservices environment, this key would be kept on a config-server.
   */
  @Value("${security.jwt.token.secret-key:secret-key}")
  private String secretKey;

  @Value("${security.jwt.token.expire-length}")
  private long validityInMilliseconds;

  private final MyUserDetails myUserDetails;

  @PostConstruct
  protected void init() {
    secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
  }

  public String createToken(String login, Set<UserRole> userRoles) {
    Date now = new Date();
    Date validity = new Date(now.getTime() + validityInMilliseconds);

    String[] roleStrings = userRoles.stream()
            .map(UserRole::getAuthority)
            .toArray(String[]::new);
    try {
      Algorithm algorithm = Algorithm.HMAC256(secretKey);
      return JWT.create()
              .withSubject(login)
              .withArrayClaim("roles", roleStrings)
              .withIssuedAt(now)
              .withExpiresAt(validity)
              .sign(algorithm);

    } catch (UnsupportedEncodingException e) {
      throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Algorithm failed");
    }
  }

  public Authentication validateToken(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secretKey);

      JWTVerifier verifier = JWT.require(algorithm)
              .build();

      DecodedJWT decoded = verifier.verify(token);

      UserDetails user = myUserDetails.loadUserByUsername(decoded.getSubject());

      return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
    }catch(UnsupportedEncodingException e){
      throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Algorithm failed");
    }
  }

  public String resolveToken(HttpServletRequest req) {
    String header = req.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      return header.substring(7);
    }
    return null;
  }
}
