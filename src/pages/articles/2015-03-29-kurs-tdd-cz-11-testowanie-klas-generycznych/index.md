---
title: Kurs TDD cz. 11 — Testowanie klas generycznych
date: "2015-03-29T12:48:16.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-11-testowanie-klas-generycznych"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "W niniejszym artykule przyjrzymy się w jaki sposób możemy przetestować klasy generyczne za pomocą funkcjonalności NUnita pod nazwą Generic Test Fixture."
---

W niniejszym artykule przyjrzymy się w jaki sposób możemy przetestować klasy generyczne za pomocą funkcjonalności NUnita pod nazwą Generic Test Fixture. Dla przykładu, weźmy sobie metodę dodawania w generycznej klasie kalkulatora: 

```csharp
public class GenericCalculator<T>
{
    public T Add(T a, T b)
    {
        return (dynamic) a + (dynamic) b;
    }
}
```

 W NUnit sprawa z testowaniem klas generycznych ma się prosto, a służy do tego tzw. Generic Test Fixture. Aby przetestować taką klasę, należy w parametrze atrybutu `[TestFixture]` podać generyczny typ (jeden lub więcej), który będzie przekazywany niżej do testów. Jeżeli chcemy stworzyć instancję naszej generycznej klasy, należy skorzystać z [`new()` constraint](https://msdn.microsoft.com/en-us/library/sd2w2ew5%28v=vs.140%29.aspx "new() constraint").
 
 Dla klasy `GenericCalculator`, chcielibyśmy przetestować metodę dodawania dla typów numerycznych – int, float, double i decimal. Test dla takiej kombinacji będzie wyglądał następująco: 

```csharp
[TestFixture(typeof(int))]
[TestFixture(typeof(float))]
[TestFixture(typeof(double))]
[TestFixture(typeof(decimal))]
public class GenericCalculatorTests<T>
{
    [Test]
    public void AdditionTest()
    {
        var calculator = new GenericCalculator<T>();
 
        dynamic result = calculator.Add((dynamic) 2, (dynamic) 3);
 
        Assert.That(result, Is.EqualTo(5));
    }
}
```

 Do naszego testu przekazane są więc cztery numeryczne typy i dla każdego z nich sprawdzany jest wynik dodawania. Wynikowo, otrzymujemy cztery testy, każdy z innym typem `GenericCalculator`.
 
 Jeśli chcemy stworzyć instancję klasy generycznej, musimy podać wspomniany wcześniej `new()` constraint. Dla przykładu, weźmy sobie test na właściwość `Count` listy. Po dodaniu 2 elementów, Count musi być równy 2: 

```csharp
[TestFixture(typeof(ArrayList))]
[TestFixture(typeof(List<int>))]
[TestFixture(typeof(Collection<int>))]
public class ListsTests<T> where T : IList, new()
{
    [Test]
    public void CountTest()
    {
        var list = new T { 2, 3 };
 
        Assert.That(list, Has.Count.EqualTo(2));
    }
}
```

 Poszło gładko! Generic Test Fixture pozwala w prosty sposób na przekazanie zadeklarowanych przez nas generycznych typów do testów.
 
 P.S. Kod z niniejszego artykułu i całego kursu dostępny jest na GitHubie: [https://github.com/dariusz-wozniak/TddCourse](https://github.com/dariusz-wozniak/TddCourse/ "https://github.com/dariusz-wozniak/TddCours").