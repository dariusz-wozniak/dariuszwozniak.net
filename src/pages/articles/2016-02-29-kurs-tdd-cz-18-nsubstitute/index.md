---
title: Kurs TDD cz. 18 — NSubstitute
date: "2016-02-29T17:39:10.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-18-nsubstitute"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "Pora przyjrzeć się trzeciemu najpopularniejszemu darmowemu frameworkowi do tworzenia atrap w .NET – NSubstitute."
---

Pora przyjrzeć się trzeciemu najpopularniejszemu darmowemu frameworkowi, obok [Moq](http://dariuszwozniak.net/2016/01/09/kurs-tdd-cz-15-wstep-do-moq/) i [FakeItEasy](http://dariuszwozniak.net/2016/02/20/kurs-tdd-cz-17-fakeiteasy/), do tworzenia atrap w .NET – **NSubstitute**.

![NSubstitute](a9167cc8-6910-4d03-afc7-eecefc8fd33b.png)

Co wyróżnia tę bibliotekę:

*   Główny nacisk położono na prostotę w semantyce. Składnia biblioteki ma w założeniu jak najbardziej przypominać naturalny język. Ilość wyrażeń lambda została zredukowana do minimum.
*   W Moq każda atrapa to _mock_, w FakeItEasy _fake_, a w NSubstitute... _substitute_ (z ang. "zamiennik"). Podobnie jak w dwóch wymienionych frameworkach, nie ma rozróżnienia na _mock, stub, fake, spy_, itp.

Dzięki temu, że biblioteka jest lekka, łatwa i przyjemna, doskonale nadaje się do celów edukacyjnych w temacie TDD i tworzenia atrap.

# Wstęp

Aby stworzyć atrapę w NSubstitute, należy skorzystać z metody `For` klasy `Substitute`: 

```csharp
 ICustomer customer = Substitute.For<ICustomer>(); 
```

 Przekazanie parametrów do konstruktora odbywa się przez ww. metodę `For`. W niej definiujemy wszystkie argumenty konstruktora: 

```csharp
 var customerValidator = Substitute.For<ICustomerValidator>();
 var customerRepository = Substitute.For<CustomerRepository>(customerValidator); 
```

 Zamienniki w NSubstitute tworzone są w trybie "loose". Dla przykładu: 

```csharp
 ICustomer customer = Substitute.For<ICustomer>();
 string firstName = customer.FirstName; // firstName = "" 
```

# Definicja zachowania

Zachowanie zamiennika można zdefiniować za pomocą metody rozszerzającej `Returns`: 

```csharp
 ICustomer customer = Substitute.For<ICustomer>();
 customer.GetAge().Returns(20); 
```

 Właściwości możemy definiować tak jak powyżej lub bezpośrednio przez dostęp do settera: 

```csharp
 ICustomer customer = Substitute.For<ICustomer>();
 customer.FirstName = "John";
 customer.FirstName.Returns("John"); // ekwiwalentne do powyższego 
```

 Aby wyrzucić wyjątek, korzystamy z metody `Throws`: 

```csharp
 ICustomer customer = Substitute.For<ICustomer>();
 customer.GetAge().Throws<NotSupportedException>(); 
```

 "Callback" możemy wykonać poprzez metodę `AndDoes`: 

```csharp
int a = 0;

ICustomer customer = Substitute.For<ICustomer>();

customer.GetAge()
  .Returns(20)
  .AndDoes(info => a++);

// a = 0

customer.GetAge();
// a = 1 
```

 Parametr metody `AndDoes` jest typu `Action<CallInfo>`, dzięki czemu mamy dostęp, dzięki klasie `CallInfo`, do argumentów przekazanych metodzie.

# Weryfikacja wywołań

Do zweryfikowania wywołania zamienników wykorzystuje się metodę `Received` oraz `DidNotReceive`: 

```csharp
var customerValidator = Substitute.For<ICustomerValidator>();
var customerRepository = new CustomerRepository(customerValidator);
 
var customer = Substitute.For<ICustomer>();
customer.FirstName = "John";
 
customerRepository.Add(customer);
 
customerValidator.Received().Validate(customer);
```

 `Received` przyjmuje opcjonalnie jako parametr ilość oczekiwanych wywołań.

# Argument Matching

"Argument matchery" działają w podobny sposób co w Moq i FakeItEasy. Parametry metody możemy przekazać bezpośrednio: 

```csharp
 calculator.Add(1, 2).Returns(3); 
```

 Lub, w przypadku złożonego dopasowania argumentów, za pomocą klasy `Arg` i metody `Any` oraz `Is`: 

```csharp
 calculator.Add(Arg.Any<int>(), Arg.Is<int>(i => i > 0)).Returns(1); 
```

# Podsumowanie

Sposób obsługi naszych atrap jest o wiele prostszy i czytelniejszy w stosunku do Moq i FakeItEasy. Semantyka jest do bólu prosta i nie pozostawia zbyt wielu domysłów czytelnikowi. Wykorzystanie lambd zostało zminimalizowane, przez co kod jest też łatwiejszy do zrozumienia dla początkujących programistów zaczynających przygodę z C# i TDD.

Do tej pory poznaliśmy trzy biblioteki do tworzenia atrap – [Moq](/posts/kurs-tdd-15-wstep-do-moq), [FakeItEasy](/posts/kurs-tdd-17-fakeiteasy) oraz NSubstitute. Wszystkie mają otwarty kod źródłowy i są darmowe. Warto poeksperymentować z nimi, aby wyrobić sobie opinię na temat każdej z nich. Ja osobiście nie mam faworyta w tej kwestii, uznałbym że wszystkie trzy zajmują ex aequo pierwsze miejsce. Różnica jest nieznaczna, gdyż wszystkie trzy oparte są na wzorcu proxy (na jednym z ich wariancie) i bibliotece Castle.Core.

Jest jeszcze kilka innych konkurentów na rynku, w tym płatnych i bardziej zaawansowanych. Nie będę ich jednak opisywać w tak szczegółowy sposób jak wyżej wymienione; niemniej jednak, temat powróci przy okazji omówienia typów bibliotek do tworzenia atrap i zaglądnięcia nieco pod maskę.

# Linki zewnętrzne

*   [NSubstitute: Strona internetowa](http://nsubstitute.github.io/)
*   [NSubstitute: Kod źródłowy](https://github.com/nsubstitute/nsubstitute)
*   [NSubstitute: Dokumentacja](http://nsubstitute.github.io/help.html)