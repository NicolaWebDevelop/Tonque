# Tongue

Tongue è una web application Front-End sviluppata in **JavaScript ES6+** che recupera e visualizza le ultime notizie pubblicate su **Hacker News**.

Il progetto utilizza **Vite** come build tool, **Axios** per le richieste alla Hacker News API e **Vitest** per i test automatici.

L'applicazione integra inoltre una **Netlify Function** che utilizza la **Pexels API** per associare automaticamente immagini pertinenti alle notizie visualizzate.

🔗 **Live Demo:**  
https://tonque.netlify.app/

🔗 **Repository GitHub:**  
https://github.com/NicolaWebDevelop/Tonque

---

## Funzionalità

- Recupero delle ultime news da Hacker News
- Recupero di circa 500 ID tramite `newstories`
- Visualizzazione iniziale di 10 news
- Caricamento progressivo di 10 news alla volta
- Pulsante **Carica altre news**
- Scroll automatico al nuovo blocco caricato
- Navigazione verticale tra i blocchi di news
- Indicatore numerico del blocco attualmente visualizzato
- Prime tre posizioni del menu sempre visibili
- Data delle news formattata
- Link diretto alla notizia originale
- Immagini pertinenti alle news tramite Pexels
- Netlify Function per proteggere la API key
- Immagine fallback personalizzata Tongue
- Sistema di segnalibri
- Persistenza dei segnalibri tramite `localStorage`
- Visualizzazione di 10 segnalibri alla volta
- Pulsante **Mostra altri segnalibri**
- Rimozione di singoli segnalibri
- Eliminazione completa dei segnalibri tramite modale
- Collegamento rapido alla sezione Segnalibri
- Layout responsive
- Build di produzione con Vite
- Deploy tramite Netlify
- Test automatici con Vitest

---

# Tecnologie utilizzate

- HTML5
- SCSS
- JavaScript ES6+
- Vite
- Axios
- Vitest
- Bootstrap Icons
- Hacker News Firebase API
- Pexels API
- Netlify Functions
- LocalStorage
- Git
- GitHub
- Netlify

---

# Architettura

Tongue utilizza un semplice **Service Pattern** per separare l'accesso ai dati dalla gestione dell'interfaccia.

La logica principale segue questa struttura:

```text
API / Servizi esterni
        ↓
Service JavaScript
        ↓
notizie.js
        ↓
DOM / UI
```

Questo permette di mantenere separate:

- comunicazione con le API
- gestione dei dati
- gestione dei segnalibri
- recupero delle immagini
- rendering dell'interfaccia
- navigazione tra i blocchi di news

---

# Hacker News

Le news vengono recuperate utilizzando la Firebase API ufficiale di Hacker News.

Flusso principale:

```text
Hacker News API
       ↓
hackerNewsService.js
       ↓
notizie.js
       ↓
DOM
```

Il service:

```text
src/js/services/hackerNewsService.js
```

espone principalmente:

```js
getLatestIds()
getNewsById(id)
```

`getLatestIds()` recupera l'elenco degli ID delle news più recenti.

`getNewsById(id)` recupera i dettagli della singola notizia.

Gli endpoint utilizzati sono:

```text
/v0/newstories.json
/v0/item/{id}.json
```

Le richieste vengono eseguite tramite **Axios**.

---

# Caricamento progressivo delle news

Tongue non carica tutte le news contemporaneamente.

Il numero di news visualizzate per ogni gruppo è definito da:

```js
const PAGE_SIZE = 10;
```

All'avvio vengono mostrate le prime 10 notizie.

Premendo:

```text
Carica altre news
```

vengono recuperate e renderizzate le successive 10.

Il caricamento progressivo riduce il numero di elementi presenti contemporaneamente nel DOM e rende l'interfaccia più semplice da navigare.

---

# Navigazione verticale

Tongue integra un menu verticale che permette di spostarsi rapidamente tra i gruppi di news già caricati.

Esempio:

```text
1
2
3
4
5
🔖
```

Ogni numero rappresenta un blocco di 10 news.

Il numero relativo al blocco attualmente visualizzato viene evidenziato automaticamente durante lo scroll.

La logica è gestita da:

```text
src/js/navigatore.js
```

Il sistema utilizza:

- `IntersectionObserver`
- rilevamento dello scroll
- `requestAnimationFrame`
- `scrollIntoView()`

per sincronizzare il menu con la posizione dell'utente nella pagina.

---

# Immagini pertinenti alle news

Le immagini delle card non sono immagini casuali.

Tongue utilizza il titolo della notizia per effettuare automaticamente una ricerca tramite la **Pexels API**.

