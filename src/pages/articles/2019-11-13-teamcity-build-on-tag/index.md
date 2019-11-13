---
title: TeamCity - triggerowanie builda po stworzeniu taga
redirect_from:
    -
date: "2019-11-13T19:10:00.000Z"
layout: post
draft: false
path: "/posts/team-city-triggerowanie-builda-po-stworzeniu-taga"
category: "Programowanie"
tags:
  - "TeamCity"
  - "DevOps"
  - "Git"
description: "Ostatnio miałem potrzebę stworzenia konfiguracji w TeamCity, w której build jest triggerowany, gdy tworzymy nowego taga. Przydaje się to w szczególności na branchu master, gdy nie chcemy tworzyć builda lub/i kalkulować nowej wersji podczas każdego commita, a jedynie wtedy kiedy sami, w sposób explicite, stworzymy nowy tag (wersję). Niestety, aktualnie TeamCity nie wspiera jeszcze tej funkcji, ale jest na to _workaround_. Poniżej podaję gotowy przepis na tę konfigurację".
---

Aby build triggerował się tylko i wyłącznie podczas stworzenia nowego taga należy zastosować następujące ustawienia:

**Version Control Settings > Branch Filter:**

```
+:*
-:<default>
```

**Version Control Settings > VCS Root:**

* Default branch: master

* Branch specification:

```
+:refs/tags/*
-:<default>
```

* ✅ Enable to use tags in the branch specification (opcja ma być zaznaczona)

**Triggers > VCS Trigger:**

* Branch filter: _(nic)_

Jeśli nie korzystamy z prefiksów w taga dla wersji, to możemy też ustawić wersję bezpośrednio z taga:

**Build number format:** `%teamcity.build.branch%`

Powyższa recepta działa w TeamCity w wersji 2019.1.5. Ticket do TeamCity traktujący o problemie to [TW-43606](https://youtrack.jetbrains.com/issue/TW-43606).