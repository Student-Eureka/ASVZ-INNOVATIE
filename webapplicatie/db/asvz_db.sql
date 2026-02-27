-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 27 feb 2026 om 09:28
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
-- Tabelstructuur voor tabel `pompen`
--

CREATE TABLE `pompen` (
  `id` int(11) NOT NULL,
  `woning_id` int(11) NOT NULL,
  `status` enum('Inactief','Rust','Actief') DEFAULT 'Inactief',
  `laatste_update` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `expires_at`, `created_at`) VALUES
(62, 5, '2026-02-26 22:41:29', '2026-02-26 14:41:29');

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
(4, 'root', '$2b$12$rdRHayrRSdsdwlQ9gCzaxukf2AcXia9w5ZXyjU3MKK1jN/230zDyy', 'admin'),
(5, 'test', '$2b$12$eF/ileULWIl35QpZKVr6Q.5nzViXZ1U17KI/ZjUZl8MuOLCB6laCO', 'user');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `pompen`
--
ALTER TABLE `pompen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pompen_woningen` (`woning_id`);

--
-- Indexen voor tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sessions_woningen` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT voor een tabel `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64658424;

--
-- AUTO_INCREMENT voor een tabel `woningen`
--
ALTER TABLE `woningen`
  MODIFY `woning_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `pompen`
--
ALTER TABLE `pompen`
  ADD CONSTRAINT `fk_pompen_woningen` FOREIGN KEY (`woning_id`) REFERENCES `woningen` (`woning_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Beperkingen voor tabel `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_woningen` FOREIGN KEY (`user_id`) REFERENCES `woningen` (`woning_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
