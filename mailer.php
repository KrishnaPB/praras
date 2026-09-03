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
    // Silently return success to fool spam bots without sending email or saving junk
    echo json_encode(['status' => 'success', 'message' => 'Thank you! Your enquiry has been received.']);
    exit;
}

// 2. Cloudflare Turnstile Verification
$turnstile_secret = "0x4AAAAAAEjrnnoCMBGcgpJOF6wfyQFXqg4";
$turnstile_response = isset($_POST['cf-turnstile-response']) ? trim($_POST['cf-turnstile-response']) : '';

// Allow local development testing bypass if needed, but enforce in production
$is_local = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1']);

if (empty($turnstile_response) && !$is_local) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Security verification failed. Please complete the Turnstile challenge.'
    ]);
    exit;
}

if (!empty($turnstile_response)) {
    // Verify token with Cloudflare API
    $verify_url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $verify_data = [
        'secret'   => $turnstile_secret,
        'response' => $turnstile_response,
        'remoteip' => $_SERVER['HTTP_CF_CONNECTING_IP'] ?? ($_SERVER['REMOTE_ADDR'] ?? '')
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $verify_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($verify_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    $response_body = curl_exec($ch);
    $curl_error = curl_error($ch);
    curl_close($ch);

    $verification = json_decode($response_body, true);
    if (empty($verification) || empty($verification['success']) || $verification['success'] !== true) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Turnstile verification failed. Please refresh the page and try again.'
        ]);
        exit;
    }
}

// 3. Collect and Sanitize Input Fields
$name = isset($_POST['name']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['name']))) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$company = isset($_POST['company']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['company']))) : '';
$phone = isset($_POST['phone']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['phone']))) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';
$custom_subject = isset($_POST['subject']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['subject']))) : '';

// Context-Specific Fields
$product = isset($_POST['product']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['product']))) : (isset($_POST['product_name']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['product_name']))) : '');
$enquiry_type = isset($_POST['type']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['type']))) : '';
$volume = isset($_POST['volume']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['volume']))) : '';
$brand_interest = isset($_POST['brand_interest']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['brand_interest']))) : '';
$source_page = isset($_POST['source_page']) ? trim(preg_replace('/[\r\n]/', '', strip_tags($_POST['source_page']))) : '';

// 4. Validation
if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please provide a valid name and email address.'
    ]);
    exit;
}

// Determine inquiry type & brand
$is_quote_drawer = !empty($product) || !empty($enquiry_type) || !empty($volume);
$is_service_consult = !empty($custom_subject);

$form_type = 'Contact Message';
if ($is_quote_drawer) {
    $form_type = 'Quote Request';
} elseif ($is_service_consult) {
    $form_type = 'Consultation Request';
}

$detected_brand = 'Praras Biosciences';
if (stripos($product, 'airbliss') !== false || stripos($source_page, 'airbliss') !== false || strtolower($brand_interest) === 'airbliss') {
    $detected_brand = 'Airbliss';
}

// 5. Construct Email Subject & Body
$recipient = "info@prarasbiosciences.com";
$timestamp = date("Y-m-d H:i:s T");

if ($is_quote_drawer) {
    $subject = "Praras Portal: Quote / Sample Request for " . (!empty($product) ? $product : "Products") . " from $name";
    
    $body = "=====================================================\n";
    $body .= "  NEW B2B PRODUCT ENQUIRY / SAMPLE REQUEST\n";
    $body .= "=====================================================\n";
    $body .= "Timestamp   : $timestamp\n";
    $body .= "Brand       : $detected_brand\n";
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
} elseif ($is_service_consult) {
    $subject = "Praras Portal: $custom_subject from $name";
    
    $body = "=====================================================\n";
    $body .= "  NEW CONSULTATION / SERVICE INQUIRY\n";
    $body .= "=====================================================\n";
    $body .= "Timestamp   : $timestamp\n";
    $body .= "Inquiry For : $custom_subject\n";
    $body .= "Name        : $name\n";
    $body .= "Email       : $email\n";
    $body .= "Company     : " . ($company ?: "N/A") . "\n";
    $body .= "Phone       : " . ($phone ?: "N/A") . "\n";
    if ($source_page) $body .= "Source URL  : $source_page\n";
    $body .= "\n--- Message / Notes ---\n";
    $body .= ($message ?: "Consultation request submitted.") . "\n";
    $body .= "=====================================================\n";
} else {
    $subject = "Praras Portal: Contact Form Message from $name" . ($brand_interest ? " [$brand_interest]" : "");
    
    $body = "=====================================================\n";
    $body .= "  NEW CONTACT FORM SUBMISSION\n";
    $body .= "=====================================================\n";
    $body .= "Timestamp     : $timestamp\n";
    $body .= "Brand Interest: " . ($brand_interest ?: $detected_brand) . "\n";
    $body .= "Name          : $name\n";
    $body .= "Email         : $email\n";
    $body .= "Company       : " . ($company ?: "N/A") . "\n";
    $body .= "Phone         : " . ($phone ?: "N/A") . "\n\n";
    $body .= "--- Message ---\n";
    $body .= ($message ?: "No message text.") . "\n";
    $body .= "=====================================================\n";
}

