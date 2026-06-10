<?php

namespace App\Services;

use InvalidArgumentException;

/**
 * TopsisService — Implementasi TOPSIS universal (6 langkah).
 *
 * Dipakai oleh Modul 3 (SPK Pupuk), Modul 4 (Prediksi Panen),
 * dan Modul 5 (Rekomendasi Limbah).
 *
 * Guarantees:
 *   - Rank membentuk permutasi {1,...,n} tanpa duplikasi.
 *   - Semua score ∈ [0.0, 1.0].
 *   - Input identik → output identik (deterministik).
 */
class TopsisService
{
    /**
     * Menghitung ranking TOPSIS untuk sejumlah alternatif.
     *
     * @param array $alternatives  ['A1' => [val1, val2, ...], 'A2' => [...], ...]
     *                             Nilai sudah dalam bentuk numerik (skala 1–5), semua > 0.
     * @param array $weights       [0.25, 0.22, 0.20, 0.18, 0.15]
     *                             Jumlah total harus ≈ 1.0 (toleransi ±0.001).
     * @param array $types         ['benefit', 'cost', 'benefit', ...]
     *                             Panjang harus sama dengan jumlah kriteria.
     *
     * @return array [
     *     ['alternative' => 'A1', 'score' => 0.87, 'rank' => 1],
     *     ...
     * ]  — sudah diurutkan dari rank 1 (terbaik)
     *
     * @throws InvalidArgumentException jika preconditions dilanggar.
     */
    public function calculate(array $alternatives, array $weights, array $types): array
    {
        // --- Validasi preconditions ---
        if (count($alternatives) < 2) {
            throw new InvalidArgumentException(
                'Minimal 2 alternatif diperlukan untuk kalkulasi TOPSIS.'
            );
        }

        $numCriteria = count($weights);

        if (count($types) !== $numCriteria) {
            throw new InvalidArgumentException(
                'Jumlah weights dan types harus sama.'
            );
        }

        foreach ($alternatives as $key => $values) {
            if (count($values) !== $numCriteria) {
                throw new InvalidArgumentException(
                    "Alternatif '{$key}' memiliki jumlah nilai yang berbeda dengan jumlah kriteria."
                );
            }
            foreach ($values as $v) {
                if ($v <= 0) {
                    throw new InvalidArgumentException(
                        "Semua nilai alternatif harus > 0. Alternatif '{$key}' memiliki nilai ≤ 0."
                    );
                }
            }
        }

        // Validasi total bobot ≈ 1.0 (toleransi ±0.001)
        $weightSum = array_sum($weights);
        if (abs($weightSum - 1.0) > 0.001) {
            throw new InvalidArgumentException(
                "Total bobot harus ≈ 1.0 (±0.001). Total saat ini: {$weightSum}"
            );
        }

        foreach ($types as $type) {
            if ($type !== 'benefit' && $type !== 'cost') {
                throw new InvalidArgumentException(
                    "Tipe kriteria harus 'benefit' atau 'cost'. Ditemukan: '{$type}'"
                );
            }
        }

        // Konversi ke matriks numerik terindeks (0-based) agar lebih mudah dioperasikan.
        // Simpan urutan kunci asli untuk output akhir.
        $keys   = array_keys($alternatives);
        $matrix = array_values($alternatives);

        // STEP 1: Normalisasi
        $normalized = $this->normalize($matrix);

        // STEP 2: Pembobotan
        $weighted = $this->weight($normalized, $weights);

        // STEP 3: Solusi Ideal Positif (A+) dan Negatif (A-)
        [$idealPos, $idealNeg] = $this->idealSolutions($weighted, $types);

        // STEP 4 & 5: Jarak Euclidean dan Skor Preferensi
        $scores = $this->computeScores($weighted, $idealPos, $idealNeg);

        // STEP 6: Susun hasil + Ranking (sort descending berdasarkan score)
        $results = [];
        foreach ($scores as $i => $score) {
            $results[] = [
                'alternative' => $keys[$i],
                'score'       => $score,
                'rank'        => 0, // akan diisi setelah sorting
            ];
        }

        // Sort descending berdasarkan score (score tertinggi = rank 1)
        usort($results, static function (array $a, array $b): int {
            // Gunakan spaceship operator; balik urutan untuk descending
            return $b['score'] <=> $a['score'];
        });

        // Assign rank mulai dari 1
        foreach ($results as $idx => &$item) {
            $item['rank'] = $idx + 1;
        }
        unset($item);

        return $results;
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Langkah 1: Normalisasi matriks keputusan (Vector Normalization).
     *
     * r_ij = x_ij / sqrt( Σ x_kj² untuk semua k )
     *
     * @param  array $matrix  Array of rows: [[val0, val1, ...], ...]  (0-indexed)
     * @return array          Matriks ternormalisasi dengan dimensi yang sama.
     */
    private function normalize(array $matrix): array
    {
        $n = count($matrix);
        $m = count($matrix[0]);

        // Hitung denominator per kolom: sqrt(Σ x_kj²)
        $denominators = array_fill(0, $m, 0.0);
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $m; $j++) {
                $denominators[$j] += $matrix[$i][$j] ** 2;
            }
        }
        for ($j = 0; $j < $m; $j++) {
            // Denominator > 0 dijamin karena precondition semua nilai > 0.
            $denominators[$j] = sqrt($denominators[$j]);
        }

