<?php
header('Content-Type: application/json');

// Get form data
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';

// Validate data
if (empty($name) || empty($phone) || empty($email)) {
    echo json_encode([
        'success' => false,
        'message' => 'Пожалуйста, заполните все поля'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Пожалуйста, введите корректный email'
    ]);
    exit;
}

// Prepare email
$to = 'rbru-metrika@yandex.ru';
$subject = 'Новая заявка с сайта';
$message = "Имя: $name\n";
$message .= "Телефон: $phone\n";
$message .= "Email: $email\n";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode([
        'success' => true,
        'message' => 'Спасибо! Ваша заявка отправлена.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
    ]);
} 