# investeringsberegner.dk — DevLog

> Gratis investeringsberegner med korrekt dansk skatteberegning (ASK/frie midler/pension)
> Domain: investeringsberegner.dk | Stack: Statisk HTML/CSS/JS (ingen build step) | Chart.js 4

---

## Session 5 — 2026-02-13

### Kontekst
- SEO gap-analyse baseret paa Google Ads keyword-data (248 keywords)
- 15 nye artikler der daekker keyword-huller identificeret i analysen

### Implementeret

- **SEO gap-analyse** af Google Ads keyword CSV
  - Parsede 248 keywords med maanedligt volumen, konkurrence og CPC
  - Identificerede 15 keyword-klynger der ikke var daekket (~16.500 maanedligt soegevolumen)
  - Prioriteret efter volumen/KD ratio

- **15 nye artikelsider** (bygget med 3 parallelle agenter)
  - `/guld-investering/` — Investering i guld, fysisk guld, guld-ETF'er, beskatning
  - `/koeb-aktier/` — Trin-for-trin guide til aktiekoeb
  - `/investeringsforeninger/` — Guide til danske investeringsforeninger
  - `/obligationer/` — Stats- og realkreditobligationer, afkast, risiko
  - `/feriebolig-investering/` — Feriebolig/sommerhus som investering
  - `/aktier-for-begyndere/` — Aktier fra bunden for nybegyndere
  - `/investeringsplatforme/` — Sammenlign Nordnet, Saxo m.fl.
  - `/investeringsraadgiver/` — Hvornaar og hvordan faa raadgivning
  - `/bedste-indeksfonde/` — Oversigt over indeksfonde i Danmark 2026
  - `/baeredygtig-investering/` — ESG, groenne fonde, Article 8/9
  - `/aktiedepot-vs-aktiesparekonto/` — Sammenlign depot og ASK
  - `/kryptovaluta-investering/` — Bitcoin, Ethereum, crypto i DK
  - `/investeringsstrategier/` — Passiv, value, vaekst, udbytte
  - `/alternative-investeringer/` — Vindmoeller, solceller, crowdlending
  - `/ai-investering/` — AI-aktier, tematiske ETF'er, robo-advisors

- **Forside guide-oversigt opdateret** til 38 links i 4 kategorier
  - Kom i gang (6), Fonde og aktier (8), Afkast og strategi (15), Skat og kontotyper (9)

- **Sitemap opdateret** til 40 URL'er

### Git
- TBD

---

## Session 4 — 2026-02-13

### Kontekst
- Linkbuilding-forberedelse og embeddable widget

### Implementeret

- **Embeddable calculator widget** (`embed.html`)
  - Selvstaendig mini-beregner uden eksterne dependencies
  - Alle styles og JS inline — kan embedes via iframe
  - Inputs: startbelob, maanedligt indskud, aar, afkast %
  - Automatisk lys/moerk tema via `prefers-color-scheme`
  - Responsiv 300-600px, dansk talformatering
  - "Beregnet af investeringsberegner.dk" footer med backlink
  - `noindex` meta tag saa Google ikke indexerer embed-siden

- **Embed-kode side** (`embed-kode/index.html`)
  - Instruktionsside til bloggere med kopi-knap og live preview
  - Stoerrelsesvaeiger (320px, 400px, fuld bredde, 560px)
  - Vejledning til WordPress, Squarespace/Wix, nyhedsbreve
  - Foelger standard side-template (breadcrumb, tema, disclaimer)

- **Linkbuilding-plan** (`~/Desktop/linkbuilding-plan.md`)
  - Komplet plan med copy-paste templates til:
    - Reddit r/dkfinance (2 opslag)
    - FIRE DK outreach
    - 4 danske finansbloggere
    - Facebook-grupper
    - Directory submissions (Denmark.net, Product Hunt, Oeresund Startups)
    - Journalist-pitch til Boersen/FinansWatch/Finans
    - Embed widget outreach-template
  - Estimeret manuelt tidsforbrug: ~75 min

### Git
- `8ecaa6f` — Add embeddable calculator widget and embed code page

---

## Session 3 — 2026-02-13

### Kontekst
- SEO content expansion: 15 nye artikler + disclaimer paa alle sider

### Implementeret

