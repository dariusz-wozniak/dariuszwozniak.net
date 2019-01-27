---
title: Kurs TDD cz. 14 — Testowanie zależności (atrapy obiektów)
date: "2016-01-03T18:22:34.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-14-testowanie-zaleznosci-atrapy-obiektow"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "W części czternastej kursu Test-Driven Development omówimy technikę testowania zależności za pomocą atrap (ang. mock)."
---

W części czternastej kursu Test-Driven Development omówimy **technikę testowania zależności za pomocą atrap** (jęz. ang. "mock"). Test jednostkowy z definicji testuje zachowanie w izolacji, a więc bez zależności zewnętrznych. Takimi zależnościami są najczęściej inne klasy lub interfejsy, które posiadają zachowanie. Testy jednostkowe powinny być wykonane w izolacji, gdyż zewnętrzne zależności mogą być: - czasochłonne, - niezaimplementowane lub nieukończone (np. interfejs, klasa abstrakcyjna, zalążek metody, pusta metoda), - niedeterministyczne lub niepowtarzalne (np. aktualny czas), - związane z dużą ilością innych klas (high class coupling), - związane ze stanami, które są trudne do powtórzenia. Co jeśli nasz moduł korzysta z zewnętrznych modułów (klas, metod, interfejsów, itp.)? Do tego służy tytułowa atrapa. Atrapa żyje tylko i wyłącznie w świecie testów, a jej celem jest symulacja zachowania prawdziwej zależności w oparciu o dane wyjściowe, które sami zdefiniujemy. Dla .NET zostało napisanych sporo dobrych (a przy okazji złych) frameworków mających pomóc tworzenie atrap. W tej części kursu posłużymy się własnoręcznie napisaną atrapą, co pozwoli lepiej zrozumieć istotę problemu. W praktyce rzadko zachodzi konieczność pisania atrap ręcznie. W istocie, jeśli framework nie radzi sobie ze stworzeniem atrapy, to zazwyczaj oznacza to problem z naszym projektem klas czy zależności między nimi. W kolejnych częściach kursu zobaczymy w jaki sposób tworzy się atrapy w najpopularniejszych frameworkach dla .NET.

# Nomenklatura

