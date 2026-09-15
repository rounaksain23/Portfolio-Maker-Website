package com.portfolio.repository;

import com.portfolio.model.InviteToken;
import com.portfolio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InviteTokenRepository extends JpaRepository<InviteToken, Long> {
    Optional<InviteToken> findByToken(String token);
    Optional<InviteToken> findByUserAndUsedFalse(User user);
    void deleteByUser(User user);
}
