---
title: Kurs TDD cz. 21 — Rodzaje frameworków do tworzenia atrap
date: "2016-04-11T16:52:10.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-21-rodzaje-frameworkow-do-tworzenia-atrap/"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
description: "Rodzaje framerków do tworzenia atrap możemy podzielić na dwie kategorie: constrained (z ang. ograniczony) i unconstrained (nieograniczony)"
---

**Rodzaje framerków do tworzenia atrap** możemy podzielić na dwie kategorie:

*   _constrained_ (z ang. ograniczony)
*   _unconstrained_ (nieograniczony)

# _constrained_

Do pierwszej kategorii zaliczamy wszystkie do tej pory poznane frameworki do tworzenia atrap – [Moq](http://dariuszwozniak.net/2016/01/09/kurs-tdd-cz-15-wstep-do-moq/), [FakeItEasy](http://dariuszwozniak.net/2016/02/20/kurs-tdd-cz-17-fakeiteasy/), [NSubstite](http://dariuszwozniak.net/2016/02/29/kurs-tdd-cz-18-nsubstitute/) – a także Rhino Mocks, NMock oraz EasyMock. Ich cechą charakterystyczną jest ograniczona możliwość tworzenia atrap. Biblioteki te generują kod dziedziczący atrapy w czasie rzeczywistym, w oparciu o kod pośredni (IL). Najczęściej atrapy są tworzone w oparciu o wzorzec projektowy dynamicznego proxy, który wymaga tego aby kod umożliwiał dziedziczenie. Oznacza to, że aby stworzyć atrapę potrzebujemy interfejsu do naszej klasy lub metody wirtualnej. Jako, że kluczem do stworzenia atrapy jest dziedziczenie, nasza klasa/metoda nie może być statyczna, niepubliczna, sealed oraz musi posiadać publiczny konstruktor. Oznacza to też, że kod zawarty w konstruktorze oraz polach klasy jest wykonywany przy tworzeniu atrapy.

> **Czym jest dynamiczne proxy?** Dynamiczne proxy to klasa, która implementuje interfejs lub klasę w trakcie wykonywania programu (_run-time_).

Biblioteki te są zwykle darmowe, a obiekty proxy są zwykle tworzone przy użyciu biblioteki Castle.Windsor.

# _unconstrained_

Frameworki o "nieograniczonych możliwościach" to Typemock Isolator, JustMock i Microsoft Fakes. Są one napisane w oparciu o Common Language Runtime (CLR) Profiler, który udostępnia API pozwalające na większą kontrolę nad wykonywanym kodem. Możemy zatem wstrzykiwać nasz kod przed kompilacją kodu pośredniego oraz mamy dostęp do _eventów_ wywoływanych w trakcie wykonywania naszego kodu. Większa kontrola nad generowanym kodem oznacza, że frameworki te pozwalają na tworzenie atrap dla kodu, który nie musi być dziedziczony, a więc klasy/metody statyczne, prywatne, biblioteki zewnętrzne, klasy systemowe (np. DateTime), itp. Ze względu na stopień skomplikowania pisania kodu w oparciu o API Profilera, frameworki te (poza Microsoftowym) są dostępne odpłatnie.

# Biblioteki

Rodzaj frameworka

Przykłady bibliotek

**_constrained_** _generują kod pośredni w trakcie wykonywania (run-time)_

*   Moq
*   FakeItEasy
*   NSubstitute
*   Rhino Mocks
*   NMock
*   EasyMock
*   JustMock Lite

**_unconstrained_** _bazujące na_ _API Profilera_

*   Typemock Isolator
*   JustMock
*   Microsoft Fakes (dawniej Moles)

# No dobra, to który typ biblioteki wybrać?

Osobiście preferuję podejście przy użyciu "ograniczonych" frameworków, gdyż wymuszają one pisanie dobrego kodu w oparciu o programowanie zorientowane obiektowo. Podobnie jest z refaktoryzacją i poprawkami w nieprzetestowanym kodzie. Izolacja miejsca, które zmieniamy oraz tworzenie kodu który będzie w łatwy sposób testowalny również powoduje zwiększenie jakości kodu. Nie chcę przez to powiedzieć, że samo wykorzystanie bibliotek _constrained_ gwarantuje nam poprawę kodu "gratis". Dostajemy jednak informację zwrotną na temat designu naszych klas—nie możemy stworzyć atrapy jeśli nasza klasa nie jest testowalna z powodu np. statyczności lub braku interfejsu. Użycie bibliotek _unconstrained_ wiąże się z kilkoma pułapkami, m.in.

*   Możemy testować zbyt dużo nie wiedząc o tym. Niemal pełna dowolność powoduje, że możemy np. zacząć testować moduły prywatne, które z reguły nie powinny być testowane explicite.
*   Nie mamy informacji zwrotnej o jakości naszych klas względem programowania zorientowanego obiektowo.
*   _Vendor lock-in_. Uzależniamy się od dostawcy naszego frameworka. O ile można w prosty sposób zmigrować kod między Moq, FakeItEasy i NSubstitute, tak w przypadku tej klasy bibliotek może być o wiele trudniej. API frameworków _unconstrained_ różnią się w bardziej znaczący sposób, przez co migracja kodu może być o wiele bardziej bolesna.

Frameworki _constrained_ wymagają więcej wiedzy oraz doświadczenia na temat testowania oraz dobrego kodu, ale dzięki temu zyskujemy natychmiastową informację zwrotną na temat jakości naszego kodu. Ja stosuję z powodzeniem tę grupę bibliotek zarówno w przypadku _greenfield_ (nowy kod), jak i _brownfield_ (stary kod). A wy jakie macie zdanie na temat tych dwóch grup frameworków?

# Źródła

*   Roy Osherove. _Art of Unit Testing._ 2014\. Str. 110-114
*   [Oracle Java SE Documentation: Dynamic Proxy Classes](https://docs.oracle.com/javase/6/docs/technotes/guides/reflection/proxy.html)
*   [Microsoft Development Network: Profiling Overview](https://msdn.microsoft.com/en-us/library/bb384493.aspx?f=255&MSPPError=-2147217396)