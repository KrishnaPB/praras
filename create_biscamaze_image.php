<?php
$base_img = 'assets/images/flour_forte.png';
$font_path = realpath('Roboto-Bold.ttf');
putenv('GDFONTPATH=' . realpath('.'));

$img = @imagecreatefromjpeg($base_img);
if (!$img) {
    $img = @imagecreatefrompng($base_img);
}
if (!$img) {
    die("Failed to load base image.\n");
}

$width = imagesx($img);
$height = imagesy($img);

// Draw a dark semi-transparent rectangle in the middle
$rect_width = 800;
$rect_height = 200;
$rect_x = ($width - $rect_width) / 2;
$rect_y = ($height - $rect_height) / 2;

// We need to use imagecolorallocatealpha for truecolor images
imagealphablending($img, true);
imagesavealpha($img, true);

$dark_color = imagecolorallocatealpha($img, 0, 0, 0, 50); // 50/127 = approx 40% transparent
imagefilledrectangle($img, $rect_x, $rect_y, $rect_x + $rect_width, $rect_y + $rect_height, $dark_color);

// Add border to rectangle
$border_color = imagecolorallocate($img, 255, 255, 255);
for ($i = 0; $i < 5; $i++) {
    imagerectangle($img, $rect_x + $i, $rect_y + $i, $rect_x + $rect_width - $i, $rect_y + $rect_height - $i, $border_color);
}

// Write text
$text = "BISCAMAZE LF";
$text_color = imagecolorallocate($img, 255, 255, 255);
$font_size = 60;

$bbox = @imagettfbbox($font_size, 0, $font_path, $text);
if ($bbox === false) {
    // fallback to imagestring
    imagestring($img, 5, $rect_x + 50, $rect_y + 50, $text, $text_color);
    $subtext = "High Quality Biscuit Improver (Powder)";
    imagestring($img, 4, $rect_x + 50, $rect_y + 100, $subtext, $text_color);
} else {
    $text_width = $bbox[2] - $bbox[0];
    $text_height = $bbox[1] - $bbox[7];

    $text_x = ($width - $text_width) / 2;
    $text_y = ($height - $text_height) / 2 + $text_height;

    imagettftext($img, $font_size, 0, $text_x, $text_y, $text_color, $font_path, $text);

    // Subtext
    $subtext = "High Quality Biscuit Improver (Powder)";
    $subfont_size = 24;
    $subbbox = imagettfbbox($subfont_size, 0, $font_path, $subtext);
    $subtext_width = $subbbox[2] - $subbbox[0];
    $subtext_x = ($width - $subtext_width) / 2;
    $subtext_y = $text_y + 60;

    imagettftext($img, $subfont_size, 0, $subtext_x, $subtext_y, $text_color, $font_path, $subtext);
}

// Save image
imagejpeg($img, 'assets/images/biscamaze_lf.png', 90);
imagedestroy($img);
echo "Image created successfully.\n";
?>
