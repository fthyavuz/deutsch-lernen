package com.fatih.germanapp.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.fatih.germanapp.model.Level;

@Repository
public interface LevelRepository extends JpaRepository<Level, Long> {
    Optional<Level> findByCode(String code);

    Optional<Level> findByCodeIgnoreCase(String code);

    List<Level> findAllByOrderByDisplayOrderAsc();
}
