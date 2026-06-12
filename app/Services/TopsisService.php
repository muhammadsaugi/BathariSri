<?php

namespace App\Services;

use InvalidArgumentException;

class TopsisService
{
    
    public function calculate(array $alternatives, array $weights, array $types): array
    {
        
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

        
        
        $keys = array_keys($alternatives);
        $matrix = array_values($alternatives);

        
        $normalized = $this->normalize($matrix);

        
        $weighted = $this->weight($normalized, $weights);

        
        [$idealPos, $idealNeg] = $this->idealSolutions($weighted, $types);

        
        $scores = $this->computeScores($weighted, $idealPos, $idealNeg);

        
        $results = [];
        foreach ($scores as $i => $score) {
            $results[] = [
                'alternative' => $keys[$i],
                'score' => $score,
                'rank' => 0, 
            ];
        }

        
        usort($results, static function (array $a, array $b): int {
            
            return $b['score'] <=> $a['score'];
        });

        
        foreach ($results as $idx => &$item) {
            $item['rank'] = $idx + 1;
        }
        unset($item);

        return $results;
    }

    
    
    

    
    private function normalize(array $matrix): array
    {
        $n = count($matrix);
        $m = count($matrix[0]);

        
        $denominators = array_fill(0, $m, 0.0);
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $m; $j++) {
                $denominators[$j] += $matrix[$i][$j] ** 2;
            }
        }
        for ($j = 0; $j < $m; $j++) {
            
            $denominators[$j] = sqrt($denominators[$j]);
        }

        
        $normalized = [];
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $m; $j++) {
                $normalized[$i][$j] = $matrix[$i][$j] / $denominators[$j];
            }
        }

        return $normalized;
    }

    
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

    
    private function idealSolutions(array $weighted, array $types): array
    {
        $n = count($weighted);
        $m = count($types);

        $idealPos = [];
        $idealNeg = [];

        for ($j = 0; $j < $m; $j++) {
            
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
                
                $idealPos[$j] = $minVal;
                $idealNeg[$j] = $maxVal;
            }
        }

        return [$idealPos, $idealNeg];
    }

    
    private function computeScores(array $weighted, array $idealPos, array $idealNeg): array
    {
        $n = count($weighted);
        $m = count($idealPos);

        $scores = [];
        for ($i = 0; $i < $n; $i++) {
            $dPlusSq = 0.0;
            $dMinusSq = 0.0;

            for ($j = 0; $j < $m; $j++) {
                $dPlusSq += ($weighted[$i][$j] - $idealPos[$j]) ** 2;
                $dMinusSq += ($weighted[$i][$j] - $idealNeg[$j]) ** 2;
            }

            $dPlus = sqrt($dPlusSq);
            $dMinus = sqrt($dMinusSq);

            $denominator = $dPlus + $dMinus;

            if ($denominator == 0.0) {
                
                $scores[$i] = 0.5;
            } else {
                $scores[$i] = $dMinus / $denominator;
            }
        }

        return $scores;
    }
}