Il flusso è:

```text
Hacker News
     ↓
titolo della news
     ↓
articleImageService.js
     ↓
Netlify Function
     ↓
Pexels API
     ↓
immagine pertinente
     ↓
Card
```

Il service Front-End è:

```text
src/js/services/articleImageService.js
```

La Netlify Function è:

```text
netlify/functions/article-image.mjs
```

Il browser non comunica direttamente con Pexels.

La richiesta passa attraverso la Netlify Function:

```text
Browser
   ↓
/.netlify/functions/article-image
   ↓
Pexels API
```

Questo permette di mantenere la **PEXELS_API_KEY fuori dal codice Front-End**.

---

# Fallback immagini

Se non viene trovata un'immagine valida, Tongue utilizza automaticamente un'immagine fallback generata per il progetto.

Il fallback contiene:

```text
TONGUE
NEWS
```

In questo modo una card non rimane mai senza contenuto grafico.

---

# Sicurezza della Pexels API Key

La chiave Pexels non viene salvata nel repository GitHub.

In locale viene utilizzato un file:

```text
.env
```

contenente:

```env
PEXELS_API_KEY=YOUR_API_KEY
```

Il file `.env` è escluso tramite `.gitignore`.

In produzione la stessa variabile viene configurata tramite le **Environment Variables di Netlify**:

```text
PEXELS_API_KEY
```

La Netlify Function può quindi leggerla tramite:

```js
process.env.PEXELS_API_KEY
```

senza esporla nel bundle JavaScript inviato al browser.

---

# Pexels

Tongue utilizza Pexels come sorgente delle immagini associate alle news.

La ricerca viene costruita dinamicamente utilizzando il titolo della notizia.

Esempio:

```text
NASA announces new lunar mission
```

può generare una ricerca relativa a:

```text
NASA lunar mission
```

La Function restituisce informazioni come:

```js
{
  imageUrl,
  source,
  photographer,
  photographerUrl,
  photoUrl,
  query
}
```

Nel footer del progetto è presente il riferimento a **Pexels** come sorgente per alcune immagini utilizzate nell'applicazione.

---

# Segnalibri

Ogni news può essere salvata tramite il pulsante bookmark.

I dati vengono memorizzati tramite:

```js
localStorage
```

Il flusso è:

```text
localStorage
     ↓
bookmarkService.js
     ↓
notizie.js
     ↓
DOM
```

Il service:

```text
src/js/services/bookmarkService.js
```

espone principalmente:

```js
isBookmarked(bookmarks, newsId)

toggleBookmark(bookmarks, news)
```

Queste funzioni non manipolano direttamente il DOM e possono quindi essere testate separatamente.

---

# Gestione dei segnalibri

I segnalibri vengono mostrati in gruppi da:

```js
const BOOKMARK_PAGE_SIZE = 10;
```

Sono disponibili:

- salvataggio di una news
- rimozione di una singola news
- visualizzazione progressiva dei bookmark
- pulsante **Mostra altri segnalibri**
- eliminazione completa
- modale di conferma
- persistenza dopo il refresh

---

# Gestione principale delle news

Il file:

```text
src/js/notizie.js
```

coordina le principali funzionalità dell'applicazione.

Gestisce:

- rendering delle card
- caricamento progressivo
- contatore delle news
- recupero delle immagini
- fallback immagini
- creazione dei bookmark
- aggiornamento delle icone
- rendering dei segnalibri
- eliminazione dei segnalibri
- collegamento ai service
- eventi dell'interfaccia
- scroll tra i blocchi
- comunicazione con il navigatore verticale

---

# Struttura principale del progetto

```text
Tongue/
│
├── index.html
├── package.json
├── netlify.toml
│
├── netlify/
│   └── functions/
│       └── article-image.mjs
│
├── src/
│   │
│   ├── img/
│   │
│   ├── js/
│   │   ├── index.js
│   │   ├── notizie.js
│   │   ├── navigatore.js
│   │   ├── backtotop.js
│   │   │
│   │   ├── services/
│   │   │   ├── articleImageService.js
│   │   │   ├── bookmarkService.js
│   │   │   └── hackerNewsService.js
│   │   │
│   │   └── utils/
│   │       └── formatDate.js
│   │
│   ├── scss/
│   │   ├── base/
│   │   ├── components/
│   │   └── sections/
│   │
│   └── test/
│       ├── bookmarkService.test.js
│       ├── formatDate.test.js
│       └── hackerNewsService.test.js
│
└── README.md
```

---

# Installazione

Clona il repository:

```bash
git clone https://github.com/NicolaWebDevelop/Tonque.git
```

