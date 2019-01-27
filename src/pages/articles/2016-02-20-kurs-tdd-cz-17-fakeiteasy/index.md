---
title: Kurs TDD cz. 17 — FakeItEasy
date: "2016-02-20T18:27:29.000Z"
layout: post
draft: false
path: "/posts/kurs-tdd-17-fakeiteasy"
category: "Programowanie"
tags:
  - "TDD"
  - "Kurs TDD"
  - "C#"
description: "Dziś w kursie TDD przyjrzymy się frameworkowi do tworzenia atrap, konkurencyjnemu do wcześniej poznanego Moq. FakeItEasy, bo o nim mowa, jest darmowy, łatwy w nauce, ma wsparcie dla C# i VB.NET, różni się od innych bibliotek nie tylko semantyką, ale także nieco innym podejściem do tematu tworzenia atrap."
---

Dziś w kursie TDD przyjrzymy się frameworkowi do tworzenia atrap, konkurencyjnemu do wcześniej poznanego Moq. **FakeItEasy**, bo o nim mowa, jest darmowy, łatwy w nauce, ma wsparcie dla C# i VB.NET, różni się od innych bibliotek nie tylko semantyką, ale także nieco innym podejściem do tematu tworzenia atrap. ![fakeiteasy](c7551327-d950-45aa-bb70-09a1cf4b93f6.png) Co więcej można powiedzieć o FakeItEasy?

*   W FakeItEasy wszystkie atrapy są fake'm. Nie ma rozróżnienia na mocki, stuby, itp.
*   Korzysta z API opartego na semantyce fluent i wyrażeniach lambda.
*   Jest rozszerzalny.
*   Posiada wsparcie dla bardziej zaawansowanych technik, m.in. strict fakes, argument matching, atrapy asynchronicznych metod.

