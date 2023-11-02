---
title: Kurs TDD cz. 1 — Wstęp do TDD
redirect_from: 
  - "/2013/04/20/kurs-tdd-czesc-1-wstep/"
date: "2013-04-20T17:54:27.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-1-wstep/"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
description: "Swój pierwszy wpis na blogu zacznę od części numeros unos cyklu poświęconemu Test-Driven Development. TDD w ostatnim czasie święci triumfy i to nie bez powodu. Dlaczego tak jest i czy gra jest warta świeczki?"
---

Swój pierwszy wpis na blogu zacznę od części _numeros unos_ cyklu poświęconemu Test-Driven Development. TDD w ostatnim czasie święci triumfy i to nie bez powodu. Dlaczego tak jest i czy gra jest warta świeczki?

W tym kursie znajdzie się miejsce na przedstawienie czym jest TDD, jak powinno się pisać według tej filozofii, jakie to ma wady i zalety. W dalszych częściach kursu przejdę do omówienia bardziej technicznych kwestii – napiszemy pierwszy test jednostkowy (_unit test_), omówię różnice między testami jednostkowymi, a integracyjnymi, przedstawię świat _test-doubles_ i opiszę najlepsze narzędzia do testowania dla C#.

# Czym TDD jest, a czym nie jest?

Na początek bardzo ważna kwestia, która może być niezwykle myląca – wbrew swojej nazwie, Test-Driven Development **nie jest techniką służącą testowaniu**. Nie chodzi o samo w sobie pisanie testów do kodu czy też powielanie pracy testera. **TDD jest techniką programowania**, jest techniką pisania i budowania kodu. W następnych akapitach wyjaśnię dlaczego. Głównym celem _test-driven_ jest:

1.  Zachowanie wysokiej jakości designu w swoich klasach.
2.  Uniknięcie złej interpretacji wymagań biznesowych.
3.  Zachowanie prostoty w kodzie: YAGNI + KISS.

W TDD nie chodzi o testowanie. Testowalny kod, a w konsekwencji automatyczny i natychmiastowy _feedback_ o błędzie w systemie jest w TDD rzeczą dodatkową, ale nie nadrzędną. Kluczowym aspektem TDD jest pisanie testu przed napisaniem docelowego kodu. Można pisać testy równolegle w trakcie pisania logiki biznesowej, można też pisać testy po implementacji, ale to już wtedy nie jest Test-Driven Development. W TDD testy piszemy zawsze jako pierwsze, przed kodem. Przyjrzyjmy się jeszcze raz powyższym trzem celom i rozwińmy je w kontekście tego co zostało już powiedziane.

