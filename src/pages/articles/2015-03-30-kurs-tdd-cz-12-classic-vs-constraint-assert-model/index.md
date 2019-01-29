---
title: Kurs TDD cz. 12 — Classic vs. Constraint Assert Model
date: "2015-03-30T15:00:48.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-12-classic-vs-constraint-assert-model"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "Rzecz być może dla niektórych mało istotna, dla niektórych w ogóle nie istotna, ale niezależnie od istotności sprawy – myślę, że warta wpisu na blogu. NUnit posiada dwa modele asercji: Classic Assert Model oraz Constraint-Based Assert Model."
---

Rzecz być może dla niektórych mało istotna, dla niektórych w ogóle nie istotna, ale niezależnie od istotności sprawy – myślę, że warta wpisu na blogu. NUnit posiada dwa modele asercji:

*   Classic Assert Model
*   Constraint-Based Assert Model

Semantyka klasycznego modelu jest wszystkim dobrze znana:

```csharp
Assert.AreEqual(5, sum);
Assert.AreSame(personA, personB);
Assert.IsTrue(condition);
Assert.IsNotNull(model);
Assert.IsEmpty(phoneNumbers);
Assert.GreaterOrEqual(7, result);
Assert.IsInstanceOfType(typeof(IList), phoneNumbers);
Assert.Throws<DivideByZeroException>(() => calc.Divide(2, 0));
StringAssert.Contains("abc", text);
CollectionAssert.IsEmpty(person.PhoneNumbers);
```

 Co nowego wprowadza ten drugi? Wszystkie asercje Constraint-Based Assert Model wywoływane są z metody That klasy Assert, która to metoda przyjmuje co najmniej dwa parametry: 

```csharp
Assert.That(object actual, IConstraint constraint);
```

 `IConstraint` jest interfejsem na podstawie którego budujemy nasze wyrażenia. NUnit idzie nam z pomocą i posiada pakiet niezbędnych `IConstraints` w formie Syntax Helpers - między innymi klas `Is` i `Has`. Oto dwie asercje opisane różnymi modelami:

```csharp
Assert.AreEqual(5, sum); // Classic Assert Model
Assert.That(sum, Is.EqualTo(5)); // Constraint-Based Assert Model
```

 Przykłady asercji Constraint-Based Assert Model: 

```csharp
Assert.That(text, Is.EqualTo("Hello"));
Assert.That(exception1, Is.SameAs(exception2));
Assert.That(exception1, Is.Not.SameAs(exception2));
Assert.That(nObject, Is.Null);
Assert.That(anObject, Is.Not.Null);
Assert.That(condition, Is.True);
Assert.That(condition, Is.False);
Assert.That(aDouble, Is.NaN);
Assert.That(aDouble, Is.Not.NaN);
Assert.That(aString, Is.Empty);
Assert.That(collection, Is.Empty);
Assert.That(collection, Is.Unique);
Assert.That(7, Is.GreaterThan(3));
Assert.That(7, Is.GreaterThanOrEqualTo(3));
Assert.That(7, Is.AtLeast(3));
Assert.That(7, Is.GreaterThanOrEqualTo(7));
Assert.That(7, Is.AtLeast(7));
Assert.That(3, Is.LessThan(7));
Assert.That(3, Is.LessThanOrEqualTo(7));
Assert.That(3, Is.AtMost(7));
Assert.That(3, Is.LessThanOrEqualTo(3));
Assert.That(3, Is.AtMost(3));
Assert.That("Hello", Is.TypeOf(typeof(string)));
Assert.That("Hello", Is.Not.TypeOf(typeof(int)));
Assert.That(phrase, Text.Contains("tests fail"));
Assert.That(phrase, Text.Contains("make").IgnoreCase);
Assert.That(array, Is.All.Not.Null);
Assert.That(array, Is.All.InstanceOfType(typeof(string)));
Assert.That(array, Is.All.GreaterThan(0));
Assert.That(array, Is.Unique);
Assert.That(iarray, Has.None.Null);
Assert.That(iarray, Has.No.Null);
Assert.That(sarray, Has.None.EqualTo("d"));
Assert.That(iarray, Has.None.LessThan(0));
Assert.That(iarray, Has.Member(3));
Assert.That(sarray, Has.Member("b"));
Assert.That(sarray, Has.No.Member("x"));
Assert.That(iarray, Is.Ordered);
Assert.That(sarray, Is.Ordered.Descending);
Assert.That(SomeMethod, Throws.TypeOf<ArgumentException>());
```

 Argumenty podane dla IConstraint możemy składać w operacje logiczne. Służą do tego syntax helpers `Is.Not`, `Is.All` oraz operatory `&` i `|`:

```csharp
Assert.That(2 + 2, Is.Not.EqualTo(5);
Assert.That(new int[] { 1, 2, 3 }, Is.All.GreaterThan(0));
Assert.That(2.3, Is.GreaterThan(2.0) & Is.LessThan(3.0));
Assert.That(3, Is.LessThan(5) | Is.GreaterThan(10));
```

 Możemy też tworzyć swoje własne Constraints. Aby to zrobić, musimy zaimplementować klasę abstrakcyjną `Constraint`: 

```csharp
public abstract class Constraint
{
    public abstract bool Matches(object actual);
    public virtual bool Matches(ActualValueDelegate del);
    public virtual bool Matches<T>(ref T actual);
    public abstract void WriteDescriptionTo(MessageWriter writer);
    public virtual void WriteMessageTo(MessageWriter writer);
    public virtual void WriteActualValueTo(MessageWriter writer);
}
```

 Który z tych modeli jest "lepszy" albo bardziej czytelny? Jest to oczywiście kwestia gustu.
 
 Ciekawostka: Na podstawie Constraint-Based Assert Model powstała biblioteka C++ o nazwie [Snowhouse](https://github.com/joakimkarlsson/snowhouse "https://github.com/joakimkarlsson/snowhouse").

 ## Źródła

*   [http://nunit.org/index.php?p=classicModel&r=2.6.4](http://nunit.org/index.php?p=classicModel&r=2.6.4 "http://nunit.org/index.php?p=classicModel&r=2.6.4")
*   [http://nunit.com/index.php?p=constraintModel&r=2.5](http://nunit.com/index.php?p=constraintModel&r=2.5 "http://nunit.com/index.php?p=constraintModel&r=2.5")
*   [http://nunit.com/index.php?p=customConstraints&r=2.5](http://nunit.com/index.php?p=customConstraints&r=2.5 "http://nunit.com/index.php?p=customConstraints&r=2.5")