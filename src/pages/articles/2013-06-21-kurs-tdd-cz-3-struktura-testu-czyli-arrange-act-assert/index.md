---
title: Kurs TDD cz. 3 — Struktura testu, czyli Arrange-Act-Assert
date: "2013-06-21T19:59:27.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-3-struktura-test-czyli-arrange-act-assert"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
description: "Czas na omówienie jak, strukturalnie, powinien wyglądać wzorcowy test jednostkowy (Arrange-Act-Assert)."
---

Po [wstępie do TDD](/posts/kurs-tdd-1-wstep/ "Kurs TDD część 1: Wstęp") i [omówieniu różnic między testami jednostkowymi, a integracyjnymi](/posts/kurs-tdd-2-testy-jednostkowe-a-testy-integracyjne/ "Kurs TDD część 2: Testy jednostkowe, a testy integracyjne"), czas na omówienie jak strukturalnie powinien wyglądać wzorcowy test jednostkowy. Będzie to pewnie najkrótszy wpis tej serii, ale jednocześnie jeden z najważniejszych. Pozwoli bowiem na pierwszy kontakt z testem jednostkowym w praktyce.

# Arrange–Act–Assert

Strukturę testu jednostkowego definiuje zasada Arrange–Act–Assert (AAA):

*   **Arrange**: wszystkie dane wejściowe i _preconditions,_
*   **Act**: działanie na metodzie/funkcji/klasie testowanej,
*   **Assert**: upewnienie się, że zwrócone wartości są zgodne z oczekiwanymi.

Jakie korzyści płyną ze stosowania tego wzorca? Przede wszystkim porządek; wzorzec zapewnia logiczny porządek w pojedynczym teście — część przygotowania danych wejściowych jest odseparowana od części weryfikacyjnej. Ponadto, nie mieszamy naszych asercji w trakcie wywołania testowanego obiektu.

## Przykład

Jak mawiali Chińczycy—Jeden kod mówi więcej niż tysiąc słów. Poniższy kod napisany jest zgodnie z AAA: 
```csharp
[Test]
public void Add_AddingTwoValues_ReturnsProperValue()
{
    // Arrange:
    var calc = new Calculator();
 
    // Act:
    int result = calc.Add(2, 3);
 
    // Assert:
    Assert.AreEqual(5, result);
}
```
 Na powyższym, bardzo prostym, przykładzie testujemy funkcjonalność dodawania klasy `Calculator`. Chcemy sprawdzić czy (niebrzegowy) przypadek dodania dwóch liczb zwróci oczekiwany wynik.
 
 W pierwszej części metody inicjalizujemy obiekt klasy Calculator. Wszelkie inicjalizacje zmiennych, obiektów oraz _mocków_ (o czym będzie w późniejszych częściach) znajdować powinny się w pierwszej części metody — **Arrange**.
 
 W kolejnej linijce wykonujemy proste działanie arytmetyczne: dodajemy do siebie dwie liczby całkowite – 2 i 3. Celem tego etapu, **Act**, jest uruchomienie funkcjonalności testowanej klasy. Będzie to zazwyczaj uruchomienie metody, choć nie jest to reguła (zawsze możemy przetestować np. odczyt/zapis danego property).
 
 Ostatnia linijka to wykonanie asercji (**Assert**). Sprawdzamy, czy zwrócony wynik z powyższego wywołania jest taki sam jak oczekujemy. Tutaj oczekujemy, że metoda naszej klasy po dodaniu liczb 2 i 3, zwróci nam liczbę 5.
 
 I jeszcze kilka kwestii technicznych. Atrybut `[Test]` i klasa `Assert` pochodzą z NUnita, który należy do rodziny frameworków testowych. Kolejność parametrów metody `AreEqual` jest następująca: pierwszym parametrem jest wartość oczekiwana, drugim zwrócona przez działanie naszej metody. W kolejnej części cyklu dowiemy się jak, krok po kroku, stworzyć pierwszy test jednostkowy. Zrozumienie wzorca Arrange-Act-Assert jest niezbędne do budowania dobrych testów.

# Zobacz też

*   [http://c2.com/cgi/wiki?ArrangeActAssert](http://c2.com/cgi/wiki?ArrangeActAssert "http://c2.com/cgi/wiki?ArrangeActAssert")