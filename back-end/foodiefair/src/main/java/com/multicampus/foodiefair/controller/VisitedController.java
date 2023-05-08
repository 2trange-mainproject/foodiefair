package com.multicampus.foodiefair.controller;

import com.multicampus.foodiefair.dto.visited.VisitedDTO;
import com.multicampus.foodiefair.dto.visited.VisitedPageRequestDTO;
import com.multicampus.foodiefair.dto.visited.VisitedPageResponseDTO;
import com.multicampus.foodiefair.service.VisitedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage/{userId}")
@CrossOrigin("*")
@RequiredArgsConstructor
public class VisitedController {

    private final VisitedService visitedService;

    @GetMapping("/visited")
    public ResponseEntity<VisitedPageResponseDTO> getVisitedList(
            @PathVariable int userId,
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

    // RequestParam에 대한 key 설정을 제대로 해서 visitedId 받을 수 있게 해야한다.
    @DeleteMapping("/visited/{visitedId}")
    public ResponseEntity<String> removeVisited(@PathVariable("visitedId") Long visitedId) {
        int result = visitedService.removeVisited(visitedId);
        if (result == 1) {
            return ResponseEntity.ok("Visited removed successfully");
        } else {
            return ResponseEntity.badRequest().body("Error removing visited");
        }
    }

}