1.  Napisanie testu przed implementacją kodu wymusza przemyślenie designu w naszym projekcie. Klasa w teście jednostkowym powinna być odizolowana od innych klas. Programista musi zatem zidentyfikować te miejsca, gdzie zależności (_shims_) występują i zaprojektować klasy z ich uwzględnieniem. TDD wymusza dobry design poprzez rozpoznanie interakcji i interfejsów między klasami. Uzyskujemy dzięki temu klasy luźno związane ze sobą (_loosely coupled_).
1.  Mówi się powszechnie, że testy jednostkowe są dokumentacją programisty. Dlaczego? Testy pisane są zawsze w kontekście dokumentacji. Dzięki temu, testujemy i implementujemy kod, który spełnia wymagania klienta (ta... ok, zgoda, ale zawsze możemy być bliżej niż nie-TDD) Niby oczywista rzecz, ale trzeba pamiętać o tym, że dokumentacja zawiera zazwyczaj wiele niejednoznaczności, które mogą być interpretowane na różne sposoby. Rozważając testy pod kątem wymagań musimy też zdefiniować punkty brzegowe każdego kryterium, np. dzielenie przez zero lub wpisanie litery zamiast liczby jako dane wejściowe do funkcji.
2.  YAGNI jest akronimem od _You Aren’t Going to Need It_, z ang. "nie będziesz tego potrzebować", a KISS to _Keep It Simple Stupid_, czyli "to ma być proste, głupku". W TDD nie piszemy testów i nie implementujemy kodu do rzeczy, których nie potrzebujemy teraz, a które być może ktoś będzie w przyszłości potrzebować. Jeśli kiedyś zajdzie potrzeba użycia nowej funkcjonalności, wtedy to napiszesz. Simple :) 
Więcej interesujących rzeczy o YAGNI możecie poczytać na [http://c2.com/cgi/wiki?YouArentGonnaNeedIt](http://c2.com/cgi/wiki?YouArentGonnaNeedIt).

# Red-Green-Refactor

Kluczowym aspektem TDD jest cykl pisania testów. Najpierw piszemy testy, następnie implementujemy funkcjonalność, a na końcu refaktoruzyjemy. Cykl nazywany jest najczęściej Red-Green-Refactor lub TDD Mantra, składa się z trzech etapów, które jako całość są powtarzane:

1.  **Red**: Piszemy test, który się nie powodzi.
    1.  Testy piszemy do pustych, ale istniejących już klas i metod (dzięki czemu możemy korzystać z IntelliSense).
    2.  Uruchamiamy test i oczekujemy, że się nie powiedzie.
2.  **Green**: Piszemy kod aby testy się powiodły.
    1.  Implementujemy kod (według dokumentacji).
    2.  Uruchamiamy testy. Wszystkie testy muszą się powieść.
3.  **Refactor**: Refaktoryzacja kodu – wprowadzenie zmian, które poprawiają jakość kodu (np. usunięcie duplikacji), ale nie zmieniają jego funkcjonalności.
    1.  Po refaktoryzacji, uruchamiamy wszystkie testy by sprawdzić czy czegoś nie zepsuliśmy.
    2.  Ten punkt jest często lekceważony lub pomijany w procesie. Nie zapominajmy o tym, równie ważnym co dwa poprzednie, elemencie.

![red-green-refactor-diagram](rgd.png)
<div style="text-align: center">Diagram Red-Green-Refactor</div>

# Zalety i wady TDD

Zalety TDD:

*   Dokładne zrozumienie wymagań dokumentacji. Testy piszemy zawsze względem dokumentacji.
*   Testy jako dokumentacja jest zawsze aktualna w czasie.
*   Testy nie wprowadzają niejednoznaczności, cechy którą może posiadać dokumentacja papierowa.
*   Wymuszanie dobrego designu kodu i szybka identyfikacja potencjalnych błędów w designie, np. problem z zależnościami.
*   Lepsza zarządzalność kodu w czasie.
*   Łatwiejsze i bezpieczniejsze łatanie kodu.
*   Natychmiastowy i automatyczny _feedback_ na temat błędu w kodzie.
*   Testy regresyjne pozwalają stwierdzić czy po naszych zmianach nie zepsuliśmy przy okazji czegoś w innej części systemu.
*   Krótszy, całkowity, czas procesu developmentu.
*   Dużo mniej ręcznego debugowania.

Wady TDD:

*   Czas i wysiłek na trening i przygotowanie developerów.
*   Potrzeba dyscypliny osobistej i zespołowej. Testy muszą być zarządzane i poprawiane w czasie w taki sam sposób jak cała reszta kodu.
*   Początkowa percepcja dłuższego czasu developmentu.
*   Nie wszyscy menadżerowie dają się przekonać. Biją argumentem dwukrotnie dłuższego developmentu, choć całkowity czas trwania developmentu (wliczając szukanie i naprawę błędów, nie tylko pisanie kodu) w TDD jest krótszy niż w nie-TDD.

# TDD, a agile

W obiegowej opinii Test-Driven Development jest częścią agile. Błąd! Agile i TDD to dwie rozłączne sprawy, obydwie istnieją niezależnie. Agile manifesto nie wspomina ani o TDD, ani o testach jednostkowych. Agile mówi o kodzie testowanym, natomiast nie określa czy kod ma być pisany przed-po-czy w trakcie pisania kodu. TDD natomiast tak –testy powinny być pierwsze. TDD może być, i bardzo często jest, procesem współbieżnym z agile, ale należy pamiętać, że nie jest i nie był jego częścią.

# Podsumowanie

W Test-Driven Development nie chodzi o... testowanie, a prostotę i design. Dla programisty chcącego zacząć pisać według TDD najważniejsze jest zrozumienie cyklu Red-Green-Refactor. Testy piszemy w pierwszej kolejności, następnie piszemy implementację kodu, a następnie dokonujemy refaktoryzacji. _Test-first_ jest zatem główną ideą tej filozofii. Kod pokryty testami jednostkowymi jest równocześnie najbardziej aktualną formą dokumentacji. Korzyści płynące ze stosowania TDD zostały udowodnione na przykładzie wielu projektów (będzie odrębny wpis traktujący o tym). Programista piszący po raz pierwszy odczuwa dyskomfort płynący z podwójnie dłuższego procesu pisania kodu, jednak kod ten jest zredukowany w całym procesie, gdyż w rezultacie finalny kod jest czystszy i zawiera mniej błędów. A to wszystko dzięki technice TDD!

<!-- tdd-course-infobox-start -->
<div class="boxBorder">

<div style="text-align: center; font-size: 40px">Kurs TDD</div>

----

<div class="row">
<div class="column">

Część I: Testy jednostkowe – wstęp

1. Wstęp do TDD
2. [Testy jednostkowe, a integracyjne](/posts/kurs-tdd-2-testy-jednostkowe-a-testy-integracyjne/)
3. [Struktura testu, czyli Arrange-Act-Assert](/posts/kurs-tdd-3-struktura-test-czyli-arrange-act-assert)
4. [Nasz pierwszy test jednostkowy](/posts/kurs-tdd-4-nasz-pierwszy-test-jednostkowy)
5. [Nasz drugi test jednostkowy](/posts/kurs-tdd-5-nasz-drugi-test-jednostkowy)
6. [Dobre i złe praktyki testów jednostkowych](/posts/kurs-tdd-6-dobre-i-zle-praktyki-testow-jednostkowych)
7. [Inicjalizacja i czyszczenie danych (SetUp i TearDown)](/posts/kurs-tdd-7-inicjalizacja-i-czyszczenie-danych-setup-i-teardown/)
8. [Testy parametryzowane](/posts/kurs-tdd-8-testy-parametryzowane)
9. [Testy kombinatoryczne i sekwencyjne](/posts/kurs-tdd-9-testy-kombinatoryczne-i-sekwencyjne)
10. [Teorie](/posts/kurs-tdd-10-teorie)
11. [Testowanie klas generycznych](/posts/kurs-tdd-11-testowanie-klas-generycznych)
12. [Classic vs. Constraint Assert Model](/posts/kurs-tdd-12-classic-vs-constraint-assert-model)
13. [Testowanie wywołań asynchronicznych (async await)](/posts/kurs-tdd-13-testowanie-wywolan-asynchronicznych-async-await)

</div>

<div class="column">

Część II: Atrapy obiektów

14. [Testowanie zależności – atrapy obiektów](/posts/kurs-tdd-14-testowanie-zaleznosci-atrapy-obiektow)
2. [Moq cz. 1 – Wstęp](/posts/kurs-tdd-15-wstep-do-moq)
3. [Moq cz. 2 – Argument Matching, Verify, Callback](/posts/kurs-tdd-16-zaawansowane-techniki-moq-argument-matching-verify-callback)
4. [FakeItEasy](/posts/kurs-tdd-17-fakeiteasy)
5. [NSubstitute](/posts/kurs-tdd-18-nsubstitute)
6. [Mock, stub, fake, spy, dummy](/posts/kurs-tdd-19-mock-stub-fake-spy-dummy)
7. [Mockowanie DateTime.Now, random, static, itp.](/posts/kurs-tdd-20-mockowanie-datetime-now-random-static-itp)
8. [Rodzaje frameworków do tworzenia atrap](/posts/kurs-tdd-21-rodzaje-frameworkow-do-tworzenia-atrap/)

Część III: Teoria

22. [Pokrycie kodu testami (Code Coverage)](/posts/kurs-tdd-22-pokrycie-kodu-testami-code-coverage/)
1. [Czy to się opłaca?](/posts/kurs-tdd-23-czy-to-sie-oplaca/)
1. [Czy pisać testy jednostkowe do istniejącego kodu (legacy code)?](/posts/kurs-tdd-24-czy-pisac-testy-jednostkowe-do-istniejacego-kodu-legacy-code/)
1. [Otwarte pytania](/posts/kurs-tdd-25-otwarte-pytania/)

</div>
</div>
</div>
<!-- tdd-course-infobox-end -->