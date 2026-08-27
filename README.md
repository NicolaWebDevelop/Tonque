# Tongue

Tongue è una web application sviluppata in **JavaScript ES6+** che recupera e visualizza le ultime notizie pubblicate su **Hacker News**.

Il progetto è costruito con **Vite**, utilizza **Axios** per le richieste HTTP e **Vitest** per i test automatici.  
L'architettura separa la logica di accesso ai dati dalla gestione dell'interfaccia tramite un semplice **Service Pattern**.

---

## Funzionalità

- Recupero delle ultime news da Hacker News
- Visualizzazione di 10 news alla volta
- Pulsante **Carica altre news**
- Scroll automatico alla prima card del nuovo gruppo
- Data delle news formattata
- Link diretto alla notizia originale
- Sistema di segnalibri
- Salvataggio dei segnalibri tramite `localStorage`
- Visualizzazione di 10 segnalibri alla volta
- Pulsante **Mostra altri segnalibri**
- Rimozione dei segnalibri salvati
- Layout responsive
- Build di produzione con Vite
- Test automatici con Vitest

---

## Tecnologie utilizzate

- HTML5
- SCSS
- JavaScript ES6+
- Vite
- Axios
- Vitest
- Bootstrap Icons
- Hacker News API
- LocalStorage

---

## Installazione

Clona il progetto oppure scarica i file, quindi apri il terminale nella cartella del progetto.

Installa le dipendenze:

```bash
npm install
```

Avvia il server di sviluppo:

```bash
npm run dev
```

Per rendere il server raggiungibile anche da altri dispositivi presenti sulla stessa rete:

```bash
npm run dev -- --host
```

---

## Script disponibili

### Avvio in sviluppo

```bash
npm run dev
```

### Build di produzione

```bash
npm run build
```

### Anteprima della build

```bash
npm run preview
```

### Avvio di Vitest in modalità watch

```bash
npm run test
```

### Esecuzione singola di tutti i test

```bash
npm run test:run
```

---

## Struttura principale del progetto

```text
Tongue/
├── index.html
├── package.json
├── src/
│   ├── img/
│   ├── js/
│   │   ├── index.js
│   │   ├── notizie.js
│   │   ├── backtotop.js
│   │   ├── services/
│   │   │   ├── bookmarkService.js
│   │   │   └── hackerNewsService.js
│   │   └── utils/
│   │       └── formatdate.js
│   ├── scss/
│   └── test/
│       ├── bookmarkService.test.js
│       ├── formatDate.test.js
│       └── hackerNewsService.test.js
└── README.md
```

---

## Architettura

Il progetto utilizza un **Service Pattern** per separare le responsabilità.

```text
Hacker News API
       ↓
hackerNewsService.js
       ↓
notizie.js
       ↓
DOM / UI
```

La gestione dei segnalibri segue una separazione simile:

```text
localStorage / dati
       ↓
bookmarkService.js
       ↓
notizie.js
       ↓
DOM / UI
```

Questa organizzazione evita di concentrare tutta la logica in un unico file e rende il codice più semplice da leggere, modificare e testare.

---

## Service Hacker News

Il file:

```text
src/js/services/hackerNewsService.js
```

si occupa esclusivamente della comunicazione con Hacker News tramite Axios.

Le principali funzioni sono:

```js
getLatestIds()
getNewsById(id)
```

`notizie.js` non deve conoscere i dettagli della richiesta HTTP: chiede semplicemente i dati al service.

---

## Service dei segnalibri

Il file:

```text
src/js/services/bookmarkService.js
```

contiene la logica per controllare e modificare lo stato dei segnalibri.

Le principali funzioni sono:

```js
isBookmarked(bookmarks, newsId)
toggleBookmark(bookmarks, news)
```

Queste funzioni non modificano direttamente il DOM e possono quindi essere testate separatamente.

---

## Gestione delle news

Il file:

```text
src/js/notizie.js
```

gestisce principalmente:

- rendering delle card
- paginazione delle news
- aggiornamento del contatore
- interazione con i segnalibri
- aggiornamento delle icone
- rendering della sezione dei segnalibri
- eventi dei pulsanti
- scroll verso il nuovo gruppo di news

Le news vengono mostrate in gruppi da:

```js
const PAGE_SIZE = 10;
```

---

## Segnalibri

I segnalibri vengono salvati nel browser utilizzando:

```js
localStorage
```

In questo modo rimangono disponibili anche dopo il refresh della pagina.

Il numero iniziale di segnalibri visualizzati è:

```js
const BOOKMARK_PAGE_SIZE = 10;
```

L'utente può visualizzarne altri tramite il pulsante **Mostra altri segnalibri**.

---

## Test

I test sono realizzati con **Vitest**.

Attualmente il progetto contiene:

- `bookmarkService.test.js` → 4 test
- `formatDate.test.js` → 3 test
- `hackerNewsService.test.js` → 4 test

Totale:

```text
3 Test Files
11 Tests
```

I test verificano:

- aggiunta e rimozione dei segnalibri
- controllo dello stato di un segnalibro
- formattazione delle date
- recupero degli ID delle news
- recupero di una singola news
- gestione degli errori nelle richieste HTTP

Per eseguirli:

```bash
npm run test:run
```

---

## Build

Per creare la versione pronta per la produzione:

```bash
npm run build
```

Vite genera automaticamente la cartella:

```text
dist/
```

che contiene i file ottimizzati per la pubblicazione.

---

## API

Tongue utilizza la Firebase API ufficiale di Hacker News.

Endpoint principali utilizzati:

```text
/v0/newstories.json
/v0/item/{id}.json
```

Axios gestisce le richieste HTTP all'interno di `hackerNewsService.js`.

---

## Obiettivo del progetto

Tongue è stato sviluppato con l'obiettivo di mettere in pratica:

- JavaScript moderno
- moduli ES
- gestione asincrona dei dati
- chiamate API
- manipolazione del DOM
- separazione delle responsabilità
- Service Pattern
- gestione dello stato locale
- responsive design
- testing automatico
- workflow moderno con Vite

---

## Stato del progetto

La versione attuale supera tutti i test automatici e la build di produzione viene completata correttamente.

```text
Test Files  3 passed (3)
Tests       11 passed (11)
```

---

## Autore

Progetto realizzato come esercitazione e progetto Front-End per consolidare competenze in JavaScript, API, architettura del codice e testing.
