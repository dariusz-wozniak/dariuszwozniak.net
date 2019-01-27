---
title: Kurs TDD cz. 24 — Czy pisać testy jednostkowe do istniejącego kodu (legacy code)?
date: "2016-08-22T19:52:44.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-24-czy-pisac-testy-jednostkowe-do-istniejacego-kodu-legacy-code/"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
description: "Najprawdopodobniej spotkałeś się z tym problemem: Kod zastany, napisany przez nas lub nie, na pewno nie perfekcyjny i ostatecznie bez testów jednostkowych (ang. legacy code). Co teraz? Wstrzymać dotychczasowe prace nad projektem i pisać testy jednostkowe? A może całkowicie zaniechać pisania testów, bo skoro nigdy nie było testów, to po co pisać je teraz? Do tej pory omawialiśmy TDD z perspektywy pisania nowego kodu. Jak wygląda sytuacja w przypadku istniejącego już kodu?"
---

Najprawdopodobniej spotkałeś się z tym problemem: Kod zastany, napisany przez nas lub nie, na pewno nie perfekcyjny i ostatecznie bez testów jednostkowych (ang. _legacy code_). Co teraz? Wstrzymać dotychczasowe prace nad projektem i pisać testy jednostkowe? A może całkowicie zaniechać pisania testów, bo skoro nigdy nie było testów, to po co pisać je teraz? Do tej pory omawialiśmy TDD z perspektywy pisania nowego kodu. Jak wygląda sytuacja w przypadku istniejącego już kodu? Na początek warto zastanowić się nad kilkoma pytaniami:

*   Czy powinno się poświęcać czas i zasoby, czasem wstrzymując dotychczasowe prace, na pisanie testów jednostkowych do kodu już istniejącego?
*   …Jeśli tak, to którą część aplikacji pokryć w pierwszej kolejności?
*   Jak bezpiecznie refaktoryzować kod, aby nie wprowadzić błędu do istniejącego kodu?
*   W jaki sposób powinno się pisać kody jednostkowe przy wprowadzaniu zmian do istniejącego kodu?

# Kod nietestowalny

Klasy i metody statyczne, ukryte zależności, długie metody i inne problemy stoją na przeszkodzie napisania krótkiego, zwięzłego, a przede wszystkim dobrego kodu jednostkowego. Do kodu nie napisanego wg TDD, dopisanie testów jednostkowych bez dodatkowej refaktoryzacji, może okazać się niemożliwe. I tu pojawia się słowo-klucz: "refaktoryzacja". Wiele osób na widok kodu istniejącego chce zabrać się na naprawę świata (a także kodu ;-)). Refaktoryzacja to, według definicji, wprowadzenie zmian w kodzie bez zmiany jej funkcjonalności. A w jaki sposób sprawdzimy czy zmieniliśmy nasz kod nie zmieniając przez przypadek dotychczasowego zachowania, skoro nie mamy jeszcze testów jednostkowych? Odpowiedź na to może być trudna; przedstawię tutaj jedną ze strategii prac nad takim kodem.

# Po pierwsze, nie robić nic

Nie robić nic… z istniejącym już kodem. Taki kod to tysiące, czasem miliony linii, a z nim związane wszystkie zawiłe i czasem bardzo sztywne zależności, nie do końca znane wymagania biznesowe, zawiłe algorytmy, kod spaghetti, [lasagne](http://c2.com/cgi/wiki?LasagnaCode) i ukryte hacki. Kwestia pierwsza: ryzyko. "Skoro działa, lepiej tego nie dotykać". Jak już zostało wcześniej powiedziane, jeśli kod nie był pisany pod testy jednostkowe, to niemożliwym może okazać się napisanie dobrego testu bez refaktoryzacji. Jeśli już będziemy rekfaktoryzować kod, to ryzyko wprowadzenia błędu może okazać się wysokie. Kwestia druga: czas. Jeśli uznać, że pisanie testów do kodu to mniej więcej 50% czasu programisty, to czas na napisanie testów jest równy pracy wszystkich programistów razy ich ilość. Przy czym, pisanie testów do istniejącego kodu to ciut trudniejsza sprawa i do 50% trzeba dodać kilka (niekiedy kilkanaście/-dziesiąt) punktów procentowych.

# …ale pisać testy do kodu nowego…

W przypadku gdy aplikacja nie posiada jeszcze testów jednostkowych, to pisanie nowego kodu wg TDD powinno być oczywiste. Tak samo oczywiste powinno być wprowadzenie zasad i reguł dotyczących jakości ich pisania, a przede wszystkim traktowanie testów jak kodu produkcyjnego. Wiąże się to również z przygotowaniem infrastuktury buildów i systemu ciągłej integracji (ang. _Continuous Integration_), m.in. uruchamiane testy jednostkowe z każdym buildem i błąd w przypadku czerwonego testu.

# …i zmienianego.

Jeśli musimy odkurzyć stary kod i wprowadzić zmianę lub poprawkę, to warto to robić mądrze, bezpiecznie i z testami jednostkowymi :) Ale w jaki sposób? Istnieje sporo metod refaktoryzacji, które służą wprowadzeniu poprawek w istniejącym kodzie. W najprostszym uogólnieniu, opierają się one na:

