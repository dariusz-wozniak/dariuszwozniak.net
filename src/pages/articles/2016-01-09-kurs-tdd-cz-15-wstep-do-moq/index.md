---
title: Kurs TDD cz. 15 — Wstęp do Moq
date: "2016-01-09T20:28:07.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-15-wstep-do-moq"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "Moq to najpopularniejszy framework do tworzenia atrap w .NET. W tej części kursu poznamy jego składnię i podstawowe możliwości."
---

**Moq** to najpopularniejszy framework do tworzenia atrap w .NET. W tej części kursu poznamy jego składnię i podstawowe możliwości. ![moq](62ac71c8-10bc-45c6-bf29-3c5620d2fbde.png) 

# Krótka historia Moq

Moq powstał w czasach kiedy najpopularniejszym frameworkiem do atrap w .NET był Rhino Mocks. Rhino, który jest również open source'owy, miał jednak jedną wielką wadę – syntaktyka. Kod powstały przez Rhino opierał się na syntaktyce "Record & Play", która była nieczytelna, trudna w utrzymaniu oraz uciążliwa w debugowaniu. Moq budowany był od początku w oparciu o wyrażenia lambda. Jednym z założeń Moq jest krótka ścieżka nauki, w przeciwieństwie do Rhino, gdzie nauka "Record & Play" wymaga ciut więcej zaangażowania. Moq wprowadził jeszcze jedną nowinkę — Rhino rozróżniał dwa typy atrap: stub i mock, podczas gdy w Moq wszystko zostało uproszczone do jednego typu: mock (co niektórzy uznają jako wadę, inni jako zaletę).

Z czasem Rhino Mocks przestał się rozwijać, przepadł w otchłań zapomnienia, a Moq przybyło dwóch konkurentów – FakeItEasy i NSubstitute. W dalszym ciągu Moq pozostał dalej bardzo mocnym graczem. Który framework wybrać? Wszystkie trzy są dobre. Warto zaznajomić się z każdym z nich i wybrać ten, który najbardziej przypada do gustu.

# Wstęp do Moqowania

Na tapet weźmy przykład z [ostatniej części, w której tworzyliśmy ręczną atrapę](/posts/kurs-tdd-14-testowanie-zaleznosci-atrapy-obiektow). Nasz kod bazowy wygląda następująco: 

```csharp
public class CustomerValidator
{
    private const int MinimumAge = 18;
 
    public bool Validate(ICustomer customer)
    {
        if (customer == null) throw new ArgumentNullException(nameof(customer));
 
        if (customer.GetAge()  _expectedAge;
}
```

 Przypomnijmy, jeden z testów sprawdzał czy wartość walidatora jest równa "fałsz" pod warunkiem jeśli wiek klienta był mniejszy niż 18: 

```csharp
[Test]
public void WhenCustomerHasAgeLessThan18_ThenValidationFails()
{
    var validator = new CustomerValidator();
    var customer = new CustomerMock(expectedAge: 16);
 
    bool validate = validator.Validate(customer);
 
    validate.Should().BeFalse();
}
```

 Aby stworzyć atrapę przy pomocy Moq, musimy posłużyć się obiektem klasy Mock. Składnia dla naszego przypadku będzie więc wyglądać następująco: 

```csharp
 var customerMock = new Mock(); 
```

 Aby ustawić wartość oczekiwaną dla naszego mocka musimy wywołać metody Setup i Returns: 

```csharp
 customerMock.Setup(x => x.GetAge()).Returns(16); 
```

 W metodzie Setup mówimy Moq co chcemy zamockować (metoda/właściwość), a Returns co ma być zwrócone. Innymi słowy, powyższa linijka może być przeczytana następująco:
 
 > Dla mocka interfejsu `ICustomer`, przy wywołaniu metody `GetAge`, zwróć wartość równą 16.
 
 Proste? I to bardzo! Należy pamiętać o jeszcze jednej kwestii. Aby przekazać nasz interfejs `ICustomer` do metody `Validate`, musimy skorzystać z właściwości `Object` mocka. Właściwość `Object` jest w naszym przypadku typu `ICustomer`. Zależność ta wygląda następująco: 

```csharp
Mock customerMock = new Mock(); // Mock dla typu T
ICustomer customer = customerMock.Object; // Obiekt typu T
```

 Nasz zaktualizowany test wygląda następująco: 

```csharp
[Test]
public void WhenCustomerHasAgeLessThan18_ThenValidationFails()
{
    var validator = new CustomerValidator();
 
    var customerMock = new Mock();
    customerMock.Setup(x => x.GetAge()).Returns(16);
 
    bool validate = validator.Validate(customerMock.Object);
 
    validate.Should().BeFalse();
}
```

# `MockBehavior`

Pytanie — Co jeśli nie wywołamy metody `Setup` i `Returns`, a przekażemy mock jako parametr w następujący sposób: 

```csharp
Mock customerMock = new Mock();
 
bool validate = validator.Validate(customerMock.Object);
```

 Moq może zachować się na dwa sposoby dla nieustawionych właściwości i metod:

