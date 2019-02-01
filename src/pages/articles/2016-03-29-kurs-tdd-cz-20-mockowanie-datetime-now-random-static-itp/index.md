---
title: Kurs TDD cz. 20 — Mockowanie DateTime.Now, random, static, itp.
date: "2016-03-29T18:41:45.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-20-mockowanie-datetime-now-random-static-itp"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
description: "Jedną z największych trudności dla osoby zaczynającej przygodę z testami jednostkowymi są metody i klasy statyczne oraz niederministyczne lub/i niepowtarzalne zależności. Testy jednostkowe muszą być deterministyczne i powtarzalne. Musimy przyjąć zatem strategię wstrzykiwania alternatywnej implementacji dla wywołań DateTime.Now, funkcji losującej, itp. W tym artykule przedstawię jedną ze strategii tworzenia atrap dla tego typu zależności."
---

Jedną z największych trudności dla osoby zaczynającej przygodę z testami jednostkowymi są:

*   **Metody i klasy statyczne.**
    *   Darmowe frameworki ([Moq](/posts/kurs-tdd-15-wstep-do-moq), [FakeItEasy](/posts/kurs-tdd-17-fakeiteasy), [NSubstitute](/posts/kurs-tdd-18-nsubstitute)) nie wspierają tworzenia atrap dla metod i klas statycznych.
*   **Niederministyczne lub/i niepowtarzalne zależności.**
    *   Testy jednostkowe muszą być deterministyczne i powtarzalne.
    *   Musimy przyjąć zatem strategię wstrzykiwania alternatywnej implementacji dla wywołań DateTime.Now, funkcji losującej, itp.

W tym artykule przedstawię jedną ze strategii tworzenia atrap dla tego typu zależności.

# Co będziemy testować?

Przyjmijmy, że chcemy przetestować metodę GetAge klasy AgeCalculator która, jak sama nazwa wskazuje, zwraca wiek danej osoby. Przykładowa implementacja ([źródło](http://stackoverflow.com/a/229/297823)) wygląda następująco:

```csharp
public class AgeCalculator
{
    public int GetAge(DateTime dateOfBirth)
    {
        DateTime now = DateTime.Now;
        int age = now.Year - dateOfBirth.Year;
 
        if (now.Month < dateOfBirth.Month ||
           (now.Month == dateOfBirth.Month && now.Day < dateOfBirth.Day))
        {
            age--;
        }
 
        return age;
    }
}
```
 Oczywiście, nie jest to algorytm idealny i sam nie użyłbym go u siebie ze względu na brak wsparcia dla:

*   lat przestępnych,
*   stref czasowych,
*   różnych niuansów związanych z kalendarzami lokalnymi,
*   przypadków podróżujących z prędkością bliską światła 😊

Algorytm jest jednak prosty i spełnia nasze założenia, tj. wywołuje metodę `DateTime.Now`, która nie jest powtarzalna.

# Wzorzec Provider

Jednym z najprostszych rozwiązań jest oddelegowanie kontroli nad daną funkcjonalnością do osobnej klasy. W naszym przypadku będzie to oddelegowanie wywołania `DateTime.Now`:

```csharp
public interface IDateTimeProvider
{
    DateTime GetDateTime();
}
 
public class DateTimeProvider : IDateTimeProvider
{
    public DateTime GetDateTime() => DateTime.Now;
}
```

 Zmieniony kalkulator wykorzystujący providera wygląda następująco:
 
```csharp
public class AgeCalculator
{
    private readonly IDateTimeProvider _dateTimeProvider;
 
    public AgeCalculator(IDateTimeProvider dateTimeProvider)
    {
        if (dateTimeProvider == null) throw new ArgumentNullException(nameof(dateTimeProvider));
        _dateTimeProvider = dateTimeProvider;
    }
 
    public int GetAge(DateTime dateOfBirth)
    {
        DateTime now = _dateTimeProvider.GetDateTime();
        // ...
    }
}
```

 Strategia ta pozwala na podmianę implementacji providera na testowy:
 
```csharp
[Test]
public void Test()
{
    var currentDate = new DateTime(2015, 1, 1);
    
    var dateTimeProvider = Mock.Of<IDateTimeProvider>(provider =>
      provider.GetDateTime() == currentDate);
 
    var ageCalculator = new AgeCalculator(dateTimeProvider);
 
    var dateOfBirth = new DateTime(1990, 1, 1);
    int age = ageCalculator.GetAge(dateOfBirth);
 
    age.Should().Be(25);
}
```

 Podczas testu domyślna strategia pobierania daty zostaje podmieniona na testową, której wartość można dowolnie dostosowywać do założeń naszego testu.
 
 Alternatywnie, można stworzyć provider typu generycznego, czyli `IProvider<T>`.
 
 W taki sam sposób możemy opakować (ang. _wrap_) wywołania klas lub/i metod statycznych. Lepszy sufiks dla takiego wzorca będzie "Wrapper".

# Pytania otwarte (a niektóre zamknięte)

Na deser zostawiam kilka pytań czytelnikowi:

*   Co, oprócz testowalności, zyskujemy dzięki powyższej strategii?
*   Czy nie lepiej pozostawić logikę biznesową niezmienioną, a w teście modyfikować daty w zależności od DateTime.Now?
*   Czy nie lepiej przekazać DateTime.Now jako parametr metody?
*   Czy nie lepiej przekazać delegat lub Func<DateTime> jako parametr metody lub w konstruktorze klasy?
*   Czy nie lepiej stworzyć singleton lub globalną klasę statyczną, która posiada domyślną implementację, którą można podmienić?
*   Czy w naszym przypadku mamy do czynienia z potencjalnym race condition?

# Kod źródłowy

Przypominam, że kod źródłowy całego kursu TDD, jak i tego rozdziału jest dostępny na GitHubie: [https://github.com/dariusz-wozniak/TddCourse](https://github.com/dariusz-wozniak/TddCourse).

# Źródła

*   [Mark Seemann: Testing Against The Current Time \[Google Cache\]](http://webcache.googleusercontent.com/search?q=cache:23h1pN30EYoJ:blogs.msdn.com/b/ploeh/archive/2007/05/12/testingagainstthecurrenttime.aspx+&cd=1&hl=en&ct=clnk&gl=pl&client=ubuntu)
*   [Unit Testing: DateTime.Now \[StackOverflow\]](http://stackoverflow.com/questions/2425721/unit-testing-datetime-now/2425739)