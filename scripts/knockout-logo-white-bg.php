<?php

/**
 * Build a true RGBA PNG (flat light background → transparent) for the contact panel only.
 * Main navbar uses public/logo-casa-imobby.png (unchanged).
 */
declare(strict_types=1);

$src = $argv[1] ?? dirname(__DIR__).'/public/logo-casa-imobby.png';
$dst = $argv[2] ?? dirname(__DIR__).'/public/logo-casa-imobby-contact.png';

$bytes = @file_get_contents($src);
if ($bytes === false) {
    fwrite(STDERR, "Cannot read: {$src}\n");
    exit(1);
}

$srcIm = @imagecreatefromstring($bytes);
if ($srcIm === false) {
    fwrite(STDERR, "Unsupported image: {$src}\n");
    exit(1);
}

$w = imagesx($srcIm);
$h = imagesy($srcIm);

$out = imagecreatetruecolor($w, $h);
imagealphablending($out, false);
imagesavealpha($out, true);

$transparent = imagecolorallocatealpha($out, 0, 0, 0, 127);
imagefilledrectangle($out, 0, 0, $w, $h, $transparent);

imagealphablending($out, true);
imagecopy($out, $srcIm, 0, 0, 0, 0, $w, $h);
imagealphablending($out, false);
imagedestroy($srcIm);

for ($y = 0; $y < $h; $y++) {
    for ($x = 0; $x < $w; $x++) {
        $rgb = imagecolorat($out, $x, $y);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;

        $lum = 0.299 * $r + 0.587 * $g + 0.114 * $b;
        $chroma = max($r, $g, $b) - min($r, $g, $b);

        if ($lum >= 244 && $chroma <= 28) {
            imagesetpixel($out, $x, $y, $transparent);
        }
    }
}

if (! imagepng($out, $dst, 6)) {
    fwrite(STDERR, "Cannot write: {$dst}\n");
    exit(1);
}

imagedestroy($out);

echo "Wrote: {$dst} ({$w}x{$h})\n";