Części kursu TDD [15.](http://dariuszwozniak.net/2016/01/09/kurs-tdd-cz-15-wstep-do-moq/) i [16.](http://dariuszwozniak.net/2016/01/16/kurs-tdd-cz-16-moq-cz-2-argument-matching-verify-callback/) powstały z myślą o wprowadzeniu technik tworzenia atrap. W tej części kursu dowiemy się jak, w oparciu o wiedzę i kod zawarty w poprzednich częściach, posługiwać się biblioteką FakeItEasy. Zalecane jest zatem zaznajomienie się z dwoma poprzednimi częściami kursu.

# Wstęp

Zanim zaczniemy przygodę z frameworkiem, należy wiedzieć że:

*   Po pierwsze, aby cokolwiek zrobić w FakeItEasy – czy to utworzyć atrapę, czy to ustawić żądane dane wyjściowe – korzystamy z klasy o nazwie "A", która posiada statyczne metody służące do wszystkich potrzebnych nam operacji. Niekonwencjonalne, oryginalne, ale na swój sposób bardzo sympatyczne podejście do tematu.
*   A po drugie, FakeItEasy posiada dość nietypową na swój sposób semantykę. Potrzeba trochę czasu, aby się przyzwyczaić...

Tyle tytułem wstępu, a więc zaczynamy!

## Tworzenie atrap

Do tworzenia atrap służy metoda Fake, która zwraca typ T: 
```csharp
 ICustomer customer = A.Fake<ICustomer>(); 
```
 Aby przesłać parametry do konstruktora, korzystamy z metody WithArgumentsForConstructor: 
```csharp
 A.Fake<ICustomerRepository>(x => x.WithArgumentsForConstructor(() => new CustomerRepository(A.Fake<ICustomerValidator>()))); 
```
 Domyślnie fake'i w FakeItEasy są tworzone w trybie "loose", co oznacza że metoda lub właściwość, która nie ma zdefiniowanej wartości żądanej, zwróci wartość automatyczną (w tej bibliotece: string.Empty, default(T) lub Fake<T>). Aby stworzyć atrapę "strict", a więc taką, która musi posiadać definicję wartości oczekiwanych, korzystamy z metody Strict. W przypadku, gdy nastąpi odwołanie do metody lub właściwości klasy fake'owej, która nie ma przypisanej żądanej wartości, kod wyrzuci wyjątek. Przykład: 
```csharp
 var customer = A.Fake<ICustomer>(x => x.Strict()); string firstName = customer.FirstName; // To wywołanie wyrzuci wyjątek 
```
 Próba dostępu do właściwości FirstName skończy się wyjątkiem typu `FakeItEasy.ExpectationException` i komunikatem:

> Additional information: Call to non configured method "get_FirstName" of strict fake.

## Definicja zachowania

Aby móc zdefiniować zachowanie naszego fake'a, korzystamy z metody CallTo, a następnie wywołujemy metodę Returns która przyjmuje wskazaną przez nas wartość. Przykładowe użycie: 
```csharp
 var customer = A.Fake<ICustomer>(); A.CallTo(() => customer.GetAge()).Returns(20); 
```
 Właściwości fake'a możemy alternatywnie ustawić odwołując się do niej bezpośrednio: 
```csharp
 var customer = A.Fake<ICustomer>(); customer.FirstName = "John"; 
```
 Jeśli chcemy aby nasza metoda wyrzuciła wyjątek, korzystamy z metody Throws: 
```csharp
 var customer = A.Fake<ICustomer>(); A.CallTo(() => customer.GetAge()).Throws<NotSupportedException>(); 
```
 Aby zdefiniować "callback", który wykona dowolną logikę, możemy posłużyć się metodą Invokes: 
```csharp
 int a = 0; var customer = A.Fake<ICustomer>(); A.CallTo(() => customer.GetAge()).Invokes(() => a++); // a = 0 customer.GetAge(); // a = 1 
```


## Weryfikacja wywołań

Do weryfikacji czy dana metoda lub właściwość została wywołana lub nie, posługujemy się metodami MustHaveHappened oraz MustNotHaveHappened. Parametr metody MustHaveHappened pozwala na określenie oczekiwanej ilości wywołań. Przykład testu: 
```csharp
 \[Test\] public void WhenAddingCustomer_ThenValidateMethodOfValidatorIsCalledOnce() { var customerValidator = A.Fake<ICustomerValidator>(); var customerRepository = new CustomerRepository(customerValidator); var customer = A.Fake<ICustomer>(); customer.FirstName = "John"; customerRepository.Add(customer); A.CallTo(() => customerValidator.Validate(customer)).MustHaveHappened(Repeated.Exactly.Once); } 
```


## Argument Matching

Dopasowanie parametrów danej metody możemy wykonać na kilka sposobów. Jeżeli zależy nam na konkretnych wartościach, to przekazujemy je w "standardowy" sposób do metody: 
```csharp
 A.CallTo(() => calculator.Add(2, 4)).MustHaveHappened(); 
```
 Jeśli chcemy ustalić regułę dla naszych parametrów, możemy posłużyć się właściwością That klasy A (oraz That.Not): 
```csharp
 A.CallTo(() => calculator.Add(A<int>.That.Matches(i => i > 0), A<int>.That.Matches(i => i < 0))).MustHaveHappened(); 
```
 Jeśli natomiast nie zależy nam na wartości parametru, możemy przekazać właściwość Ignored (lub... podkreślnik, który jest jego odpowiednikiem) klasy A: 
```csharp
 A.CallTo(() => calculator.Add(A<int>.Ignored, A<int>.Ignored)).MustHaveHappened(); A.CallTo(() => calculator.Add(A<int>._, A<int>._)).MustHaveHappened(); // Tożsame z powyższym 
```


# Podsumowanie

W tej części kursu poznaliśmy część funkcjonalności FakeItEasy, która będzie wystaraczająca w większości testów jednostkowych. Oczywiście, framework oferuje wiele więcej zaawansowanych technik. Zachęcam do odwiedzenia oficjalnej dokumentacji celem ich poznania. Dla adeptów FakeItEasy, semantyka oparta o parametr typu Expression<Func<T>> lub Expression<Action> może budzić lekkie zamieszanie i zamęt. Z czasem jednak FakeItEasy staje się prostym i bardzo przyjaznym w użyciu frameworkiem. Z pewnością każdy czytelnik zadał sobie pytanie o wybór frameworka: Moq czy FakeItEasy? Są to dwie bardzo mocne i ugruntowane już biblioteki i jeśli wybór ma nie być podyktowany ograniczeniami technicznymi któregoś z nich, to pozostaje kwestia preferencji względem semantyki i nieco odmiennej filozofii tworzenia atrap. Wybór pozostawiam czytelnikowi, zachęcając jednocześnie do eksperymentowania zarówno z Moq, jak i FakeItEasy (każdy projekt testowy może mieć inny framework, czemu nie?) Tymczasem w kolejnej części kursu poznamy trzeciego konkurenta. Stay tuned!

# Linki zewnętrzne

*   [FakeItEasy: Strona internetowa](http://fakeiteasy.github.io/)
*   [FakeItEasy: GitHub](https://github.com/FakeItEasy/FakeItEasy)
*   [FakeItEasy: Dokumentacja](https://github.com/FakeItEasy/FakeItEasy/wiki)