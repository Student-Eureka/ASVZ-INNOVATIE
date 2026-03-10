-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 10 mrt 2026 om 10:35
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `asvz_db`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `woningen`
--

CREATE TABLE `woningen` (
  `woning_id` int(11) NOT NULL,
  `woning_code` varchar(100) NOT NULL,
  `gebruikersnaam` varchar(100) NOT NULL,
  `email` varchar(190) NOT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  `rol` enum('admin','user') NOT NULL DEFAULT 'user',
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `woningen`
--

INSERT INTO `woningen` (`woning_id`, `woning_code`, `gebruikersnaam`, `email`, `wachtwoord`, `rol`, `last_login`) VALUES
(4, 'woning_a', 'root', 'root@asvz.local', '$2b$12$rdRHayrRSdsdwlQ9gCzaxukf2AcXia9w5ZXyjU3MKK1jN/230zDyy', 'admin', NULL),
(5, 'woning_b', 'test', 'test@asvz.local', '$2b$12$eF/ileULWIl35QpZKVr6Q.5nzViXZ1U17KI/ZjUZl8MuOLCB6laCO', 'user', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `pompen`
--

CREATE TABLE `pompen` (
  `id` int(11) NOT NULL,
  `woning_id` int(11) NOT NULL,
  `woning_code` varchar(100) NOT NULL,
  `pomp_code` varchar(100) NOT NULL,
  `status` enum('Inactief','Rust','Actief') DEFAULT 'Inactief',
  `laatste_update` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(191) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `woningen`
--

ALTER TABLE `woningen`
  ADD PRIMARY KEY (`woning_id`),
  ADD UNIQUE KEY `gebruikersnaam` (`gebruikersnaam`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_woningen_woning_code` (`woning_code`);

--
-- Indexen voor tabel `pompen`
--

ALTER TABLE `pompen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_woning_pomp` (`woning_code`,`pomp_code`),
  ADD KEY `fk_pompen_woningen` (`woning_id`),
  ADD KEY `idx_pompen_woning_code` (`woning_code`);

--
-- Indexen voor tabel `sessions`
--

ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sessions_woningen` (`user_id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

ALTER TABLE `woningen`
  MODIFY `woning_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `pompen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Beperkingen voor geëxporteerde tabellen
--

ALTER TABLE `pompen`
  ADD CONSTRAINT `fk_pompen_woningen` FOREIGN KEY (`woning_id`) REFERENCES `woningen` (`woning_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_woningen` FOREIGN KEY (`user_id`) REFERENCES `woningen` (`woning_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
