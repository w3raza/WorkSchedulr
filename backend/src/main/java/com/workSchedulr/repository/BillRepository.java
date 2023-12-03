package com.workSchedulr.repository;

import com.workSchedulr.model.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface BillRepository extends JpaRepository<Bill, UUID> {
    @Query("SELECT b FROM Bill b WHERE b.startDate >= :startDate AND b.endDate <= :endDate")
    Page<Bill> findBillsByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable);
    @Query("SELECT b FROM Bill b WHERE b.userId = :userId AND b.startDate >= :startDate AND b.endDate <= :endDate")
    Page<Bill> findBillsByUserIdAndDateRange(UUID userId, LocalDate startDate, LocalDate endDate, Pageable pageable);
}