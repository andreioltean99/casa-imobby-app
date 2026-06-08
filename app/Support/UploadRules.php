<?php

namespace App\Support;

class UploadRules
{
    public static function maxImageKb(): int
    {
        return (int) config('uploads.max_image_kb', 1024 * 1024);
    }

    /**
     * @return list<string>
     */
    public static function nullableImage(): array
    {
        return ['nullable', 'image', 'max:'.self::maxImageKb()];
    }

    /**
     * @return list<string>
     */
    public static function requiredImage(): array
    {
        return ['required', 'image', 'max:'.self::maxImageKb()];
    }

    /**
     * @return list<string>
     */
    public static function image(): array
    {
        return ['image', 'max:'.self::maxImageKb()];
    }
}
