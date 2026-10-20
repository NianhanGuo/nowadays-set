# SET · Nowadays

An image-based game about visual connections, built from Nianhan Guo’s Nowadays collection on Are.na.

## Play

[Open the website](https://set-twelve-cards-nianhan.guonianhan1223.chatgpt.site/) · [Are.na collection](https://www.are.na/nianhan-guo/nowadays-cxvb8zqr_t8)

- **Match:** find three images that form a set in Library.
- **Library:** browse sets and image connections, save your own three-card sets, or remove sets. Changes update the game immediately.
- **Map:** drag between images to draw connections. Click a line to remove it; Undo restores the last change.

Custom sets, removed sets, game progress, and map connections are stored in the current browser. They are not synced between devices.

## Run locally

No build step or dependencies are needed. With Python 3 installed:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Serve over HTTP rather than opening the HTML file directly.

## Tests

With Node.js installed:

```sh
node scripts/test-game.mjs
node scripts/test-editable-sets.mjs
node scripts/test-library.mjs
node scripts/test-map.mjs
```

## Files

- `dist/`: deployable static website, including scripts, styles, image assets, and the card catalogue.
- `scripts/`: game and data checks. Map helper tests also cover retained functions from the earlier free-layout map.

The current catalogue has 24 cards, including 17 from Unexpected, and 130 built-in sets. Source links for the images are retained in `dist/data.json`. Image rights remain with their respective creators; inclusion here does not grant a license to the images.
