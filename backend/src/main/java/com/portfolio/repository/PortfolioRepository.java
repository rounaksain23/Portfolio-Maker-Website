package com.portfolio.repository;

import com.portfolio.model.Portfolio;
import com.portfolio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Optional<Portfolio> findByUser(User user);
    Optional<Portfolio> findByUserId(Long userId);
    Optional<Portfolio> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