Zanim przejdziemy do części właściwej, przyjrzyjmy się nieco nomenklaturze wokół testowania zależności. Zacznijmy od tego czym właściwie jest "mock" i jaki jest jego polski odpowiednik. "Mock" oznacza w języku angielskim "atrapę", czyli wg słownika języka polskiego PWN \[[http://sjp.pwn.pl/sjp/atrapa;2551130](http://sjp.pwn.pl/sjp/atrapa;2551130)\]:

> atrapa «imitacja jakiegoś przedmiotu»

Sam osobiście preferuję odpowiednik angielski "mock", "mockować" zamiast "atrapa", "tworzyć atrapę", gdyż jest to dla mnie bardziej naturalne. W tym artykule celowo używam określenia atrapa częściej niż mock, gdyż mock posiada w świecie testów jednostkowych wiele, wykluczających się niekiedy, definicji. Definicją mocka, a także innych pojęć (fake, stub, itp.) zajmiemy się w jednej z kolejnej części. W tym artykule mock czy atrapa przyjmuje definicję klasy z zadanymi przez nas oczekiwanymi wartościami wyjściowymi, dzięki której możemy przetestować daną zależność.

# Do dzieła!

Tym razem zamiast kalkulatora, weźmy na tapetę klasę która waliduje pewne warunki biznesowe. Najprostszy z brzegu przykład: klasa walidator do interfejsu ICustomer: 
```csharp
 public class CustomerValidator { public bool Validate(ICustomer customer) { throw new NotImplementedException(); } } 
```
 Interfejs ICustomer posiada metodę Age, która zwraca typ liczby całkowitej: 
```csharp
 public interface ICustomer { int GetAge(); } 
```
 Bazując na powyższym przykładzie, chcemy aby walidator sprawdził czy wiek użytkownika wynosi powyżej 18 lat. Nasza zależność (ang. dependency) to interfejs ICustomer, który posiada metodę GetAge. Zaraz, ale na jakiej podstawie wyliczany jest wiek klienta...? Hipotetycznie, przy takim designie interfejsu, data urodzenia mogłaby być wstrzykiwana przez konstruktor. Przy czym dla nas nie ma to większego znaczenia, gdyż nie chcemy zależeć w naszym teście od konkretnej implementacji. Wracając do punktu wyjścia, nasze warunki biznesowe dla walidatora interfejsu ICustomer są następujące:

1.  Gdy ICustomer jest nullem, wyrzuć wyjątek typu ArgumentNullException.
2.  Gdy wiek klienta wynosi poniżej 18, zwróć wartość false.
3.  W przeciwnym razie, zwróć wartość true.

## Kryterium nr 1: Gdy ICustomer jest nullem, wyrzuć wyjątek typu ArgumentNullException.

Dla przypadku numer 1, nie musimy tworzyć atrapy interfejsu ICustomer. Zgodnie z zasadami Test-Driven Development, zaczynamy od testu: 
```csharp
 \[Test\] public void WhenCustomerIsNull_ThenArgumentNullExceptionIsThrown() { var validator = new CustomerValidator(); Action action = () => validator.Validate(null); action.ShouldThrow<ArgumentNullException>(); } 
```
 Uwaga: W powyższym teście skorzystaliśmy z płynnych asercji opisanych w artykule: [„Płynne asercje”, czyli jak ułatwić sobie życie korzystając z Fluent Assertions?](http://dariuszwozniak.net/2015/11/30/plynne-asercje-czyli-jak-ulatwic-sobie-zycie-korzystajac-z-fluent-assertions/) Następnie, piszemy implementację spełniającą warunek w teście: 
```csharp
 public bool Validate(ICustomer customer) { if (customer == null) throw new ArgumentNullException(nameof(customer)); throw new NotImplementedException(); } 
```


## Kryterium nr 2: Gdy wiek klienta wynosi poniżej 18, zwróć wartość false.

Aby przetestować punkt drugi i trzeci, potrzebujemy atrapy dla wszystkich zależności walidatora. W naszym przypadku, mamy jedną taką zależność, a jest nią interfejs ICustomer. Zwykle atrapy tworzymy za pomocą frameworków, jednak aby zobrazować lepiej ich ideę, stworzymy taką atrapę ręcznie: 
```csharp
 internal class CustomerMock : ICustomer { private readonly int \_expectedAge; public CustomerMock(int expectedAge) { \_expectedAge = expectedAge; } public int GetAge() => \_expectedAge; } 
```
 I wszystko jasne! Stworzyliśmy atrapę, w której z góry możemy zdefiniować nasze dane wyjściowe, a więc w naszym przypadku - wiek. Nasz walidator jest już całkowicie pozbawiony zewnętrznych zależności, gdyż jedyny zależny interfejs posiada już atrapę. Piszemy więc test dla warunku nr 2: "Gdy wiek klienta wynosi poniżej 18, zwróć wartość false." 
```csharp
 \[Test\] public void WhenCustomerHasAgeLessThan18\_ThenValidationFails() { var validator = new CustomerValidator(); var customer = new CustomerMock(expectedAge: 16); bool validate = validator.Validate(customer); validate.Should().BeFalse(); } 
```
 I kod, który spełnia powyższy warunek: 
```csharp
 public bool Validate(ICustomer customer) { if (customer == null) throw new ArgumentNullException(nameof(customer)); return false; } 
```


## Kryterium nr 3: W przeciwnym razie, zwróć wartość true.

Na koniec został nam test dla warunku 3: "W przeciwnym razie, zwróć wartość true." Wykorzystamy atrybut Values, gdyż chcemy przetestować logikę dla wartości brzegowej (wiek = 18) i jednej wartości niebrzegowej (przykładowo - 19). 
```csharp
 \[Test\] public void WhenCustomerHasAgeGreaterThanOrEqualTo18_ThenValidationPasses(\[Values(18, 19)\] int expectedAge) { var validator = new CustomerValidator(); var customer = new CustomerMock(expectedAge: expectedAge); bool validate = validator.Validate(customer); validate.Should().BeTrue(); } 
```
 Oraz finalny kod walidatora: 
```csharp
 public class CustomerValidator { private const int MinimumAge = 18; public bool Validate(ICustomer customer) { if (customer == null) throw new ArgumentNullException(nameof(customer)); if (customer.GetAge() < MinimumAge) return false; return true; } } 
```
 Voilà - Zakończyliśmy pisać nasz walidator przy użyciu TDD!

# Podsumowanie

Nasz walidator testuje zależność zewnętrzną nie polegając na jej implementacji. Stworzyliśmy ręcznie atrapę pochodną od interfejsu ICustomer, w której możemy zdefiniować dane wyjściowe. W dalszych rozdziałach poznamy sposoby tworzenia atrap za pomocą już istniejących frameworków. Tymczasem zachęcam do dalszej zabawy z ręcznymi atrapami. A jeśli ktoś ma więcej czasu, to sugeruję napisać mini-framework do generowania takich atrap. Przypominam, że kod źródłowy całego kursu TDD, jak i tego rozdziału jest dostępny na GitHubie: [https://github.com/dariusz-wozniak/TddCourse](https://github.com/dariusz-wozniak/TddCourse).

# Linki zewnętrzne

*   [List of Automated Testing (TDD/BDD/ATDD/SBE) Tools and Frameworks for .NET](https://github.com/dariusz-wozniak/List-of-Testing-Tools-and-Frameworks-for-.NET)
*   [Wikipedia (PL): Atrapa obiektu](https://pl.wikipedia.org/wiki/Atrapa_obiektu)
*   [Wikipedia (EN): Mock object](https://en.wikipedia.org/wiki/Mock_object)