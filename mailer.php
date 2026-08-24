<?php
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// 1. Honeypot Anti-Spam Check
if (!empty($_POST['website']) || !empty($_POST['honeypot'])) {
    // Silently return success to fool spam bots without sending email
    echo json_encode(['status' => 'success', 'message' => 'Thank you! Your enquiry has been received.']);
    exit;
}

// 2. Collect and Sanitize Common Fields
$name = isset($_POST['name']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['name']))) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$company = isset($_POST['company']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['company']))) : '';
$phone = isset($_POST['phone']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['phone']))) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Context-Specific Fields
$product = isset($_POST['product']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['product']))) : '';
$enquiry_type = isset($_POST['type']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['type']))) : '';
$volume = isset($_POST['volume']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['volume']))) : '';
$brand_interest = isset($_POST['brand_interest']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['brand_interest']))) : '';
$source_page = isset($_POST['source_page']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['source_page']))) : '';

// 3. Validation
if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please provide a valid name and email address.'
    ]);
    exit;
}

// Determine if this is a Quote/Sample drawer or General Contact
$is_quote_drawer = !empty($product) || !empty($enquiry_type) || !empty($volume);

// 4. Construct Subject & Body
$recipient = "info@prarasbiosciences.com";
$timestamp = date("Y-m-d H:i:s T");

if ($is_quote_drawer) {
    $subject = "Praras Portal: Quote / Sample Request for " . (!empty($product) ? $product : "Products") . " from $name";
    
    $body = "=====================================================\n";
    $body .= "  NEW B2B PRODUCT ENQUIRY / SAMPLE REQUEST\n";
    $body .= "=====================================================\n";
    $body .= "Timestamp   : $timestamp\n";
    $body .= "Product     : " . ($product ?: "General / Range Enquiry") . "\n";
    $body .= "Enquiry Type: " . ($enquiry_type ?: "Quotation / Specification") . "\n";
    $body .= "Est. Volume : " . ($volume ?: "Not Specified") . "\n\n";
    $body .= "--- Contact Details ---\n";
    $body .= "Name        : $name\n";
    $body .= "Company     : " . ($company ?: "N/A") . "\n";
    $body .= "Email       : $email\n";
    $body .= "Phone       : " . ($phone ?: "N/A") . "\n";
    if ($source_page) $body .= "Source URL  : $source_page\n";
    $body .= "\n--- Message / Requirements ---\n";
    $body .= ($message ?: "No additional message provided.") . "\n";
    $body .= "=====================================================\n";
} else {
    $subject = "Praras Portal: Contact Form Message from $name" . ($brand_interest ? " [$brand_interest]" : "");
    
    $body = "=====================================================\n";
    $body .= "  NEW CONTACT FORM SUBMISSION\n";
    $body .= "=====================================================\n";
    $body .= "Timestamp     : $timestamp\n";
    $body .= "Name          : $name\n";
    $body .= "Email         : $email\n";
    $body .= "Company       : " . ($company ?: "N/A") . "\n";
    $body .= "Phone         : " . ($phone ?: "N/A") . "\n";
    $body .= "Brand Interest: " . ($brand_interest ?: "Praras Biosciences") . "\n\n";
    $body .= "--- Message ---\n";
    $body .= ($message ?: "No message text.") . "\n";
    $body .= "=====================================================\n";
}

// 5. Compliant Email Headers
$headers = [
    "From: Praras Biosciences Web Portal <no-reply@prarasbiosciences.com>",
    "Reply-To: $name <$email>",
    "X-Mailer: PHP/" . phpversion(),
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8"
];
$headers_str = implode("\r\n", $headers);

// 6. Send Mail (or log fallback)
$sent = @mail($recipient, $subject, $body, $headers_str);

// Log enquiry locally for audit tracking
$log_dir = __DIR__ . '/backups/logs';
if (!is_dir($log_dir)) {
    @mkdir($log_dir, 0750, true);
}
@file_put_contents(
    $log_dir . '/enquiries.log',
    "[" . date("c") . "] " . ($sent ? "SENT" : "QUEUED/LOCAL") . " | Type: " . ($is_quote_drawer ? "Quote" : "Contact") . " | Name: $name | Email: $email | Product: $product\n",
    FILE_APPEND | LOCK_EX
);

// Return standard response
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => $is_quote_drawer 
        ? 'Thank you! Your quote enquiry has been received. Our technical sales team will contact you shortly.'
        : 'Thank you! Your message has been sent successfully. We will get back to you soon.'
]);
?>
