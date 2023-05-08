package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.SaveDTO;
import com.multicampus.foodiefair.service.ISaveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/products/{productId}")
@Log4j2
@RequiredArgsConstructor
public class SaveController {
    private final ISaveService isaveService;

    @PostMapping("/saved") // 찜 하기
    public ResponseEntity<Map<String, Object>> registerSaved (@Valid @RequestBody SaveDTO saveDTO, BindingResult bindingResult) {
        Map<String, Object> resultMap = new HashMap<>();
        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(resultMap);
        }
        isaveService.registerSaved(saveDTO);
        isaveService.updatePlusSave(saveDTO.getProductId());
        int savedCount = isaveService.savedCount(saveDTO.getProductId());

        resultMap.put("savedCount", savedCount);
        resultMap.put("status", "success");

        return ResponseEntity.ok(resultMap);
    }

    @DeleteMapping("/saved/{userId}") // 찜 삭제
    public ResponseEntity<Map<String, Object>> removeSaved (@PathVariable String productId, @PathVariable int userId) {
        Map<String, Object> resultMap = new HashMap<>();

        isaveService.updateMinusSave(productId);
        int savedCount = isaveService.savedCount(productId);
        isaveService.removeSaved(productId, userId);

        resultMap.put("savedCount", savedCount);
        resultMap.put("status", "success");

        return ResponseEntity.ok(resultMap);
    }
}
