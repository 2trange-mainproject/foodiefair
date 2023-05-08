package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.service.OCRService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.HashMap;

@RestController
@RequestMapping("/api/receipt")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor


public class ReceiptController {

    public File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        Path tempDir = Files.createTempDirectory("");
        File file = new File(tempDir.toFile(), multipartFile.getOriginalFilename());
        multipartFile.transferTo(file);
        return file;
    }

    public String productName = "무파마";
    private final OCRService ocrService;

    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> processReceipt(@RequestBody HashMap<String, Object> requestData) {
        String base64Data = (String) requestData.get("image");

        // 네이버 CLOVA OCR API로 POST 요청 보내기
        Boolean ocrResponse = ocrService.sendOcrRequest(base64Data, productName);

        // 처리 결과에 따라 응답 생성
        JSONObject jsonResponse = new JSONObject();
        if (ocrResponse) {
            jsonResponse.put("status", "success");
            jsonResponse.put("message", "OK");
            return ResponseEntity.ok().body(jsonResponse.toString());
        } else {
            jsonResponse.put("status", "failure");
            jsonResponse.put("message", "영수증을 다시 첨부해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(jsonResponse.toString());
        }
    }

    /*@PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> processReceipt(@RequestParam("reviewImg") MultipartFile reviewImg) throws IOException {
        File requestData = convertMultipartFileToFile(reviewImg);

        // 이미지 파일을 base64로 인코딩
        byte[] fileContent = Files.readAllBytes(requestData.toPath());
        String base64Data = Base64.getEncoder().encodeToString(fileContent);

        // 네이버 CLOVA OCR API로 POST 요청 보내기
        Boolean ocrResponse = ocrService.sendOcrRequest(base64Data, productName);

        // 처리 결과에 따라 응답 생성
        JSONObject jsonResponse = new JSONObject();
        if (ocrResponse) {
            jsonResponse.put("status", "success");
            jsonResponse.put("message", "OK");
            return ResponseEntity.ok().body(jsonResponse.toString());
        } else {
            jsonResponse.put("status", "failure");
            jsonResponse.put("message", "영수증을 다시 첨부해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(jsonResponse.toString());
        }
    }*/
}