- **15 nye artikelsider** (bygget med 3 parallelle agenter)
  - `/maanedsopsparing/` — Maanedsopsparing i fonde, Nordnet vs Saxo
  - `/etf-guide/` — Hvad er en ETF, typer, populaere ETF'er med ISIN
  - `/indeksfonde-vs-aktive-fonde/` — SPIVA-data, omkostningseffekt over tid
  - `/finansiel-uafhaengighed/` — FIRE-bevaegelsen, 4%-reglen, sparerate-tabel
  - `/investering-for-unge/` — Guide til 18-25-aarige, SU og investering
  - `/dollar-cost-averaging/` — DCA vs lump sum, psykologiske fordele
  - `/hvad-er-aop/` — AOP forklaret, effekt over tid, AOP vs TER
  - `/aktieindkomst-vs-kapitalindkomst/` — Skatteforskelle, konkrete eksempler
  - `/investere-1-million/` — Kontotype-strategi, fordeling, skatteberegning
  - `/aldersopsparing/` — Regler, indskydsgraenser 2026, PAL-skat
  - `/passiv-indkomst/` — 7 typer, kapitalbehovstabel
  - `/diversificering/` — 4 typer, korrelation, overdiversificering
  - `/skat-paa-etf/` — Lager vs realisation, positivlisten, ASK vs frie midler
  - `/investering-vs-opsparing/` — Hvornaar spare vs investere, inflationseffekt
  - `/portefoeljesammensaetning/` — Risikoprofiler, rebalancering, skatteoptimering

- **Disclaimer paa alle 23 undersider**
  - Tekst: "Indholdet paa denne side er udelukkende til informationsformaal..."
  - CSS: `.disclaimer` klasse (lille tekst, daempet farve, border-top)

- **Komplet guide-oversigt paa forsiden**
  - 4 kategorier: Kom i gang (4), Fonde og aktier (4), Afkast og strategi (9), Skat og kontotyper (6)
  - Alle 23 undersider linket fra forsiden

- **Sitemap opdateret** til 25 URL'er (24 sider + embed-kode)

### Git
- `5b0fcb2` — Add 15 supporting articles, disclaimer on all sub-pages, update sitemap
- `e602539` — Add complete guide overview on front page with all 23 articles

---

## Session 2 — 2026-02-13

### Kontekst
- SEO-implementering baseret paa Semrush keyword-analyse (285 keywords, 105.690 maanedligt volumen)
- Iterativ content-strategi prioriteret efter volumen/KD ratio

### Implementeret

- **Forside SEO-optimering** (Iteration 0)
  - Title opdateret med "Afkast beregner"
  - H1: "Investeringsberegner – Afkast beregner"
  - BreadcrumbList schema tilfojet
  - FAQPage schema med 3 lav-KD spoergsmaal
  - Guide-grid navigation sektion

- **4 Tier 1 content-sider** (Iteration 1-4)
  - `/renters-rente/` — Standalone renters rente beregner med Chart.js
  - `/aktiesparekonto/` — ASK guide med belobsgraense-historik 2019-2026
  - `/beskatning-aktier/` — Skateguide med 27/42%, realisation vs lager
  - `/investering-for-begyndere/` — 5-trins guide, HowTo schema

- **4 Tier 2 quick-win sider**
  - `/afkast-aktier/` — Historisk afkast, MSCI World/S&P 500/C25 data
  - `/afkast-ejendom/` — Cap rate, regionale afkastgrader, ejendom vs aktier
  - `/bedste-aktier/` — C25 aktier, 4 strategier, core-satellite
  - `/sikker-investering/` — Lav-risiko muligheder, 1M kr eksempelportefolje

- **CSS fixes**
  - CTA-knap usynlig i dark mode: `.article-section a.cta-button { color: #ffffff }`
  - Guide-grid bund klippet: `.article-section:last-child { margin-bottom: 4px }`
  - Guide-link baggrund: `var(--bg-secondary)` for kontrast

- **Nye CSS komponenter:** `.breadcrumb`, `.formula-box`, `.cta-box`, `.cta-button`, `.guide-grid`, `.guide-link`

### Git
- `ad63b1f` — Add SEO content pages and optimize pillar page
- `65942d6` — Add Tier 2 content pages (quick wins, low KD)

---

## Session 1 — 2026-02-13

### Kontekst
- Fuld rebuild af investeringsberegner.dk fra scratch
- Erstatter tidligere version med korrekt skattelogik for 3 danske kontotyper

### Implementeret

