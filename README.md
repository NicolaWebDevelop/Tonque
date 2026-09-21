📰 Tongue – Hacker News Web App

Benvenuto su Tongue!

Tongue è una web application sviluppata in JavaScript ES6+ che recupera e visualizza le ultime notizie pubblicate su Hacker News.

Il progetto utilizza Vite, Axios, SCSS e Vitest, con una struttura modulare basata su un semplice Service Pattern per separare accesso ai dati, logica applicativa e interfaccia.

🌐 Live Demo: https://tonque.netlify.app/
💻 Repository GitHub: https://github.com/NicolaWebDevelop/Tonque

✨ Funzionalità

Recupero delle ultime news da Hacker News

Visualizzazione iniziale di 10 notizie

Caricamento progressivo tramite pulsante Carica altre news

Navigazione verticale tra i blocchi di notizie

Scroll automatico verso il nuovo gruppo caricato

Data delle news formattata

Link diretto alla notizia originale

Immagini pertinenti recuperate tramite Pexels API

Ricerca immagine basata sul titolo della news

Immagine fallback quando non è disponibile un risultato valido

Sistema di segnalibri

Persistenza dei segnalibri tramite localStorage

Visualizzazione progressiva dei segnalibri salvati

Rimozione singola o completa dei segnalibri

Layout completamente responsive

Build di produzione con Vite

Deploy tramite Netlify

Netlify Function per proteggere la chiave API di Pexels

Test automatici con Vitest

🛠️ Tecnologie usate

HTML5

SCSS / Sass

JavaScript ES6+

Vite

Axios

Vitest

Bootstrap Icons

Hacker News Firebase API

Pexels API

Netlify Functions

LocalStorage

Prettier per la formattazione del codice

📂 Struttura del progetto

TonqueVITEPRO/
├── index.html
├── package.json
├── package-lock.json
├── netlify.toml
├── .gitignore
├── .prettierrc
├── .prettierignore
├── README.md
│
├── netlify/
│   └── functions/
│       └── article-image.mjs
│
└── src/
    ├── img/
    │
    ├── js/
    │   ├── index.js
    │   ├── backtotop.js
    │   ├── navigatore.js
    │   ├── notizie.js
    │   │
    │   ├── services/
    │   │   ├── articleImageService.js
    │   │   ├── bookmarkService.js
    │   │   └── hackerNewsService.js
    │   │
    │   └── utils/
    │       └── formatDate.js
    │
    ├── scss/
    │   ├── base/
    │   ├── components/
    │   ├── sections/
    │   └── main.scss
    │
    └── test/
        ├── bookmarkService.test.js
        ├── formatDate.test.js
        └── hackerNewsService.test.js

🧱 Architettura

Tongue utilizza un Service Pattern per separare le responsabilità e mantenere il codice più leggibile, riutilizzabile e testabile.

📰 Hacker News

Hacker News API
       ↓
hackerNewsService.js
       ↓
notizie.js
       ↓
DOM / UI

🖼️ Immagini Pexels

Titolo della news
       ↓
articleImageService.js
       ↓
Netlify Function
       ↓
Pexels API
       ↓
Immagine news / fallback

La chiave API Pexels rimane lato server tramite variabile d'ambiente e non viene esposta direttamente nel codice frontend.

🔖 Segnalibri

localStorage
       ↓
bookmarkService.js
       ↓
notizie.js
       ↓
DOM / UI

📰 Gestione delle news

Il file:

src/js/notizie.js

si occupa principalmente di:

rendering delle card

paginazione delle news

caricamento dei gruppi successivi

aggiornamento del contatore

collegamento delle immagini pertinenti

gestione dei segnalibri

rendering della sezione segnalibri

eventi dei pulsanti

scroll verso il nuovo gruppo di notizie

Le news vengono caricate in gruppi da:

const PAGE_SIZE = 10;

🧭 Navigazione verticale

Il file:

src/js/navigatore.js

