<?php

namespace App\Services;


class FuzzyLogicEngine
{
  
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

  
  public function andMin(array $values): float
  {
    if ($values === []) {
      return 0.0;
    }

    return min($values);
  }
}
