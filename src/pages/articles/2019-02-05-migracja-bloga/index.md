---
title: Migracja bloga
redirect_from:
    - 
date: "2019-02-05T16:37:25.000Z"
layout: post
draft: false
path: "/posts/migracja-bloga"
category: "Meta"
tags:
  - "Blog"
description: "Właśnie niedawno zakończyłem migrację bloga z Wordpressa do GitHub Pages..."
---

Właśnie niedawno zakończyłem migrację bloga z Wordpressa do [GitHub Pages](https://pages.github.com/)...

Decyzja ta podyktowana jest kilkoma kwestiami, głównie są to:

- Wordpress jest kosztowny. Utrzymanie domeny i bloga to dodatkowe koszty, a zatem przenosiny pozwolą na oszczędności związane z płatną wersją WP.
- Wordpress nie jest darmowy, a co za tym idzie – w przypadku jego rezygnacji, tracę płatne funkcje tego portalu. Zaletą przejścia na GitHub Pages jest darmowe archiwum uniezależnione od czynników zewnętrznych. Posty będą dostępne niezależnie od tego, czy np. autor żyje.
- Markdown. Co prawda, Wordpress obsługuje Markdown, ale praca jest utrudniona w przypadku kodu. Przykładowo, bywa że operatory lambda czy znaki porównawcze były zastępywane przez HTML-owe odpowiedniki.
- Dużo kontrola nad stroną. Wordpress posiada widgety i tematy, ale ich customizacja jest ograniczona. O wiele przystępniej pracuje mi się z [Gatsby](https://www.gatsbyjs.org/).
- Minimalizm. Teraz blog wygląda teraz zgodnie z moją wizją, czyli – minimalistycznie.
- Kontrola wersji. Git pozwala na bardziej intuicyjną (zwłaszcza dla programisty) pracę nad zawartością strony. Pull requesty pozwalają na wysyłanie poprawek przez czytelników.
- Szybkość działania. Gatsby, jako Static Progressive Web App, jest bardzo szybki i wymaga o wiele mniej miejsca niż Wordpress.
- Nowszy stack technologiczny. JS + React + GraphQL w miejsce PHP.
- HTTPS – Wordpress działał na HTTP i nie udało mi się skonfigurować go w trybie wyłącznym dla HTTPS. Po migracji, używam tylko HTTPS.

W stosunku do Wordpress, jest jednak kilka mniejszych lub większych niedogodności. Przy migracji lub tworzeniu bloga na GitHub pages z Gatsby należy wziąć pod uwagę następujące kwestie:

- Wordpress od razu spięty posiada funkcję CMS. Aktualnie piszę artykuły w Visual Studio Code – na plus jeśli chodzi o ergonomię, ale na minus w kwestii mobilności.
- W Gatsby wszystkie zmiany trzeba deployować. To trwa + coś może pójść nie tak. Dla mnie akceptowalne, ale wymaga przynajmniej podstawowej wiedzy programistycznej w zakresie JS i Reacta.
- Migracja z WP do Markdown. Istnieją narzędzia do migracji, jak np. [Wordpress-Gatsby-Migrator](https://github.com/weiran/wordpress-gatsby-migrator), choć poprawki i customizacja to kilka godzin pracy.
- SEO. Wydaje mi się, że WP lepiej funkcjonuje w kontekście SEO. Dla mnie nie jest to priorytet.
- Migracja komentarzy. Niestety, nie udało mi się zmigrować komentarzy z Wordpressa do GitHub Pages. Po migracji przeniosłem się na Disqus, co powinno być plusem.
- Problem z RSS. Jeszcze tego nie rozwiązałem po migracji...

Ogółem, jestem bardzo zadowolony z migracji. Wordpress oferuje całą platformę do blogowania (włączając statystyki/SEO/reklamy/itd.) i jest to niewątpliwy plus, ale jeśli chcemy mieć większą kontrolę nad tworzoną treścią i chcemy odchudzić naszą stronę, to opcja przejścia na GitHuba jest zdecydowanie warta rozważenia.

Blog dostępny jest pod adresem:
- https://dariuszwozniak.net
- mirror: https://dariuszwozniak.netlify.com

Repozytorium z kodem źródłowym bloga dostępne jest na stronie:
- https://github.com/dariusz-wozniak/dariuszwozniak.net

