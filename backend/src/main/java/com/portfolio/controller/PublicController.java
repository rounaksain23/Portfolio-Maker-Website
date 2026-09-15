package com.portfolio.controller;

import com.portfolio.dto.PortfolioDTO;
import com.portfolio.dto.TemplateDTO;
import com.portfolio.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/public/portfolio/{slug}")
    public ResponseEntity<PortfolioDTO> getPublicPortfolio(@PathVariable("slug") String slug) {
        PortfolioDTO dto = portfolioService.getPublicPortfolioBySlug(slug);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/templates")
    public ResponseEntity<List<TemplateDTO>> getTemplates() {
        List<TemplateDTO> templates = portfolioService.getAvailableTemplates();
        return ResponseEntity.ok(templates);
    }
}
