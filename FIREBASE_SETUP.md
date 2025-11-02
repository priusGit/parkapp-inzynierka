# Firebase Web SDK - Instrukcja Setup

## 1. Stwórz projekt w Firebase Console

1. Wejdź na https://console.firebase.google.com/
2. Kliknij "Add project"
3. Podaj nazwę projektu
4. Postępuj zgodnie z instrukcjami

## 2. Dodaj aplikację Web do projektu

1. W Firebase Console, kliknij ikonę Web (</>)
2. Zarejestruj aplikację
3. Skopiuj konfigurację Firebase

## 3. Zaktualizuj config/firebaseConfig.ts

Zastąp wartości w pliku `config/firebaseConfig.ts` swoimi danymi:

```typescript
const firebaseConfig = {
  apiKey: "TWÓJ_API_KEY",
  authDomain: "TWÓJ_PROJECT_ID.firebaseapp.com",
  projectId: "TWÓJ_PROJECT_ID",
  storageBucket: "TWÓJ_PROJECT_ID.appspot.com",
  messagingSenderId: "TWÓJ_MESSAGING_SENDER_ID",
  appId: "TWÓJ_APP_ID",
};
```

## 4. Włącz Email/Password Authentication

1. W Firebase Console → Authentication
2. Kliknij "Get Started"
3. Zakładka "Sign-in method"
4. Włącz "Email/Password"
5. Zapisz

## 5. Uruchom aplikację

```bash
yarn start
```

Potem naciśnij `a` dla Android lub `i` dla iOS.

## Gotowe! 🎉

Teraz możesz:

- Rejestrować nowych użytkowników
- Logować się
- Wylogowywać się
- Sesja jest automatycznie zapisywana (AsyncStorage)
