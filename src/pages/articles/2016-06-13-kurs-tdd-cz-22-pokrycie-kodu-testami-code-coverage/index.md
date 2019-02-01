---
title: "Kurs TDD cz. 22 — Pokrycie kodu testami (code coverage)"
date: "2016-06-13T19:56:51.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-22-pokrycie-kodu-testami-code-coverage/"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
description: "Przyjrzymy się bliżej tematowi pokrycia kodu testami (code coverage)."
---

**Pokrycie kodu (_code coverage_)** testami to:

> (liczba wyrażeń pokrytych testami) ÷ (liczba wszystkich wyrażeń) × 100%

Innymi słowy, jest to procentowy współczynnik pokrycia kodu testami. Pokrycie kodu najczęściej mierzy się badając liczbę wyrażeń (_statements_), choć niekiedy spotkać się można z pokryciem kodu opartym o:

- ilość linii kodu,
- ilość branchy (_branch coverage_), 
- ilość stanów (_condition coverage_),
- ilość funkcji, modułów lub metod.

Kiedyś w rozmowie jeden z menadżerów chwalił się, że jego zespół utrzymał założone 90% pokrycia kodu testami jednostkowymi. Z rozmowy z członkiem innego zespołu, programista poinformował mnie, że jego zespół ma roczny cel pokrycia nowo pisanego kodu testami jednostkowymi w stopniu 85%. Jest to przykład, który zapewne zna sporo ludzi ze swojego lub bliskiego podwórka. Czy zespół posiadający stopień pokrycia kodu równym 90% jest lepszy, skuteczniejszy, bądź bardziej produktywny niż zespół z pokryciem 85%? Jakie jest minimum i optimum pokrycia kodu testami jednostkowymi? Dlaczego żaden z zespołów nie postawił sobie za cel pokrycia stuprocentowego? Przyjrzymy się bliżej problemowi…

---

> "I expect a high level of coverage. Sometimes managers require one. There's a subtle difference." — Brian Marick

---

Pokrycie kodu testami jednostkowymi w 100% brzmi jak utopia. Jak to jednak najczęściej bywa, utopijne wizje zmieniają się bardzo szybko w piekło…

Pierwszy przykład: Nasze testy jednostkowe nie posiadają żadnych asercji, a ich pokrycie wynosi właśnie sto procent. Pożytek z takich testów jest żaden, jednak samo pokrycie jest "idealne".

Drugi prz... absurd – spójrzmy na przykładową metodę dzielenia:

```csharp
public float Divide(int dividend, int divisor)
{
    return (float)dividend / divisor;
}
```

 Tutaj, 100% pokrycia uzyskamy podstawiając dwie dowolne liczby. Samo pokrycie kodu testami jednostkowymi nie powie nam o jakości parametrów testowych, a w powyższym przypadku istnieje sporo przypadków brzegowych, które nie zostają uwzględnione w tej metryce.
 
 Przykład numer 3. Spójrzmy na kod:
 
 ```csharp
public class CustomerValidator
{
    public bool Validate(ICustomer customer)
    {
        if (customer.Age < 18) return false;
        return true;
    }
}
```

 Powyższa metoda wydaje się być na pierwszy rzut oka całkiem w porządku. Co jeśli natomiast podstawimy za zmienną customer wartość null? Nasze testy, pomimo pełnego pokrycia nie wskażą na ten problem. I pytanie do tego przykładu, która sytuacja jest korzystniejsza – czy lepiej jest zostawić kod taki jak powyżej, ale ze stuprocentowym pokryciem czy może lepiej jest obsłużyć przypadek nullowy kosztem pokrycia kodu?

---

> "100 percent coverage is still far from enough." — z _Facts and Fallacies of Software Engineering_

---

Czy posiadając upragione 100% możemy być pewni, że nasz kod jest równie wysoko wolny od błędów? Rozważamy cały czas przypadek testów jednostkowych, a jak wiemy, testy takie wykonywane są w izolacji. Jak się okazuje, blisko 35% defektów w oprogramowaniu powstaje przez brakujące ścieżki logiczne, a 40% na wskutek wykonania unikalnej ich kombinacji. Sto procent pokrycia kodu testami jednostkowymi nie wykryje nam tej klasy błędów.

Błędy wynikające z interakcji między obiektami nie mogą być pokryte w pełni przez testy jednostkowe. Rozwiązaniem tego problemu mogą być testy interakcyjne, akceptacyjne lub manualne.

# 80%, 85% czy 90%?

Skąd wzięły się te liczby? Dlaczego nie celujemy np. w 86% lub 91%? Co jeśli zespół osiągnął 1 punkt procentowy mniej niż założono? Problem nie leży w samej ilości pokrycia kodu. Główny zarzut dla podejścia pokrycia jako celu to fakt, że ta liczba nie ma odzwierciedlenia z rzeczywistą jakością kodu i testów. Wysoka wartość metryki może zasłaniać wiele ukrytych problemów związanych z jakością testów. Może też zmusić do optymalizacji testów względem tej metryki przy braku uwagi na samą jakość kodu i testów. W skrajnym przypadku zespół piszący słaby kod oraz kiepskie testy, może osiągnąć 100% pokrycia i spełnić dany cel. W takim scenariuszu metryka została spełniona, lecz korelacja z jakością jest odwrotnie proporcjonalna.

# Czy zrezygnować więc z tej metryki?

Samo pokrycie kodu testami to… doskonała metryka. Metryka, która pozwala znaleźć obszary kodu niepokryte testami. Narzędzie do mierzenia pokrycia kodu powinno należeć do obowiązkowego wyposażenia każdego programisty. Za pomocą tego typu narzędzia jesteśmy w stanie błyskawicznie ocenić, które części kodu nie zostały pokryte testami oraz przeanalizować czy do danej części kodu potrzebne są testy.

# Podsumowanie

Nie używaj metryki pokrycia kodu jako celu zespołowego. Nie ma korelacji między jakością kodu, a pokryciem kodu testami jednostkowymi. Wprowadzenie tej metryki może przyczynić się nawet do spadku jakości kodu.

Pokrycie kodu pozwala jednak w prosty sposób zidentyfikować obszar kodu niewytestowanego.

# Czytaj dalej

Polecam lekturę: [How much test coverage do you need? – The Testivus Answer](http://www.developertesting.com/archives/month200705/20070504-000425.html)

# Źródła

*   Robert L. Glass Facts and Fallacies of Software Engineering
*   Brian Merick [How to Misuse Code Coverage](http://www.exampler.com/testing-com/writings/coverage.pdf)
*   Martin Fowler [Test Coverage](http://martinfowler.com/bliki/TestCoverage.html)
*   Mark Seemann [Code coverage is a useless target measure](http://blog.ploeh.dk/2015/11/16/code-coverage-is-a-useless-target-measure/)