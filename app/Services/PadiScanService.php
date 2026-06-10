<?php

namespace App\Services;

use App\Exceptions\PadiScanException;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\ConnectionException;

class PadiScanService
{
    /**
     * Pemetaan kelas dari FastAPI PadiScan v2 → disease_key internal Laravel.
     */
    private const CLASS_MAP = [
        'Bacterial_Blight'      => 'bacterial_leaf_blight',
        'bacterial_blight'      => 'bacterial_leaf_blight',
        'bacterial_leaf_blight' => 'bacterial_leaf_blight',
        'Blast'                 => 'leaf_blast',
        'blast'                 => 'leaf_blast',
        'leaf_blast'            => 'leaf_blast',
        'Brown_Spot'            => 'brown_spot',
        'brown_spot'            => 'brown_spot',
        'Tungro'                => 'tungro',
        'tungro'                => 'tungro',
        'Healthy'               => 'healthy',
        'healthy'               => 'healthy',
    ];

    protected string $apiUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->apiUrl  = rtrim(env('PADISCAN_API_URL', 'http://127.0.0.1:8000'), '/');
        $this->timeout = (int) env('PADISCAN_API_TIMEOUT', 30);
    }

    /**
     * Memanggil endpoint FastAPI untuk memprediksi penyakit daun padi.
     *
     * @param  string $imagePath  Path absolut ke file gambar di storage
     * @return array{
     *     predicted_class: string,
     *     confidence: float,
     *     class_probabilities: array
     * }
     * @throws PadiScanException  Jika FastAPI tidak dapat dijangkau, timeout, atau response tidak valid
     */
    public function predict(string $imagePath): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->attach('file', file_get_contents($imagePath), basename($imagePath))
                ->post($this->apiUrl . '/api/v1/predict');

            if ($response->failed()) {
                throw new PadiScanException(
                    'FastAPI mengembalikan status error: ' . $response->status()
                );
            }

            $data = $response->json();

            if (
                ! isset($data['predicted_class']) ||
                ! isset($data['confidence'])
            ) {
                throw new PadiScanException('Response tidak valid dari FastAPI');
            }

            $apiClass = (string) $data['predicted_class'];

            return [
                'predicted_class'      => $this->normalizePredictedClass($apiClass),
                'api_predicted_class'  => $apiClass,
                'confidence'           => (float) $data['confidence'],
                'class_probabilities'  => (array) ($data['class_probabilities'] ?? []),
            ];
        } catch (PadiScanException $e) {
            throw $e;
        } catch (ConnectionException $e) {
            throw new PadiScanException(
                'Tidak dapat terhubung ke server AI (FastAPI): ' . $e->getMessage(),
                0,
                $e
            );
        } catch (\Exception $e) {
            throw new PadiScanException(
                'Terjadi kesalahan saat memanggil server AI: ' . $e->getMessage(),
                0,
                $e
            );
        }
    }

    /**
     * Normalisasi label kelas dari FastAPI ke disease_key yang dipakai database.
     */
    public function normalizePredictedClass(string $apiClass): string
    {
        if (isset(self::CLASS_MAP[$apiClass])) {
            return self::CLASS_MAP[$apiClass];
        }

        foreach (self::CLASS_MAP as $key => $value) {
            if (strcasecmp($key, $apiClass) === 0) {
                return $value;
            }
        }

        return strtolower(str_replace([' ', '-'], '_', $apiClass));
    }

    /**
     * Memeriksa apakah FastAPI server sedang berjalan.
     *
     * @return bool  true jika server merespons HTTP 200, false jika tidak
     */
    public function isHealthy(): bool
    {
        try {
            $response = Http::timeout(5)
                ->get($this->apiUrl . '/api/v1/health');

            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }
}
