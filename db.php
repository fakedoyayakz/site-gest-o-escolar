<?php
// simple PDO wrapper for SQLite backend
$databasePath = __DIR__ . '/data/aulas.sqlite';
$dir = dirname($databasePath);
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

$pdo = new PDO('sqlite:' . $databasePath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// create table if it does not exist
$pdo->exec("CREATE TABLE IF NOT EXISTS aulas (
    id TEXT PRIMARY KEY,
    dia TEXT NOT NULL,
    horario TEXT NOT NULL,
    duracao INTEGER NOT NULL,
    turma TEXT NOT NULL,
    professor TEXT NOT NULL,
    materia TEXT NOT NULL,
    sala TEXT NOT NULL,
    observacoes TEXT
)");
