package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.ProductDTO;
import com.multicampus.foodiefair.dto.saved.SavedDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageRequestDTO;
import com.multicampus.foodiefair.dto.saved.SavedPageResponseDTO;
import com.multicampus.foodiefair.service.SavedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("")
@CrossOrigin("*")
@RequiredArgsConstructor
public class SavedController {

    private final SavedService savedService;

    // 상품 찜
    @PostMapping("/products/{productId}/saved/mypage")
    public ResponseEntity<String> registerSaved (@Valid @RequestBody SavedDTO savedDTO) {
        int result = savedService.registerSaved(savedDTO);
        if (result == 1) {
            return ResponseEntity.ok("Saved added successfully");
        } else {
            return ResponseEntity.badRequest().body("Error adding saved");
        }
    }

    @DeleteMapping("/products/{productId}/saved/mypage")
    public ResponseEntity<String> removeSaved(@PathVariable("productId") String productId, @RequestParam("userId") int userId) {
        System.out.println("Received request to remove saved product with productId: " + productId + " and userId: " + userId);
        int result = savedService.removeSaved(productId, userId);
        if (result == 1) {
            return ResponseEntity.ok("Saved removed successfully");
        } else {
            return ResponseEntity.badRequest().body("Error removing saved");
        }
    }

    @GetMapping("/products/{productId}/saved/count")
    public ResponseEntity<String> savedCount (@PathVariable String productId) {
        savedService.getSavedProductCount(productId);
        return ResponseEntity.ok("count success");
    }

    @GetMapping("/mypage/{userId}/saved-products/count")
    public ResponseEntity<Integer> getSavedUserCount (@PathVariable int userId) {
        int result = savedService.getSavedUserCount(userId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/mypage/{userId}/saved-products")
    public ResponseEntity<SavedPageResponseDTO> getSavedList(
            @PathVariable int userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "16") int size) {

        SavedDTO savedDTO = new SavedDTO();
        savedDTO.setUserId(userId);

        SavedPageRequestDTO pageRequestDTO = SavedPageRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        SavedPageResponseDTO savedList = savedService.getSavedList(savedDTO, pageRequestDTO);

        S3Client s3Client = new S3Client();
        for (HashMap<String, Object> product : savedList.getDataList()) {
            String objectKey = (String) product.get("productImg");
            String url = s3Client.getProductUrl(objectKey, 3600); // 이미지 파일에 대한 SignedUrl을 생성
            product.put("productImg", url);
        }

        return ResponseEntity.ok(savedList);
    }

    @GetMapping("/mypage/{userId}/saved-examples")
    public ResponseEntity<ArrayList<HashMap<String, Object>>> getSavedFour(@PathVariable int userId) {
        ArrayList<HashMap<String, Object>> savedExamples = savedService.getSavedFour(userId);

        S3Client s3Client = new S3Client();
        for (HashMap<String, Object> product : savedExamples) {
            String objectKey = (String) product.get("productImg");
            String url = s3Client.getProductUrl(objectKey, 3600); // 이미지 파일에 대한 SignedUrl을 생성
            product.put("productImg", url);
        }

        System.out.println(savedExamples);
        return ResponseEntity.ok(savedExamples);
    }

}