Entra nella cartella:

```bash
cd Tonque
```

Installa le dipendenze:

```bash
npm install
```

---

# Configurazione Pexels

Per utilizzare la ricerca automatica delle immagini è necessaria una API key Pexels.

Crea nella root del progetto:

```text
.env
```

e inserisci:

```env
PEXELS_API_KEY=YOUR_API_KEY
```

Non pubblicare mai questo file nel repository.

---

# Avvio in sviluppo

Per lavorare solamente sul Front-End Vite:

```bash
npm run dev
```

Il server viene normalmente avviato su:

```text
http://localhost:5173
```

---

# Avvio con Netlify Functions

Per utilizzare anche la ricerca immagini tramite Pexels è necessario avviare il progetto tramite **Netlify Dev**:

```bash
npx netlify dev
```

Il progetto sarà disponibile normalmente su:

```text
http://localhost:8888
```

In questa modalità vengono avviati insieme:

```text
Vite
+
Netlify Functions
+
Environment Variables
```

---

# Script disponibili

## Development

```bash
npm run dev
```

## Build produzione

```bash
npm run build
```

## Preview build

```bash
npm run preview
```

## Vitest watch mode

```bash
npm run test
```

## Esecuzione completa test

```bash
npm run test:run
```

---

# Test

I test automatici sono realizzati con **Vitest**.

Attualmente sono presenti:

```text
bookmarkService.test.js       4 test
formatDate.test.js            3 test
hackerNewsService.test.js     4 test
```

Totale:

```text
Test Files  3 passed (3)
Tests       11 passed (11)
```

I test verificano:

- aggiunta dei bookmark
- rimozione dei bookmark
- verifica dello stato bookmark
- comportamento delle funzioni pure
- formattazione delle date
- recupero degli ID delle news
- recupero di una singola news
- gestione degli errori API

Per eseguire tutti i test:

```bash
npm run test:run
```

---

# Build

Per creare la versione pronta alla produzione:

```bash
npm run build
```

Vite genera:

```text
dist/
```

contenente gli asset ottimizzati.

La versione attuale completa correttamente la build di produzione.

---

# Deploy

Il progetto è pubblicato tramite **Netlify**.

Il file:

```text
netlify.toml
```

contiene la configurazione relativa a:

- comando di build
- cartella `dist`
- directory delle Functions
- configurazione dell'ambiente locale Netlify Dev

La variabile:

```text
PEXELS_API_KEY
```

viene configurata separatamente su Netlify e non viene inclusa nel repository.

Il deploy viene aggiornato automaticamente quando viene pubblicata una nuova versione sul branch principale del repository.

---

# API utilizzate

## Hacker News

Utilizzata per recuperare:

- elenco delle news
- titolo
- URL
- timestamp
- ID

Endpoint principali:

```text
/v0/newstories.json

/v0/item/{id}.json
```

## Pexels

Utilizzata per recuperare immagini pertinenti alle notizie.

La richiesta viene effettuata esclusivamente attraverso:

```text
netlify/functions/article-image.mjs
```

in modo da proteggere la API key.

---

# Service Pattern

Uno degli obiettivi principali del progetto è evitare di concentrare tutta la logica all'interno di `notizie.js`.

I service hanno responsabilità specifiche:

```text
hackerNewsService.js
→ Hacker News API

bookmarkService.js
→ logica dei segnalibri

articleImageService.js
→ immagini delle news
```

La UI può quindi utilizzare questi moduli senza conoscere i dettagli delle implementazioni sottostanti.

---

# Obiettivi del progetto

Tongue è stato sviluppato per consolidare competenze relative a:

- JavaScript ES6+
- ES Modules
- programmazione asincrona
- `async / await`
- chiamate API
- Axios
- Fetch API
- manipolazione del DOM
- Service Pattern
- separazione delle responsabilità
- gestione dello stato
- LocalStorage
- IntersectionObserver
- gestione dello scroll
- SCSS modulare
- responsive design
- environment variables
- serverless functions
- sicurezza delle API key
- Git e GitHub
- testing automatico
- Vitest
- Vite
- deployment con Netlify

---

# Stato del progetto

La versione attuale supera tutti i test automatici:

```text
Test Files  3 passed (3)
Tests       11 passed (11)
```

e completa correttamente:

```bash
npm run build
```

La versione online integra:

```text
Hacker News
+
Pexels
+
Netlify Functions
+
LocalStorage
+
Vitest
+
Vite
```

---

# Autore

**Nicola Berardi**

Progetto Front-End sviluppato per consolidare competenze in JavaScript moderno, API REST, architettura del codice, testing e deployment.
