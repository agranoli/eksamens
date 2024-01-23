<?php
include 'db.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Retrieve form data
        $name = $_POST['name'];
        $email = $_POST['email'];
        $message = $_POST['message'];

        // Insert data into the database
        $db = new Database;
        $db->InsertMessage($name, $email, $message);

        // Set success message
        $response['success'] = true;
        $response['message'] = 'Entry added successfully';
    } catch (Exception $e) {
        // Set error message
        $response['message'] = 'Error processing form';
    }

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}
?>