        // Normalisasi setiap elemen
        $normalized = [];
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $m; $j++) {
                $normalized[$i][$j] = $matrix[$i][$j] / $denominators[$j];
            }
        }

        return $normalized;
    }

    /**
     * Langkah 2: Matriks ternormalisasi tertimbang.
     *
     * v_ij = w_j × r_ij
     *
     * @param  array $normalized  Matriks ternormalisasi dari step 1.
     * @param  array $weights     Vektor bobot [w_0, w_1, ...].
     * @return array              Matriks berbobot.
     */
    private function weight(array $normalized, array $weights): array
    {
        $n = count($normalized);
        $m = count($weights);

        $weighted = [];
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $m; $j++) {
                $weighted[$i][$j] = $weights[$j] * $normalized[$i][$j];
            }
        }

        return $weighted;
    }

    /**
     * Langkah 3: Tentukan Solusi Ideal Positif (A+) dan Negatif (A-).
     *
     * benefit: A+[j] = max(v_ij), A-[j] = min(v_ij)
     * cost:    A+[j] = min(v_ij), A-[j] = max(v_ij)
     *
     * @param  array $weighted  Matriks berbobot dari step 2.
     * @param  array $types     ['benefit'|'cost', ...] untuk setiap kriteria.
     * @return array            [ $idealPos, $idealNeg ] — masing-masing vektor panjang m.
     */
    private function idealSolutions(array $weighted, array $types): array
    {
        $n = count($weighted);
        $m = count($types);

        $idealPos = [];
        $idealNeg = [];

        for ($j = 0; $j < $m; $j++) {
            // Ambil semua nilai pada kolom j
            $colValues = [];
            for ($i = 0; $i < $n; $i++) {
                $colValues[] = $weighted[$i][$j];
            }

            $maxVal = max($colValues);
            $minVal = min($colValues);

            if ($types[$j] === 'benefit') {
                $idealPos[$j] = $maxVal;
                $idealNeg[$j] = $minVal;
            } else {
                // cost: lebih kecil lebih baik
                $idealPos[$j] = $minVal;
                $idealNeg[$j] = $maxVal;
            }
        }

        return [$idealPos, $idealNeg];
    }

    /**
     * Langkah 4 & 5: Hitung jarak Euclidean dan skor preferensi.
     *
     * D+_i = sqrt( Σ (v_ij - A+[j])² )
     * D-_i = sqrt( Σ (v_ij - A-[j])² )
     * Ci   = D-_i / (D+_i + D-_i)
     *
     * Edge case: jika D+ + D- == 0 (semua alternatif identik pada semua kriteria),
     * score = 0.5 (titik tengah, tidak ada preferensi).
     *
     * @param  array $weighted   Matriks berbobot dari step 2.
     * @param  array $idealPos   Vektor A+ dari step 3.
     * @param  array $idealNeg   Vektor A- dari step 3.
     * @return array             Vektor skor Ci untuk setiap alternatif.
     */
    private function computeScores(array $weighted, array $idealPos, array $idealNeg): array
    {
        $n = count($weighted);
        $m = count($idealPos);

        $scores = [];
        for ($i = 0; $i < $n; $i++) {
            $dPlusSq  = 0.0;
            $dMinusSq = 0.0;

            for ($j = 0; $j < $m; $j++) {
                $dPlusSq  += ($weighted[$i][$j] - $idealPos[$j]) ** 2;
                $dMinusSq += ($weighted[$i][$j] - $idealNeg[$j]) ** 2;
            }

            $dPlus  = sqrt($dPlusSq);
            $dMinus = sqrt($dMinusSq);

            $denominator = $dPlus + $dMinus;

            if ($denominator == 0.0) {
                // Edge case: semua alternatif identik → tidak ada preferensi
                $scores[$i] = 0.5;
            } else {
                $scores[$i] = $dMinus / $denominator;
            }
        }

        return $scores;
    }
}
