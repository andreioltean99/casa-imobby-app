<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Maximum admin image upload size (kilobytes)
    |--------------------------------------------------------------------------
    |
    | Laravel's file "max" rule uses kilobytes. Default: 1 GB (1024 * 1024 KB).
    | Also keep PHP upload_max_filesize / post_max_size and nginx client_max_body_size
    | in sync (see Dockerfile and nginx.conf).
    |
    */

    'max_image_kb' => (int) env('UPLOAD_MAX_IMAGE_KB', 1024 * 1024),

];
