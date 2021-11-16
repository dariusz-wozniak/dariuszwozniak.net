---
title: Scrutor — automatyczna rejestracja zależności (dependency injection)
redirect_from:
  -
date: '2021-11-14T15:10:00.000Z'
layout: post
draft: false
path: '/posts/scrutor-automatyczna-rejestracja-zaleznosci'
category: 'Programowanie'
tags:
  - 'Scrutor'
  - 'Dependency Injection'
  - 'Inversion of Control'
description: 'Scrutor to sprytna biblioteka, która pozwala na automatyczną rejestrację zależności (dependency injection) dla kontenera IOC Microsoft.Extensions.DependencyInjection.'
---

[Scrutor](https://github.com/khellang/Scrutor) to sprytna biblioteka, która pozwala na automatyczną rejestrację zależności (_dependency injection_) dla kontenera IOC Microsoft.Extensions.DependencyInjection.

Ideą biblioteki Scrutor jest skanowanie kodu źródłowego, np. assembly, celem automatycznej rejestracji zależności wedle zadanych przez nas reguł.

Przykładowo, jeśli w naszym assembly chcemy:

- zarejestrować automatycznie zależności interfejs-klasa,
  - z pominiecięm atrybutów: `filter.Where(type => !typeof(Attribute).IsAssignableFrom(type)`,
- z pominięciem już istniejących zależności: `UsingRegistrationStrategy(RegistrationStrategy.Skip)`

... to możemy dodać do naszego pliku `Startup.cs` kod:

```csharp
private static readonly Type AssemblyMarkerType = typeof(Startup);

// ...

public void ConfigureServices(IServiceCollection services)
{
    // ...
    ConfigureDependencies(services);
}

private static void ConfigureDependencies(IServiceCollection services)
{
    services.Scan(x => x.FromAssembliesOf(AssemblyMarkerType)
                        .AddClasses(filter => filter.Where(type => !typeof(Attribute).IsAssignableFrom(type)))
                        .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                        .AsImplementedInterfaces());
}
```

Scrutor zarejestruje nam wszystkie interfejsy, które są zdefiniowane w naszym assembly (ale nie są atrybutami).

Więcej na temat Scrutor na stronie [GitHub](https://github.com/khellang/Scrutor).
