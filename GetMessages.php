<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $db = new Database;
    $items = $db->GetMessages();
    header('Content-Type: application/json');
    echo json_encode($items);
}
