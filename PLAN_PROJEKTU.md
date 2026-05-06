# Plan projektu: FitTrack

Termin przygotowania planu: 2026-05-09

## Temat i nazwa aplikacji

**FitTrack** - aplikacja webowa do planowania treningow, zapisywania aktywnosci fizycznej oraz monitorowania postepow sportowych uzytkownika.

## Opis funkcjonalnosci

- Rejestracja i logowanie uzytkownika do aplikacji.
- Tworzenie, edycja, wstrzymywanie i usuwanie planow treningowych.
- Zapisywanie wykonanych treningow z data, czasem, typem aktywnosci, dystansem, kaloriami i notatkami.
- Ustalanie celow treningowych, np. liczba treningow tygodniowo, dystans, laczny czas treningow albo masa ciala.
- Podglad historii aktywnosci z filtrowaniem oraz sortowaniem.
- Panel uzytkownika z tygodniowym podsumowaniem, wykresem, osiagnieciami i aktywnymi planami.

## Grupa docelowa

Osoby cwiczace amatorsko, studenci i poczatkujacy sportowcy, ktorzy chca uporzadkowac plan treningowy, zapisywac aktywnosci i widziec postepy bez uzywania rozbudowanych narzedzi sportowych.

## Stos technologiczny

- Framework: Vue 3 z Composition API.
- Build tool: Vite.
- Testy: Vitest.
- Ikony: lucide-vue-next.
- Dane: LocalStorage w przegladarce.
- Publiczne demo: Vercel, Netlify albo GitHub Pages.

## Wstepna lista komponentow

- `AuthPanel` - rejestracja, logowanie i tryb demo.
- `AppHeader` - nawigacja po widokach aplikacji.
- `DashboardSummary` - podsumowanie postepow, statystyki i osiagniecia.
- `ProgressCharts` - wykres minut aktywnosci w tygodniu.
- `PlanManager` - CRUD planow treningowych.
- `WorkoutLog` - formularz zapisu wykonanego treningu.
- `GoalManager` - cele treningowe oraz parametry profilu.
- `ActivityHistory` - historia aktywnosci, filtrowanie i sortowanie.

## Makieta / szkic UI

```text
+--------------------------------------------------------------+
| FT FitTrack        [Panel] [Plany] [Trening] [Cele] [Historia]|
+--------------------------------------------------------------+
| Panel uzytkownika: szybkie podsumowanie + przycisk treningu   |
+----------------+----------------+----------------+-----------+
| Treningi tydz. | Dystans        | Sredni czas    | Seria dni |
+----------------+----------------+----------------+-----------+
| Wykres tygodnia                | Cele i paski postepu         |
+--------------------------------+------------------------------+
| Aktywne plany                  | Osiagniecia                   |
+--------------------------------+------------------------------+
```

Widoki `Plany`, `Trening`, `Cele` i `Historia` dziela ekran na formularz oraz liste rekordow. Na telefonie ukladaja sie pionowo.

## Plan testow

- Test obliczania tygodnia treningowego od poniedzialku do niedzieli.
- Test podsumowania treningow: liczba aktywnosci, laczny czas, dystans i sredni czas.
- Test oceny realizacji celow treningowych i celu masy ciala.
- Test danych do wykresu tygodniowego oraz logiki osiagniec.

## Link do repozytorium

Do uzupelnienia po zalozeniu publicznego repozytorium GitHub/GitLab.
