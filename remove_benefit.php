<?php
$files = array(
    "biscuits-cookies.html", "bread-buns-pizza-base.html", "preccel-93.html", "chocolate-coffee.html", 
    "egg-free-nougat.html", "extruded-fried-snacks.html", "fruit-based.html", 
    "mayonnaise.html", "meat.html", "milk-based.html", "pasta-and-noodles.html", 
    "wafers.html", "beverages.html", "a-hango.html", "breweries.html", 
    "distilleries.html", "microbrewery.html", "wine.html"
);

foreach ($files as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        if (strpos($content, '<h4 class="svc-h">Benefit</h4>') !== false) {
            $content = str_replace('            <h4 class="svc-h">Benefit</h4>' . "\n", '', $content);
            $content = str_replace('<h4 class="svc-h">Benefit</h4>', '', $content);
            file_put_contents($file, $content);
            echo "Removed from $file\n";
        }
    }
}
echo "Done\n";
?>
