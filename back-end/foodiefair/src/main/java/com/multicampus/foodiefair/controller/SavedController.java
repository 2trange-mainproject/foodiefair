package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.saved.SavedDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageRequestDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageResponseDTO;
import com.multicampus.foodiefair.service.SavedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("")
@CrossOrigin("http://localhost:3000")
@RequiredArgsConstructor
public class SavedController {

    private final SavedService savedService;

    // 상품 찜
    @PostMapping("/products/{productId}/saved")
    public ResponseEntity<String> registerSaved (@Valid @RequestBody SavedDTO savedDTO, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
        }
        savedService.registerSaved(savedDTO);
        return ResponseEntity.ok("save success");
    }

    @DeleteMapping("/products/{productId}/saved/{savedId}")
    public ResponseEntity<String> removeSaved (@Valid @PathVariable("savedId") Long savedId, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("올바른 입력이 아닙니다.");
        }
        savedService.removeSaved(savedId);
        return ResponseEntity.ok("Delete success");
    }

    @GetMapping("/products/{productId}/saved/count")
    public ResponseEntity<String> savedCount (@PathVariable String productId) {
        savedService.getSavedProductCount(productId);
        return ResponseEntity.ok("count success");
    }

    @GetMapping("/mypage/{userId}/saved-products/count")
    public ResponseEntity<String> getSavedUserCount (@PathVariable Long userId) {
        savedService.getSavedUserCount(userId);
        return ResponseEntity.ok("User's saved-product count success");
    }

    @GetMapping("/mypage/{userId}/saved-products")
    public ResponseEntity<SavedPageResponseDTO> getSavedList(
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "15") int size) {

        SavedDTO savedDTO = new SavedDTO();
        savedDTO.setUserId(userId);

        SavedPageRequestDTO pageRequestDTO = SavedPageRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        SavedPageResponseDTO savedList = savedService.getSavedList(savedDTO, pageRequestDTO);
        return ResponseEntity.ok(savedList);
    }

}
