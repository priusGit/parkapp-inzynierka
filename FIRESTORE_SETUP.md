# Włączanie Firestore w Firebase

## Krok 1: Utwórz bazę danych Firestore

1. Wejdź na https://console.firebase.google.com/
2. Wybierz swój projekt (inzynierka-1d914)
3. W menu bocznym kliknij **Firestore Database**
4. Kliknij **Create database**
5. Wybierz **Start in test mode** (dla developmentu)
6. Wybierz lokalizację (najlepiej europe-west)
7. Kliknij **Enable**

## Krok 2: Zmień zasady bezpieczeństwa (dla testu)

W zakładce **Rules** wklej:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservations/{reservationId} {
      allow read, write: if request.auth != null;
    }
    match /vehicles/{vehicleId} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /parkings/{parkingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

To pozwoli:

- Zalogowanym użytkownikom dodawać rezerwacje i pojazdy
- Użytkownikom odczytywać i edytować własne dane
- Administratorom zarządzać parkingami

## Gotowe! 🎉

Teraz możesz:

- Dodawać rezerwacje (przycisk **+** na głównym ekranie)
- Zarządzać pojazdami (zakładka **Więcej** → **Twoje Pojazdy**)
- Rejestrować nowe parkingi jako administrator
- Wszystko jest zapisywane w Firestore w czasie rzeczywistym
- Każdy użytkownik widzi tylko swoje dane

## Struktura kolekcji:

- `/reservations` - rezerwacje użytkowników
- `/vehicles` - pojazdy użytkowników
- `/users` - dane użytkowników
  - displayName: string
  - email: string
  - role: "user" | "admin"
  - parkingOwnerId: string (tylko dla role="user")
  - accessCode: string (tylko dla role="admin")
  - createdAt: string
- `/parkings` - parkingi
  - name: string
  - address: string
  - img: string (URL)
  - ownerId: string (ID administratora)
  - createdAt: string

## Jak to działa:

1. **Administrator rejestruje parking:**
   - Tworzy konto z rolą "admin"
   - Otrzymuje 6-znakowy kod dostępu (accessCode)
   - Tworzy parking powiązany z jego ID (ownerId)

2. **Użytkownik rejestruje się:**
   - Wprowadza kod dostępu otrzymany od administratora
   - System weryfikuje kod i przypisuje użytkownika do administratora (parkingOwnerId)
   - Użytkownik widzi tylko parkingi swojego administratora

3. **Filtrowanie danych:**
   - Zwykli użytkownicy widzą parkingi gdzie ownerId == user.parkingOwnerId
   - Administratorzy widzą swoje parkingi gdzie ownerId == user.uid
