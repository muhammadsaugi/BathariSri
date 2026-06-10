<?php

namespace App\Services;

/**
 * Mesin Fuzzy Inference System (Mamdani) sederhana tanpa library eksternal.
 * Mendukung membership segitiga/trapesium dan defuzzifikasi centroid.
 */
class FuzzyLogicEngine
{
  /**
   * Membership function segitiga: naik dari a ke b, turun dari b ke c.
   */
  public function triangular(float $x, float $a, float $b, float $c): float
  {
    if ($x <= $a || $x >= $c) {
      return 0.0;
    }

    if ($x === $b) {
      return 1.0;
    }

    if ($x > $a && $x < $b) {
      return ($b - $a) === 0.0 ? 0.0 : ($x - $a) / ($b - $a);
    }

    return ($c - $b) === 0.0 ? 0.0 : ($c - $x) / ($c - $b);
  }

  /**
   * Membership function trapesium.
   */
  public function trapezoidal(float $x, float $a, float $b, float $c, float $d): float
  {
    if ($x <= $a || $x >= $d) {
      return 0.0;
    }

    if ($x >= $b && $x <= $c) {
      return 1.0;
    }

    if ($x > $a && $x < $b) {
      return ($b - $a) === 0.0 ? 0.0 : ($x - $a) / ($b - $a);
    }

    return ($d - $c) === 0.0 ? 0.0 : ($d - $x) / ($d - $c);
  }

  /**
   * Fuzzifikasi nilai crisp ke derajat keanggotaan beberapa label linguistik.
   *
   * @param  array<string, array{0:float,1:float,2:float,3?:float}>  $sets
   * @return array<string, float>
   */
  public function fuzzify(float $value, array $sets): array
  {
    $membership = [];

    foreach ($sets as $label => $params) {
      $membership[$label] = count($params) === 4
        ? $this->trapezoidal($value, $params[0], $params[1], $params[2], $params[3])
        : $this->triangular($value, $params[0], $params[1], $params[2]);
    }

    return $membership;
  }

  /**
   * Defuzzifikasi centroid dari agregasi aturan (output fuzzy pada universe kontinu).
   *
   * @param  callable(float): float  $aggregatedMembership
   */
  public function defuzzifyCentroid(float $min, float $max, callable $aggregatedMembership, float $step = 0.01): float
  {
    $numerator   = 0.0;
    $denominator = 0.0;

    for ($x = $min; $x <= $max + 1e-9; $x += $step) {
      $mu = $aggregatedMembership($x);
      $numerator   += $x * $mu;
      $denominator += $mu;
    }

    if ($denominator <= 0.0) {
      return ($min + $max) / 2;
    }

    return $numerator / $denominator;
  }

  /**
   * Operator AND (interseksi) — minimum.
   *
   * @param  float[]  $values
   */
  public function andMin(array $values): float
  {
    if ($values === []) {
      return 0.0;
    }

    return min($values);
  }
}
