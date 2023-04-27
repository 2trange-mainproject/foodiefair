package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.VisitedDTO;
import com.multicampus.foodiefair.service.VisitedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mypage/{userId}")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VisitedController {

    private final VisitedService visitedService;

    @GetMapping("/visited")
    public ResponseEntity<List<Map<String, Object>>> getVisitedList(
            @RequestParam(required = false, defaultValue = "0") int offset,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @PathVariable Long userId) {
        List<Map<String, Object>> visitedList = visitedService.getVisitedList(userId, offset, limit);
        return ResponseEntity.ok(visitedList);
    }

    @GetMapping("/visited/count")
    public ResponseEntity<Integer> visitedCount(@PathVariable Long userId) {
        int count = visitedService.visitedCount(userId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/visited")
    public ResponseEntity<String> registerVisited(@RequestBody VisitedDTO visitedDTO) {
        int result = visitedService.registerVisited(visitedDTO);
        if (result == 1) {
            return ResponseEntity.ok("Visited added successfully");
        } else {
            return ResponseEntity.badRequest().body("Error adding visited");
        }
    }

    @DeleteMapping("/visited")
    public ResponseEntity<String> removeVisited(@RequestParam Long visitedId) {
        int result = visitedService.removeVisited(visitedId);
        if (result == 1) {
            return ResponseEntity.ok("Visited removed successfully");
        } else {
            return ResponseEntity.badRequest().body("Error removing visited");
        }
    }

}
