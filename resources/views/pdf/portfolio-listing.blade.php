<!DOCTYPE html>
<html lang="{{ $locale }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $item->title }}</title>
    <style>
        @page { margin: 28px 32px; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1a1a1a;
            line-height: 1.45;
        }
        h1 {
            font-size: 18px;
            margin: 0 0 8px 0;
            font-weight: 700;
            color: #0f172a;
        }
        .meta {
            font-size: 10px;
            color: #475569;
            margin-bottom: 14px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 10px;
        }
        .meta span { margin-right: 14px; }
        h2 {
            font-size: 12px;
            margin: 16px 0 8px 0;
            font-weight: 700;
            color: #0f172a;
        }
        table.specs {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        table.specs td {
            padding: 6px 8px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }
        table.specs td.label {
            width: 34%;
            font-weight: 700;
            background: #f8fafc;
        }
        .description {
            text-align: justify;
        }
        .description p { margin: 0 0 8px 0; }
        .footer {
            margin-top: 18px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
            font-size: 9px;
            color: #64748b;
        }
        .brand { font-weight: 700; color: #0f172a; }
    </style>
</head>
<body>
    <h1>{{ $item->title }}</h1>
    <div class="meta">
        <span><strong>{{ $labels['ref'] }}</strong> {{ $item->publicReference() }}</span>
        @if($listingUpdated)
            <span><strong>{{ $labels['updated'] }}</strong> {{ $listingUpdated }}</span>
        @endif
        @if($item->date)
            <span><strong>{{ $labels['date'] }}</strong> {{ $item->date }}</span>
        @endif
        @if($item->price !== null && $item->price !== '')
            <span><strong>{{ $labels['price'] }}</strong> {{ number_format((float) $item->price, 2, ',', '.') }} €</span>
        @endif
    </div>

    @if($item->short_description)
        <p style="margin:0 0 12px 0;font-size:10px;color:#334155;">{{ strip_tags($item->short_description) }}</p>
    @endif

    @if(!empty($specs))
        <h2>{{ $labels['specs'] }}</h2>
        <table class="specs">
            @foreach($specs as $row)
                <tr>
                    <td class="label">{{ $row['label'] ?? '' }}</td>
                    <td>{{ $row['value'] ?? '' }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    @if($descriptionPlain)
        <h2>{{ $labels['description'] }}</h2>
        <div class="description">
            @foreach(explode("\n\n", $descriptionPlain) as $block)
                @if(trim($block) !== '')
                    <p>{{ trim($block) }}</p>
                @endif
            @endforeach
        </div>
    @endif

    <div class="footer">
        <span class="brand">{{ config('app.name') }}</span>
        @if(!empty($contact['phone']))
            &nbsp;·&nbsp; {{ $contact['phone'] }}
        @endif
        @if(!empty($contact['email']))
            &nbsp;·&nbsp; {{ $contact['email'] }}
        @endif
        @if(!empty($listingUrl))
            <br><span style="margin-top:4px;display:inline-block;">{{ $labels['source'] }} {{ $listingUrl }}</span>
        @endif
    </div>
</body>
</html>