1.  Zwrócona zostanie wartość domyślna (`default(T)`).
2.  Przy pierwszym wywołaniu nieustawionej właściwości/metody, wyrzucony zostanie wyjątek typu `MockException`.

Domyślne zachowanie to zachowanie nr 1, a manipulować nim możemy przy pomocy typu enum [`[MockBehavior]`](https://github.com/moq/moq4/blob/master/src/Moq/MockBehavior.cs): 

```csharp
public enum MockBehavior
{
  /// <summary>
  /// Causes the mock to always throw 
  /// an exception for invocations that don't have a 
  /// corresponding setup.
  /// </summary>
  Strict,
  /// <summary>
  /// Will never throw exceptions, returning default  
  /// values when necessary (null for reference types, 
  /// zero for value types or empty enumerables and arrays).
  /// </summary>
  Loose,
  /// <summary>
  /// Default mock behavior, which equals <see cref="Loose"/>.
  /// </summary>
  Default = Loose,
}
```

 `MockBehavior` ustawiony może być tylko w konstruktorze dla typu Mock, np.: 

```csharp
 var customerMock = new Mock(MockBehavior.Loose); 
```

# Kod imperatywny, a funkcyjny

Przedstawiana powyżej składnia dotyczy imperatywnego stylu. Moq pozwala także na zapis w stylu funkcyjnym, co pozwala na zwiększenie czytelności kodu.

Tworzenie mocka w stylu fukcjonalnym ma następujące różnice:

- Składnia dla tworzenia mocka to `Mock.Of()`.
- Do ustawienia oczekiwanej wartości używamy operatora `==`.
- Zwracany typ to `T`.
- Nie musimy więc odwoływać się do obiektu poprzez właściwość `Object`, gdyż jej już nie ma.
- Aby później zmodyfikować taki mock (np. dodać `Setup`), należy posłużyć się metodą `Mock.Get`.

Ustawienie mocka w stylu funkcyjnym wygląda następująco: 

```csharp
ICustomer customerMock = Mock.Of(customer => customer.GetAge() == 16);
bool validate = validator.Validate(customerMock);
```

 Dzięki syntaktyce funkcyjnej możemy w prosty sposób zbudować złożone mocki. Np.: 

```csharp
ICustomer customerMock = Mock.Of(customer =>
    customer.FirstName == "John" &&
    customer.LastName == "Kowalski" &&
    customer.PercentageDiscount == 20 &&
    customer.PhoneNumber == Mock.Of(number => number.MobileNumber == "123-456-789") &&
    customer.Orders == new List
    {
        Mock.Of(order => order.Id == 23 && order.Price == 20.01m),
        Mock.Of(order => order.Id == 65 && order.Price == 59.99m),
        Mock.Of(order => order.Id == 82 && order.Price == 9.99m),
    } &&
    customer.GetAge() == 20);
```

# Co możemy, a czego nie możemy mockować?

W podanych przykładach tworzyliśmy atrapy dla interfejsów. Co jednak z mockowaniem klasy? Jest taka możliwość, ale wiąże się to z następującymi ograniczeniami i efektami ubocznymi, m.in:

*   Nie możemy mockować statycznych klas ani metod.
*   Wywołany zostanie któryś z konstruktorów oraz logika związana z inicjalizacją obiektu (np. inicjalizacja pól).
*   Metoda musi być wirtualna, w przeciwnym razie dostaniemy wyjątek typu `NotSupportedException` o treści:

```
NotSupportedException was unhandled by user code

An exception of type 'System.NotSupportedException' occurred in Moq.dll but
was not handled in user code Additional information: Invalid setup on a
non-virtual (overridable in VB) member
```

Zaleca się więc tworzenie interfejsów, jeśli takowych nie ma (refaktoryzacja "Extract Interface"), a są potrzebne. Unikniemy dzięki temu wielu pułapek, a przy okazji zmniejszymy zależność między naszymi modułami (*class coupling*). Wyjątkiem mogą być np. obiekty typu DTO (Data Transfer Object), które nie posiadają żadnej logiki.

# Podsumowanie

W tej cześci artykułu poznaliśmy podstawowe koncepcje mockowania przy pomocy frameworka Moq. Moq pozwala na zdefiniowanie atrap przy użyciu dwóch styli: imperatywnego lub funkcyjnego. Aby uniknąć efektów ubocznych, zaleca się mockowanie interfejsów, nie klas. W dalszych częściach kursu poznamy bardziej zaawansowane techniki (argument matching, verify, callback) oraz pozostałe frameworki (NSubstitute, FakeItEasy).

Przypominam, że kod źródłowy całego kursu TDD, jak i tego rozdziału jest dostępny na GitHubie: [https://github.com/dariusz-wozniak/TddCourse](https://github.com/dariusz-wozniak/TddCourse).

# Linki zewnętrzne

*   [Moq: Github](https://github.com/Moq/moq4)
*   [Moq: Quick start](https://github.com/Moq/moq4/wiki/Quickstart)
*   [kzu blog: Old style imperative mocks vs moq functional specifications](http://blogs.clariusconsulting.net/kzu/old-style-imperative-mocks-vs-moq-functional-specifications/)