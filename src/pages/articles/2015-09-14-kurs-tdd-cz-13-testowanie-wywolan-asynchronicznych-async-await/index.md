---
title: Kurs TDD cz. 13 — Testowanie wywołań asynchronicznych (async await)
date: "2015-09-14T18:01:36.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-13-testowanie-wywolan-asynchronicznych-async-await"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "C# 5.0 wniósł wiele dobroci, m.in. obsługę wywołań asynchronicznych za pomocą słów kluczowych async i await. Rozwiązanie, ze względu na prostotę obsługi i skuteczność, cieszy się do dziś sporą popularnością. Jak testować wywołania asynchroniczne? Tego dowiemy się w tym odcinku!"
---

C# 5.0 wniósł wiele dobroci, m.in. obsługę wywołań asynchronicznych za pomocą słów kluczowych `async` i `await`. Rozwiązanie, ze względu na prostotę obsługi i skuteczność, cieszy się do dziś sporą popularnością. Jak testować wywołania asynchroniczne? Tego dowiemy się w tym odcinku!

Załóżmy, że nasza metoda testowa to asynchroniczne wywołanie dzielenia (na potrzeby artykułu, dodaliśmy wywołanie Task.Delay): 
```csharp
 public async Task<float> DivideAsync(double dividend, double divisor) { if (divisor == 0) throw new DivideByZeroException(); await Task.Delay(millisecondsDelay: 1000) .ConfigureAwait(continueOnCapturedContext: false); return (float)dividend/(float)divisor; } 
```
 W jaki sposób możemy napisać testy do powyższego kodu?

## Sposób 1: standardowy

Najprostszy sposób przetestowania asynchronicznej metody przedstawiony jest poniżej: 
```csharp
 \[Test\] public async void DivideAsyncTest() { var calculator = new Calculator(); float quotient = await calculator.DivideAsync(10, 2); Assert.That(quotient, Is.EqualTo(5)); } 
```


## Sposób 2: async await i wyrażenie lambda

Drugim sposobem jest wykorzystanie wyrażeń lambda w kontekście wywołań asynchronicznych: 
```csharp
 \[Test\] public void DivideAsyncLambdaTest() { var calculator = new Calculator(); Assert.That(async () => await calculator.DivideAsync(10, 2), Is.EqualTo(5)); } 
```


## Testowanie wyjątków

Aby przetestować czy asynchroniczna metoda rzuca wyjątek, możemy wykorzystać wyrażenie lambda. Tutaj test będzie wyglądać następująco: 
```csharp
 \[Test\] public void WhenDivisorIsZero_ThenDivideByZeroExceptionIsThrown() { var calculator = new Calculator(); Assert.Throws<DivideByZeroException>(async () => await calculator.DivideAsync(10, 0)); } 
```


## Na koniec

Baczny czytelnik powinien zauważyć, że najpierw napisaliśmy kod, a później testy. W tym przypadku omawiamy jednak techniczne aspekty testów jednostkowych; pisząc kod nie zapominajmy o kolejności najpierw testy, później logika biznesowa. Kod źródłowy z tej części kursu jest dostępny na GitHubie: [https://github.com/dariusz-wozniak/TddCourse/](https://github.com/dariusz-wozniak/TddCourse/).

## Źródła

*   [http://simoneb.github.io/blog/2013/01/19/async-support-in-nunit/](http://simoneb.github.io/blog/2013/01/19/async-support-in-nunit/)
*   [http://www.thomaslevesque.com/2015/02/01/async-unit-tests-with-nunit/](http://www.thomaslevesque.com/2015/02/01/async-unit-tests-with-nunit/)