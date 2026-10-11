# double-metaphone

Phonetic encoder that produces a primary and an alternate 4-letter code for an English word, so that words pronounced alike share a code despite irregular spelling.

```js
import { doubleMetaphone } from "./src/index.js";

const { primary, alternate } = doubleMetaphone("Smith");
// primary === "SM00", alternate === "SM00" in the classic algorithm;
// this library returns pure-letter codes (see below).
```

Exported names: `doubleMetaphone(word)` -> `{ primary: string, alternate: string }`.

## Why this exists

Double Metaphone is the de-facto phonetic key for English search and dedup work because it produces two codes per word, letting you match "Smith" against "Smythe" without a fuzzy-string pass. This is a zero-dependency ESM port of the published rules; the value is the rule table, which we have kept in order rather than refactored for brevity.

## Edge you will hit

The original algorithm uses the digit `0` to represent the "th" sound. This library emits the letter `T` instead, so that every code is pure ASCII letters and safe as a filename or key. The trade-off is that words distinguished only by "th" vs "t" collapse together. If you need the classic `0`, fork and replace the two `push("T")` calls in `handleT`.

`Z` is coded as `S`, matching the original paper's sibilant merger. `CH` at the start of a word followed by a vowel is treated as French (`chef`); medial `CH` is treated as Germanic (`chemistry`).

The library only handles English. Pass it a German or French word and you will get an English speaker's mispronunciation of it, which is usually what you want for search and usually wrong for anything else.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

