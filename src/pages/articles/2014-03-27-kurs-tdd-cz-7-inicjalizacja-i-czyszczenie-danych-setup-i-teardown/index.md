---
title: Kurs TDD cz. 7 — Inicjalizacja i czyszczenie danych (SetUp i TearDown)
date: "2014-03-27T14:51:40.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-7-inicjalizacja-i-czyszczenie-danych-setup-i-teardown/"
category: "TDD"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "W tej części kursu zajmiemy się pojęciem inicjalizacji i czyszczenia danych."
---

W tej części kursu zajmiemy się pojęciem inicjalizacji i czyszczenia danych. Wielkiej filozofii tutaj nie ma; w NUnit działa to tak:

*   Jeśli chcemy, aby jedna z metod uruchamiała się **przed każdym uruchomieniem naszego testu**, aby np. inicjalizować dane, nakładamy na nią atrybut \[SetUp\].
*   Jeśli zechcemy, aby metoda uruchamiała się **po każdym uruchomieniu testu** w celu np. czyszczenia danych — nakładamy atrybut \[TearDown\].

Reguły gry są jasne:

*   Jeśli użyjemy więcej niż jeden atrybut \[SetUp\] i \[TearDown\] dla jednego \[TestFixture\], to kod skompiluje się poprawnie, ale **testy nie uruchomią się.**
*   Jeśli chcemy natomiast uruchomić kod jednorazowo przed wywołaniem\\po wywołaniu **wszystkich** naszych testów w obrębie \[TestFixture\], możemy skorzystać z atrybutów \[TestFixtureSetUp\] i \[TestFixtureTearDown\].

Całą ideę prezentuje poniższy kod: 
```csharp
 \[TestFixture\] public class SuccessTests { \[SetUp\] public void Init() {...} \[TearDown\] public void Dispose() {...} \[Test\] public void Add() {...} } 
```


# Dlaczego tego nie stosować?

Z mojego punktu widzenia, nie powinniśmy używać atrybutów \[SetUp\] i \[TearDown\] w świecie testów jednostkowych. Główne powody to:

*   Kod, w którym korzystamy z tych atrybutów staje się trudniejszy do czytania...
*   ...oraz debugowania
*   W niektórych przypadkach, możemy zainicjalizować więcej zmiennych niż tak naprawdę potrzebujemy.
*   Jeśli pojawi się błąd w naszych testach, będzie on trudniejszy do zlokalizowania.
*   Dodatkowy problem to fakt, że programista musi znać te atrybuty. Niby znikoma, ale jednak istniejąca krzywa uczenia się.

Co zatem używać do inicjalizacji? Najprostsze metody są najlepsze, a zatem:

*   Jeśli nie mamy zbyt wielu rzeczy do ustawienia, możemy sobie pozwolić na [duplikację kodu](http://dariuszwozniak.net/2013/11/18/kurs-tdd-czesc-6-dobre-i-zle-praktyki-testow-jednostkowych/) w naszych testach.
*   W przypadku kiedy musimy złożyć coś większego, najlepiej przenieść wspólny kod do metody. Należy też zadać sobie pytanie o to, czy aby nasze klasy są poprawnie zbudowane pod kątem obiektowego projektowania.

Czyszczenie danych? Taki problem nie powinien przecież występować w przypadku testów jednostkowych, gdyż nie korzystamy z zewnętrznych zależności, prawda?

# Konkluzja?

**Atrybuty \[SetUp\] i \[TearDown\] nie powinny być używane w naszych testach jednostkowych.** Ich stosowanie prowadzi do tego, że nasze testy są trudniejsze w zrozumieniu. Zamiast atrybutów, lepiej posłużyć się duplikacją kodu (możemy sobie na to pozwolić w świecie testów jednostkowych) lub wrzuceniem wspólnego kodu do metody.