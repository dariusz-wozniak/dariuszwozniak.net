---
title: Kurs TDD cz. 9 — Testy kombinatoryczne i sekwencyjne
date: "2015-02-09T19:45:09.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-9-testy-kombinatoryczne-i-sekwencyjne"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "Naturalnym krokiem po omówieniu testów parametryzowanych jest przejście do testów kombinatorycznych i sekwencyjnych. Do dyspozycji mamy dwa atrybuty NUnita — [Combinatorial] oraz [Sequential]."
---

Naturalnym krokiem po [omówieniu testów parametryzowanych](/posts/kurs-tdd-8-testy-parametryzowane "Kurs TDD cz. 8: Testy parametryzowane") jest przejście do testów kombinatorycznych i sekwencyjnych. Do dyspozycji mamy dwa atrybuty NUnita — `[Combinatorial]` oraz `[Sequential]`. Sprawa jest bardzo prosta, więc zrozumienie działania tych dwóch funkcji nie przysporzy żadnych problemów.

Bieżący kod z tego kursu znajduje się na GitHubie: [https://github.com/dariusz-wozniak/TddCourse/](https://github.com/dariusz-wozniak/TddCourse/).

# Testy kombinatoryczne

Kombinatoryczne testy wykonywane są na zestawie wszystkich możliwych przypadków. Wartości przekazywane są w atrybucie parametru `[Values]`. Tak naprawdę, użycie atrybutu `[Combinatorial]` jest opcjonalne – gdy metoda będzie miała co najmniej dwa parametry opatrzone atrybutem `[Values]`, test kombinatoryczny będzie domyślnym dla takiego scenariusza. Przykład użycia testu kombinatorycznego: 

```csharp
[Test]
[Combinatorial]
public void Divide_DividendIsPositiveAndDivisorIsNegative_ReturnsNegativeQuotient(
    [Values(1, 2, 3, 4)] int dividend,
    [Values(-1, -2, -3)] int divisor)
{
    var calc = new Calculator();
    float quotient = calc.Divide(dividend, divisor);
 
    Assert.That(quotient < 0);
}
```

 W powyższym przykładzie chcemy udowodnić, że jeśli dzielna jest dodatnia, a dzielnik ujemny, to wynik ma być ujemny. Dla wartości dzielnej aplikujemy cztery wartości, dla dzielnika 3, a zatem 4 x 3 = 12 przypadków:

 ```
(1,-1)
(1,-2)
(1,-3)
(2,-1)
(2,-2)
(2,-3)
(3,-1)
(3,-2)
(3,-3)
(4,-1)
(4,-2)
(4,-3)
```

# Testy sekwencyjne

W teście sekwencyjnym dane wykonywane są w porządku, w jakim zostały zdefiniowane. Podobnie jak w przypadku testów kombinatorycznych, dane wprowadzamy w atrybucie parametru `[Values]`. Przykład: 

```csharp
[Test]
[Sequential]
public void Divide_DivisorIsNegativeOfDividend_ReturnsMinusOne(
    [Values(1, 2, 30)] int dividend,
    [Values(-1, -2, -30)] int divisor)
{
    var calc = new Calculator();
    float quotient = calc.Divide(dividend, divisor);
 
    Assert.That(quotient == -1);
}

Powyższy
```

 Powyższy test ma dowieść, że a ÷ (-a) = -1. Dla powyższego zestawu danych, zostały wygenerowane następujące przypadki:
 
```
(1,-1)
(2,-2)
(30,-30)
```
 
 A co jeśli ilość parametrów się nie zgadza? NUnit przypisze brakującym elementom wartość `default(T)`.

# Podsumowanie

Do testów kombinatorycznych i sekwencyjnych wykorzystujemy atrybuty `[Combinatorial]` i `[Sequential]`. Zobacz też: [Kurs TDD cz. 8: Testy parametryzowane](/posts/kurs-tdd-8-testy-parametryzowane "Kurs TDD cz. 8: Testy parametryzowane").