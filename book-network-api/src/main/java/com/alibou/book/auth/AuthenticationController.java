package com.alibou.book.auth;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@RestController
//@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthenticationController {

//    private final AuthenticationService authService;
//
//    @PostMapping("/register")
//    @ResponseStatus(HttpStatus.ACCEPTED)
//    public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request) throws MessagingException {
//        authService.register(request);
//        return ResponseEntity.accepted().build();
//    }
//
//    @PostMapping("/authenticate")
//    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody @Valid AuthenticationRequest request) {
//        return ResponseEntity.ok(authService.authenticate(request));
//    }
//
//    @GetMapping("/activate-account")
//    public void confirm(
//            @RequestParam String token) throws MessagingException {
//        authService.activateAccount(token);
//    }
}
