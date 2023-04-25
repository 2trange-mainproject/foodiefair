package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.SaveDTO;
import com.multicampus.foodiefair.service.ISaveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin("*")
@RequestMapping("/products/save")
@Log4j2
@RequiredArgsConstructor
public class SaveController {
    private final ISaveService isaveService;

    @PostMapping("/") // 찜 하기
    public ResponseEntity<String> save (@Valid @RequestBody SaveDTO saveDTO, BindingResult bindingResult) {
        log.info("saveController");
        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
        }
        isaveService.save(saveDTO);
        return ResponseEntity.ok("save success");
    }

    @PostMapping("/savedToDelete") // 찜 삭제
    public ResponseEntity<String> savedToDelete (@Valid @RequestBody SaveDTO saveDTO, BindingResult bindingResult) {
        log.info("savedToDelete");

        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
        }
        isaveService.saveToDelete(saveDTO);
        return ResponseEntity.ok("Delete success");
    }

    @GetMapping("/count/{productId}")
    public ResponseEntity<String> savedCount (@PathVariable String productId) {
        isaveService.savedCount(productId);
        return ResponseEntity.ok("count success");
    }
}
