<?php
$dir = __DIR__ . '/assets/images/';
$files = scandir($dir);

$hero_max = 1600;
$normal_max = 800;

$count = 0;

foreach ($files as $file) {
    if ($file === '.' || $file === '..') continue;
    
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $name = pathinfo($file, PATHINFO_FILENAME);
    
    if ($ext === 'jpg' || $ext === 'jpeg' || $ext === 'png') {
        $path = $dir . $file;
        $webp_path = $dir . $name . '.webp';
        
        $image = null;
        if ($ext === 'jpg' || $ext === 'jpeg') {
            $image = @imagecreatefromjpeg($path);
        } else if ($ext === 'png') {
            $image = @imagecreatefrompng($path);
            if ($image) {
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
            }
        }
        
        if (!$image) {
            echo "Failed to read $file\n";
            continue;
        }
        
        $width = imagesx($image);
        $height = imagesy($image);
        
        $max_w = (strpos($name, 'hero') !== false) ? $hero_max : $normal_max;
        
        if ($width > $max_w) {
            $ratio = $max_w / $width;
            $new_w = $max_w;
            $new_h = round($height * $ratio);
            
            $new_image = imagecreatetruecolor($new_w, $new_h);
            
            if ($ext === 'png') {
                imagealphablending($new_image, false);
                imagesavealpha($new_image, true);
                $transparent = imagecolorallocatealpha($new_image, 255, 255, 255, 127);
                imagefilledrectangle($new_image, 0, 0, $new_w, $new_h, $transparent);
            }
            
            imagecopyresampled($new_image, $image, 0, 0, 0, 0, $new_w, $new_h, $width, $height);
            imagedestroy($image);
            $image = $new_image;
        }
        
        if (imagewebp($image, $webp_path, 80)) {
            echo "Converted $file to $name.webp\n";
            $count++;
        } else {
            echo "Failed to save $webp_path\n";
        }
        
        imagedestroy($image);
    }
}

echo "Successfully converted $count images to WebP.\n";
?>
