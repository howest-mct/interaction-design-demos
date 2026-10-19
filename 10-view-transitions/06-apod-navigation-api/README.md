# APOD met Navigation API

Zelfde demo als `05-apod`, maar met `script/script.js`. Via de Navigation API en de events `pageswap` en `pagereveal` krijgt de pagina een `data-transition`-waarde (`push`, `pop` of `reload`), zodat vooruit en achteruit navigeren een andere animatie hebben. Er zijn geen dependencies.

## Starten

Open de map in VS Code en start de Live Server-extensie op `index.html`. Een andere statische server werkt ook, bijvoorbeeld:

```bash
python3 -m http.server 3000
```

Op Windows gebruik je `py -m http.server 3000`. Open daarna http://localhost:3000.
