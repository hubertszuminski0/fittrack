# FitTrack

FitTrack to aplikacja webowa do planowania treningow, zapisywania wykonanych aktywnosci oraz monitorowania postepow sportowych. Projekt zostal przygotowany w Vue 3 i Vite.

## Funkcje

- rejestracja i logowanie uzytkownika w lokalnej pamieci przegladarki,
- tworzenie, edycja, wstrzymywanie i usuwanie planow treningowych,
- zapisywanie treningow z data, typem aktywnosci, czasem, dystansem, kaloriami i notatkami,
- definiowanie celow treningowych oraz celu masy ciala,
- panel z podsumowaniem tygodnia, wykresem, osiagnieciami i aktywnymi planami,
- historia aktywnosci z filtrowaniem i sortowaniem.

## Technologie

- Vue 3 z Composition API,
- Vite,
- Vitest,
- lucide-vue-next,
- LocalStorage jako prosta warstwa danych demonstracyjnych.


Uruchomienie Projektu

Pobierz repozytorium:
git clone https://github.com/hubertszuminski0/fittrack.git
Przejdź do folderu projektu:
cd fittrack
Zainstaluj zależności:
npm install
Uruchom aplikację:
npm run dev
Otwórz w przeglądarce adres pokazany w terminalu, np.:
http://127.0.0.1:5173/
Testy

npm run test
Build produkcyjny

npm run build
