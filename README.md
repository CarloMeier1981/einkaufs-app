# Wochenkorb 🧺

Eine moderne, mobile-first Web-App zur Verwaltung wöchentlicher Supermarkt-Einkäufe – Einkaufsliste, Kassenzettel-Scan, Historie und Ausgaben-Statistiken, alles lokal auf dem eigenen Gerät.

## Funktionen

- **Einkaufsliste**: Schnell hinzufügen mit Autovervollständigung, Favoriten, zuletzt/häufig gekauften Produkten, wiederkehrenden Vorschlägen und einer editierbaren Wochen-Vorlage. Reihenfolge per Drag-Ersatz (Auf/Ab) änderbar.
- **Kassenzettel scannen**: Kamera-Foto (oder Datei-Upload) wird per **Tesseract.js** direkt im Browser per Texterkennung ausgewertet (dein Foto verlässt nie das Gerät). Markt, Datum, Summe und Produktzeilen werden automatisch erkannt – Ergebnis wird vor dem Speichern in einer Kontrollansicht geprüft und editiert, neue Produkte werden dabei automatisch im Produktkatalog angelegt.
- **Barcode erfassen**: Manuelle Eingabe mit automatischem Abgleich gegen vorhandene Produkte (Duplikat-Erkennung).
- **Produkte, Produktgruppen & Märkte**: Vollständige Verwaltung inkl. automatischer Kategorie-Zuordnung anhand von Schlüsselwörtern, die sich durch Nutzerkorrekturen verbessert.
- **Einkaufshistorie**: Chronologische Übersicht vergangener Einkäufe mit Detailansicht.
- **Statistiken**: Ausgaben pro Woche/Produktgruppe, Preisentwicklung einzelner Produkte, Marktvergleich, konfigurierbare Zeiträume (7 Tage bis individueller Zeitraum).
- **Suche**: Produkte, Einkäufe und Produktgruppen in einem Feld.
- **Export/Import**: Vollständiger JSON-Export sowie CSV-Export der Historie.
- **Demo-Daten**: Optionaler Beispieldatensatz zum Ausprobieren, jederzeit vollständig entfernbar.
- **Hell/Dunkel-Design**, responsive für Smartphone (Bottom-Navigation) und Desktop (Sidebar).

## Technik

Eine einzige, self-contained HTML-Datei (`index.html`) – Vanilla JavaScript mit Hash-Router, kein Build-Schritt nötig. Daten werden ausschließlich lokal im `localStorage` des Browsers gespeichert; es gibt keine Backend-Anbindung. Diagramme sind handgeschriebenes SVG.

## Lokal starten

Da die App eine einzelne HTML-Datei ist, reicht ein beliebiger statischer Webserver:

```bash
npx serve .
```

Anschließend die ausgegebene URL im Browser öffnen.