*   Grupowaniu i ekstraktowaniu logiki biznesowej do oddzielnych metod lub klas.
*   Wydzieleniu nowej funkcjonalności do odrębnej metody lub klasy, a następnie wstrzyknięcie jej do starego kodu.
*   Odizolowaniu możliwie małej części starego kodu (np. pętli), napisanie testów jednostkowych a następnie wprowadzenie zmiany.
*   Eksponowanie zależności na zewnątrz.

# Testy integracyjne i akceptacyjne

Ważną rolę w stabilizacji i rozwoju projektu mają testy integracyjne i akceptacyjne. Posiadając pełną regresję funkcjonalną, możemy pozwolić sobie na zmiany w systemie z dużą większą dozą pewności niż w przypadku jej braku. Mając więc wolny czas i zasoby na ustabilizowanie projektu, warto rozważyć inwestycję w te dwa rodzaje testów. Dzięki nim znacząco nabierzemy pewności i zmniejszymy ryzyko w przypadku grzebania w starych bebechach. Wbrew pozorom takie testy – pomimo, że są bardziej złożone – mogą okazać się prostsze w napisaniu niż testy jednostkowe do istniejącego już kodu. Związanie testów integracyjnych i akceptacyjnych z systemem buildów oraz dążenie do funkcjonalnej regresji przyniesie wymierne korzyści, nie wprowadzając przy tym ryzyka związanego z testami jednostkowymi i niezbędną przy tym refaktoryzacją.

# Alternatywnie

Alternatywą do nie pisania testów do starego kodu jest jego stabilizacja przez refaktoryzację lub przepisanie danego modułu. Którego? Można posłużyć się kilkoma metrykami:

*   Złożoność kodu
*   Zależności w kodzie
*   Łatwość w napisaniu testów (np. klasy Utilities testować powinno się relatywnie łatwo)
*   Priorytet w systemie (funkcje core'owe, najważniejsze moduły biznesowe)
*   Częstość zmian w module

Mając zidentyfikowane metryki, trzeba obliczyć wartości dla poszczególnych modułów i przyjąć strategię dla której napisanie testów jednostkowych jest najbardziej sensonwe (czytaj: opłacalne).

# Podsumowanie

Na pytanie, co robić z kodem istniejącym – posprzątać, dopisać testy jednostkowe, ujednolicić względem jednego stylu, usunąć warningi? – najlepszym wydaje się być odpowiedź:

> "Po pierwsze, przestań tworzyć nowy kod legacy" \[[źródło](http://stackoverflow.com/a/146951/297823)\]

Zasada – nie dotykać istniejącego kodu i pisać testy do nowego/zmienianego kodu jest jedną ze strategii, co nie oznacza że w każdym scenariuszu okazuje się być najlepszą. Jeśli rozważamy natomiast napisanie testów do starego kodu, to warto wziąć pod uwagę ryzyko jakie wiąże się z refaktoryzacją (lub przepisaniem kodu na nowo) i rozważyć poprawę pokrycia kodu, ale testami integracyjnymi lub/i akceptacyjnymi. W przypadku, gdy chcemy obrać inną strategię i zechcemy napisać testy jednostkowe do starego kodu, to warto zidentyfikować metryki, które posłużą w wyborze do której części systemu mamy je pisać.

# P.S. Refaktoryzacja — co warto poczytać

Lekturą obowiązkową przy nauce metod refaktoryzacji jest _Refactoring Effectively with Legacy Code_ Michaela Feathersa. Można również zasięgnąć do:

*   12-stronicowego opracowania Feathersa, napisanego 2 lata przed książką: [http://www.netobjectives.com/system/files/WorkingEffectivelyWithLegacyCode.pdf](http://www.netobjectives.com/system/files/WorkingEffectivelyWithLegacyCode.pdf)
*   Prezentacji: [http://www.slideshare.net/nashjain/working-effectively-with-legacy-code-presentation](http://www.slideshare.net/nashjain/working-effectively-with-legacy-code-presentation)
*   30 minutowego wywiadu z Feathersem w formie podcastu: [http://www.hanselminutes.com/165/working-effectively-with-legacy-code-with-michael-feathers\](http://www.hanselminutes.com/165/working-effectively-with-legacy-code-with-michael-feathers)

Innym pomocnym źródłem jest katalog refaktoryzacji spisanych przez Martina Fowlera: [http://www.refactoring.com/catalog/](http://www.refactoring.com/catalog/). Oczywiście, nieodzownym narzędziem pomocnym w refaktoryzacji jest ReSharper.

# Źródła

*   Roy Osherove. _Art of Unit Testing_
*   Bob Reselman. _[Unit Testing Legacy Code: 3 Reasons to Reconsider](http://blog.smartbear.com/code-review/unit-testing-legacy-code/)._
*   Daniel Lee. _[TDD when up to your neck in Legacy Code](https://danlimerick.wordpress.com/2012/04/25/tdd-when-up-to-your-neck-in-legacy-code/)._
*   Programmers Stack Exchange. [_Does it make sense to write tests for legacy code when there is no time for a complete refactoring?_](http://programmers.stackexchange.com/questions/227893/does-it-make-sense-to-write-tests-for-legacy-code-when-there-is-no-time-for-a-co)
*   Programmers Stack Exchange. _[Writing Tests for Existing Code](http://programmers.stackexchange.com/questions/207401/writing-tests-for-existing-code)._