gestisce la navigazione verticale tra i diversi blocchi di news caricati.

Il menu aggiorna automaticamente la pagina attiva durante lo scroll e include un collegamento rapido alla sezione dei segnalibri.

🖼️ Immagini delle news

Il file:

src/js/services/articleImageService.js

richiede al backend Netlify un'immagine pertinente per ogni notizia.

La Function:

netlify/functions/article-image.mjs

utilizza il titolo della news per effettuare una ricerca su Pexels.

Se non viene trovata un'immagine valida, Tongue utilizza un'immagine fallback.

🔖 Segnalibri

I segnalibri vengono salvati nel browser utilizzando:

localStorage;

In questo modo rimangono disponibili anche dopo il refresh della pagina.

Il file:

src/js/services/bookmarkService.js

contiene la logica per verificare, aggiungere e rimuovere i segnalibri senza modificare direttamente il DOM.

🔌 API utilizzate

Hacker News Firebase API

Endpoint principali:

/v0/newstories.json
/v0/item/{id}.json

Le richieste vengono gestite tramite Axios all'interno di:

src/js/services/hackerNewsService.js

Pexels API

Pexels viene utilizzato per associare alle news immagini pertinenti.

La richiesta viene eseguita tramite una Netlify Function, così la chiave API non viene inserita nel bundle frontend.

🔐 Variabili d'ambiente

Per utilizzare Pexels in locale crea un file:

.env

nella root del progetto e aggiungi:

PEXELS_API_KEY=la_tua_chiave_pexels

Il file .env non deve essere pubblicato su GitHub ed è escluso tramite .gitignore.

Su Netlify la stessa variabile deve essere configurata nelle Environment Variables del progetto.

🚀 Installazione

Clona il repository:

git clone https://github.com/NicolaWebDevelop/Tonque.git

Entra nella cartella del progetto:

cd Tonque

Installa le dipendenze:

npm install

Avvia Vite in sviluppo:

npm run dev

Per testare anche la Netlify Function in locale, avvia il progetto tramite Netlify Dev:

netlify dev

⚙️ Script disponibili

Avvio in sviluppo

npm run dev

Build di produzione

npm run build

Anteprima della build

npm run preview

Vitest in modalità watch

npm run test

Esecuzione singola dei test

npm run test:run

🧪 Test automatici

I test sono realizzati con Vitest.

Attualmente il progetto contiene:

bookmarkService.test.js → 4 test

formatDate.test.js → 3 test

hackerNewsService.test.js → 4 test

Totale:

Test Files  3 passed (3)
Tests       11 passed (11)

I test verificano:

aggiunta e rimozione dei segnalibri

controllo dello stato di un segnalibro

formattazione delle date

recupero degli ID delle news

recupero di una singola news

gestione degli errori nelle richieste HTTP

Per eseguirli:

npm run test:run

📦 Build

Per creare la versione pronta per la produzione:

npm run build

Vite genera automaticamente la cartella:

dist/

che contiene i file ottimizzati per la pubblicazione.

🌐 Deploy

Il progetto è pubblicato tramite Netlify.

🔗 Apri Tongue online

Il file:

netlify.toml

configura:

comando di build

cartella dist

directory delle Netlify Functions

ambiente locale tramite Netlify Dev

🎯 Obiettivo del progetto

Tongue è stato sviluppato per mettere in pratica:

JavaScript moderno

moduli ES

programmazione asincrona

chiamate API

manipolazione del DOM

separazione delle responsabilità

Service Pattern

gestione dello stato locale

integrazione frontend/backend serverless

variabili d'ambiente

responsive design

testing automatico

workflow moderno con Vite

deploy su Netlify

✅ Stato del progetto

La versione attuale completa correttamente la build di produzione e supera tutti i test automatici:

✓ Build Vite completata
✓ 3 Test Files passed
✓ 11 Tests passed

👨‍💻 Autore

Nicola Berardi – Frontend Developer
🌐 Portfolio
💻 GitHub
📧 Email
