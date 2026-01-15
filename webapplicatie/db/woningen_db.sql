-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 14 jan 2026 om 17:52
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
-- Database: `woningen_db`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `pompen`
--

CREATE TABLE `pompen` (
  `id` int(11) NOT NULL,
  `pomp_id` varchar(64) NOT NULL,
  `woning` varchar(64) NOT NULL,
  `status` enum('Inactief','Rust','Actief') DEFAULT 'Inactief',
  `laatste_update` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(64) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `expires_at`, `created_at`) VALUES
('c630571a-d068-4977-9141-8f979812fb41', 1, '2026-01-13 23:49:38', '2026-01-13 15:49:38');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `woningen`
--

CREATE TABLE `woningen` (
  `woning_id` int(11) NOT NULL,
  `gebruikersnaam` varchar(100) NOT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  `rol` enum('admin','user') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `woningen`
--

INSERT INTO `woningen` (`woning_id`, `gebruikersnaam`, `wachtwoord`, `rol`) VALUES
(1, 'root', '$2b$12$uVPqRrdAPe7wMBXyp9qOXuSw8TRj/84KzXJgPZUoogFrNOoT27S2C', 'admin'),
(2, 'test', '$2b$12$/j34znw8Zn987vcX78WEZuuU1IEnY3hQZPVv3UfE2lsrP9yu3k4LO', 'user');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `pompen`
--
ALTER TABLE `pompen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_pomp_woning` (`pomp_id`,`woning`);

--
-- Indexen voor tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `woningen`
--
ALTER TABLE `woningen`
  ADD PRIMARY KEY (`woning_id`),
  ADD UNIQUE KEY `gebruikersnaam` (`gebruikersnaam`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `pompen`
--
ALTER TABLE `pompen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `woningen`
--
ALTER TABLE `woningen`
  MODIFY `woning_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
