package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.VisitedDTO;
import com.multicampus.foodiefair.dto.VisitedPageRequestDTO;
import com.multicampus.foodiefair.dto.VisitedPageResponseDTO;
import com.multicampus.foodiefair.service.VisitedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage/{userId}")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VisitedController {

    private final VisitedService visitedService;

    @GetMapping("/visited")
    public ResponseEntity<VisitedPageResponseDTO> getVisitedList(
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "5") int size) {

        VisitedDTO visitedDto = new VisitedDTO();
        visitedDto.setOwnerId(userId);

        VisitedPageRequestDTO pageRequestDto = VisitedPageRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        VisitedPageResponseDTO visitedList = visitedService.getVisitedList(visitedDto, pageRequestDto);

        return ResponseEntity.ok(visitedList);
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