- **Beregningsmotor** (`js/calculator.js`, `js/tax.js`, `js/constants.js`)
  - Frie midler: 27/42% realisationsbeskatning med progressionsgraense (79.400 kr 2026)
  - Aktiesparekonto (ASK): 17% flat lagerbeskatning, aarlig skat reducerer compounding
  - Pension (PAL): 15,3% flat lagerbeskatning
  - Tab-fremfoersel for ASK og pension
  - Gift/single toggle (dobbelt progressionsgraense)
  - ASK-loft advarsel (174.200 kr i 2026)

- **UI** (`js/ui.js`, `js/chart.js`, `js/main.js`)
  - Number inputs med dansk formatering (1.000 kr) og +/- stepper buttons
  - Kontotype-selector: 3 radio-card buttons
  - Chart.js 4 med aar-for-aar visualisering
  - 50ms debounce paa input-changes
  - Resultat-tabel med skat-kolonne

- **Deling** (`js/sharing.js`)
  - URL-hash encoding af alle parametre
  - Kopier link-knap med Clipboard API
  - localStorage gem/indlaes af scenarier

- **Design** (`css/style.css`)
  - Apple-inspireret design med afrundede kort
  - Fuld dark mode med CSS custom properties
  - Responsivt layout (mobil + desktop)
  - Print styles

- **Meta og SEO**
  - Schema.org WebApplication + FAQPage
  - Open Graph + Twitter Cards
  - Canonical URL, lang="da"

### Filstruktur
```
investeringsberegner.dk/
  index.html
  css/style.css
  js/constants.js, tax.js, calculator.js, ui.js, chart.js, sharing.js, main.js
  ads.txt
  favicon.png
  sitemap.xml
```

### Git
- `62f3263` — Initial commit: investeringsberegner.dk
- Repo: github.com/esbenthomsen-byte/investeringsberegner.dk

---

## Status

| Side | Status | Session |
|------|--------|---------|
| Forside (beregner) | OK | 1 |
| /renters-rente/ | OK | 2 |
| /aktiesparekonto/ | OK | 2 |
| /beskatning-aktier/ | OK | 2 |
| /investering-for-begyndere/ | OK | 2 |
| /afkast-aktier/ | OK | 2 |
| /afkast-ejendom/ | OK | 2 |
| /bedste-aktier/ | OK | 2 |
| /sikker-investering/ | OK | 2 |
| /maanedsopsparing/ | OK | 3 |
| /etf-guide/ | OK | 3 |
| /indeksfonde-vs-aktive-fonde/ | OK | 3 |
| /finansiel-uafhaengighed/ | OK | 3 |
| /investering-for-unge/ | OK | 3 |
| /dollar-cost-averaging/ | OK | 3 |
| /hvad-er-aop/ | OK | 3 |
| /aktieindkomst-vs-kapitalindkomst/ | OK | 3 |
| /investere-1-million/ | OK | 3 |
| /aldersopsparing/ | OK | 3 |
| /passiv-indkomst/ | OK | 3 |
| /diversificering/ | OK | 3 |
| /skat-paa-etf/ | OK | 3 |
| /investering-vs-opsparing/ | OK | 3 |
| /portefoeljesammensaetning/ | OK | 3 |
| /embed-kode/ | OK | 4 |
| embed.html (widget) | OK | 4 |
| /guld-investering/ | OK | 5 |
| /koeb-aktier/ | OK | 5 |
| /investeringsforeninger/ | OK | 5 |
| /obligationer/ | OK | 5 |
| /feriebolig-investering/ | OK | 5 |
| /aktier-for-begyndere/ | OK | 5 |
| /investeringsplatforme/ | OK | 5 |
| /investeringsraadgiver/ | OK | 5 |
| /bedste-indeksfonde/ | OK | 5 |
| /baeredygtig-investering/ | OK | 5 |
| /aktiedepot-vs-aktiesparekonto/ | OK | 5 |
| /kryptovaluta-investering/ | OK | 5 |
| /investeringsstrategier/ | OK | 5 |
| /alternative-investeringer/ | OK | 5 |
| /ai-investering/ | OK | 5 |
| Disclaimer alle undersider | OK | 3 |
| Forside guide-oversigt (38 links) | OK | 5 |
| Sitemap (40 URL'er) | OK | 5 |
| Linkbuilding-plan | Klar | 4 |

### Naeste skridt
- Google Search Console setup + sitemap submit
- Linkbuilding: Reddit, FIRE DK, bloggere, directories, PR
- Hosting/deployment (GitHub Pages eller lignende)