// 6. Compliant Email Headers & Mail Dispatch
$headers = [
    "From: Praras Biosciences Web Portal <no-reply@prarasbiosciences.com>",
    "Reply-To: $name <$email>",
    "X-Mailer: PHP/" . phpversion(),
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8"
];
$headers_str = implode("\r\n", $headers);
$sent = @mail($recipient, $subject, $body, $headers_str);

// 7. SAVE ENQUIRY IN PRIVATE DIRECTORY (OUTSIDE PUBLIC WEB ROOT)
$enquiry_id = 'ENQ-' . date('Ymd-His') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
$enquiries_dir = dirname(__DIR__, 2) . '/storage/enquiries';

if (!is_dir($enquiries_dir)) {
    @mkdir($enquiries_dir, 0770, true);
}

$enquiry_record = [
    'id'           => $enquiry_id,
    'timestamp'    => date('c'),
    'date'         => date('Y-m-d'),
    'time'         => date('H:i:s T'),
    'form_type'    => $form_type,
    'brand'        => $detected_brand,
    'email_sent'   => (bool)$sent,
    'client_ip'    => $_SERVER['HTTP_CF_CONNECTING_IP'] ?? ($_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN'),
    'user_agent'   => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'source_page'  => $source_page,
    'data'         => [
        'name'            => $name,
        'email'           => $email,
        'company'         => $company,
        'phone'           => $phone,
        'product'         => $product,
        'enquiry_type'    => $enquiry_type,
        'volume'          => $volume,
        'brand_interest'  => $brand_interest ?: $detected_brand,
        'subject'         => $custom_subject,
        'message'         => $message
    ]
];

// 7a. Save Individual JSON File
$json_filename = 'enquiry_' . date('Ymd_His') . '_' . strtolower(substr($enquiry_id, -6)) . '.json';
$individual_json_path = $enquiries_dir . '/' . $json_filename;
@file_put_contents(
    $individual_json_path,
    json_encode($enquiry_record, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    LOCK_EX
);

// 7b. Append to Master all_enquiries.json file
$master_json_path = $enquiries_dir . '/all_enquiries.json';
$master_list = [];
if (file_exists($master_json_path)) {
    $existing_data = @file_get_contents($master_json_path);
    if ($existing_data) {
        $decoded = json_decode($existing_data, true);
        if (is_array($decoded)) {
            $master_list = $decoded;
        }
    }
}
// Prepend newest enquiry to top of master list
array_unshift($master_list, $enquiry_record);
@file_put_contents(
    $master_json_path,
    json_encode($master_list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    LOCK_EX
);

// 7c. Text Log for Audit Tracking (Saved in Private Storage Outside Web Root)
$log_dir = dirname(__DIR__, 2) . '/storage/logs';
if (!is_dir($log_dir)) {
    @mkdir($log_dir, 0770, true);
}
@file_put_contents(
    $log_dir . '/enquiries.log',
    "[" . date("c") . "] ID: $enquiry_id | " . ($sent ? "EMAIL_SENT" : "SAVED_LOCAL") . " | Type: $form_type | Brand: $detected_brand | Name: $name | Email: $email | Product: $product\n",
    FILE_APPEND | LOCK_EX
);

// 8. Return Success JSON Response
http_response_code(200);
$success_msg = $is_quote_drawer 
    ? 'Thank you! Your quote enquiry has been received. Our technical sales team will contact you shortly.'
    : ($is_service_consult 
        ? 'Thank you! Your consultation request has been received. An expert will reach out to you shortly.'
        : 'Thank you! Your message has been sent successfully. We will get back to you soon.');

echo json_encode([
    'status'     => 'success',
    'enquiry_id' => $enquiry_id,
    'message'    => $success_msg
]);
?>
