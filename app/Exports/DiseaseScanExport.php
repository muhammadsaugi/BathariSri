<?php

namespace App\Exports;

use App\Models\DiseaseScan;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DiseaseScanExport implements FromQuery, WithHeadings, WithMapping
{
    public function __construct(private array $filters = []) {}

    
    public function query()
    {
        return DiseaseScan::with(['user:id,name', 'lahan:id,nama_lahan'])
            ->when($this->filters['predicted_class'] ?? null, fn ($q, $v) => $q->where('predicted_class', $v))
            ->when($this->filters['date_from'] ?? null, fn ($q, $v) => $q->whereDate('scanned_at', '>=', $v))
            ->when($this->filters['date_to'] ?? null, fn ($q, $v) => $q->whereDate('scanned_at', '<=', $v))
            ->latest('scanned_at');
    }

    
    public function headings(): array
    {
        return [
            'ID Scan',
            'Nama Petani',
            'Nama Lahan',
            'Tanggal Scan',
            'Predicted Class',
            'Confidence',
            'Severity',
        ];
    }

    
    public function map($scan): array
    {
        return [
            $scan->id,
            $scan->user?->name ?? '-',
            $scan->lahan?->nama_lahan ?? '-',
            $scan->scanned_at?->format('Y-m-d H:i:s') ?? '-',
            $scan->predicted_class,
            $scan->confidence,
            $scan->severity ?? '-',
        ];
    }
}
