<?php
$img = imagecreatetruecolor(800, 600);
$bg = imagecolorallocate($img, 240, 240, 240);
imagefill($img, 0, 0, $bg);

$text_color = imagecolorallocate($img, 50, 50, 50);
$font_path = __DIR__ . '/Roboto-Bold.ttf';

if (file_exists($font_path)) {
    echo "Font file exists at $font_path\n";
} else {
    echo "Font file does NOT exist at $font_path\n";
}

$bbox = @imagettfbbox(40, 0, $font_path, "TEST TEXT");
if ($bbox === false) {
    echo "imagettfbbox failed.\n";
} else {
    echo "imagettfbbox succeeded.\n";
    imagettftext($img, 40, 0, 100, 100, $text_color, $font_path, "TEST TEXT");
}

imagejpeg($img, 'test_font.jpg', 90);
imagedestroy($img);
?>
