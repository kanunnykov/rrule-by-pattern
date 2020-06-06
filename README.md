rruleByPattern.js
======================

**Build recurrence rules by patterns / templates like '111100' (i.e. 4 on, 2 off)**

[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Downloads][downloads-image]][downloads-url]

It is a [rrule.js](https://github.com/jakubroztocil/rrule) extension that gives more flexibility in creation of recurring events. The pattern / template can be absolutely custom and as long as you need. This extension is well suited for shift plan (rota, roster) set ups.

* * *

### Quick Start

-   [Demo app](https://kanunnykov.github.io/rrule-by-pattern/)

#### Install

```bash
$ yarn add rrule-by-pattern
# or
$ npm install rrule-by-pattern
```

Alternatively, download manually:
* [rruleByPattern.min.js](https://kanunnykov.github.io/rrule-by-pattern/dist/es5/rruleByPattern.min.js) (bundled without rrule.js, minified)
* [rruleByPattern.js](https://kanunnykov.github.io/rrule-by-pattern/dist/es5/rruleByPattern.js) (bundled without rrule.js, not minified)

As rrule.js is not bundled with rruleByPattern.js, it's needed to install or download it as well.

```html
<script src="./rrule-by-pattern/dist/es5/rruleByPattern.min.js"></script>
```

Then you will be able to use global variable `rruleByPattern` (e.g. `new rruleByPattern.ShortRRuleSetBuilder()`).

#### Usage

There are 2 builders. One builds readable rrule sets, another - short.

Both builders need 3 arguments: `rruleSet`, `pattern`, `count`.

The `rruleSet` is a rrule.js RRuleSet obviously and it should be built and then passed to the builder. The builder will build a new RRuleSet based on the passed one.

The `pattern` is just an array of 0 and 1:
* 0 exclude date (e.g. shift off);
* 1 include date (e.g. shift on).

The `count` is a number of dates you want to have in a built RRuleSet. For sets that have 'until' or 'count', it can be just `rruleSet.count()`. For unlimited sets you should pick a count by yourself. 

**ReadableRRuleSetBuilder:**
```es6
import { RRule, RRuleSet } from 'rrule'
import { ReadableRRuleSetBuilder } from 'rrule-by-pattern'

const rruleSet = new RRuleSet()

rruleSet.rrule(new RRule({
    freq: RRule.HOURLY,
    dtstart: new Date(Date.UTC(2025, 11, 25, 6)),
    until: new Date(Date.UTC(2025, 11, 30, 18)),
    interval: 12
}))

rruleSet.rrule(new RRule({
    freq: RRule.DAILY,
    dtstart: new Date(Date.UTC(2026, 0, 1, 6)),
    until: new Date(Date.UTC(2026, 0, 30, 6)),
}))

// Original RRuleSet string
rruleSet.toString()
DTSTART:20251225T060000Z
RRULE:FREQ=HOURLY;UNTIL=20251230T180000Z;INTERVAL=12
DTSTART:20260101T060000Z
RRULE:FREQ=DAILY;UNTIL=20260130T060000Z

const pattern: Array<0|1> = [1,1,1,1,0,0]

const builder = new ReadableRRuleSetBuilder(
    rruleSet,
    pattern,
    rruleSet.count()
)

const newRRuleSet = builder.build()

// Built RRuleSet string
newRRuleSet.toString()
DTSTART:20251225T060000Z
RRULE:FREQ=HOURLY;UNTIL=20251230T180000Z;INTERVAL=12
DTSTART:20260101T060000Z
RRULE:FREQ=DAILY;UNTIL=20260130T060000Z
EXDATE:20251227T060000Z,20251227T180000Z,20251230T060000Z,20251230T180000Z,20260105T060000Z,20260106T060000Z,20260111T060000Z,20260112T060000Z,20260117T060000Z,20260118T060000Z,20260123T060000Z,20260124T060000Z,20260129T060000Z,20260130T060000Z
```

**ShortRRuleSetBuilder:**
```es6
import { RRule, RRuleSet } from 'rrule'
import { ShortRRuleSetBuilder } from 'rrule-by-pattern'

const rruleSet = new RRuleSet()

rruleSet.rrule(new RRule({
    freq: RRule.HOURLY,
    dtstart: new Date(Date.UTC(2025, 11, 25, 6)),
    until: new Date(Date.UTC(2025, 11, 30, 18)),
    interval: 12
}))

rruleSet.rrule(new RRule({
    freq: RRule.DAILY,
    dtstart: new Date(Date.UTC(2026, 0, 1, 6)),
    until: new Date(Date.UTC(2026, 0, 30, 6)),
}))

// Original RRuleSet string
rruleSet.toString()
DTSTART:20251225T060000Z
RRULE:FREQ=HOURLY;UNTIL=20251230T180000Z;INTERVAL=12
DTSTART:20260101T060000Z
RRULE:FREQ=DAILY;UNTIL=20260130T060000Z

const pattern: Array<0|1> = [1,1,1,1,0,0]

const builder = new ShortRRuleSetBuilder(
    rruleSet,
    pattern,
    rruleSet.count()
)

const newRRuleSet = builder.build()

// Built RRuleSet string
newRRuleSet.toString()
DTSTART:20250101T060000Z
RRULE:FREQ=YEARLY;UNTIL=20251231T235959Z;BYDAY=MO,TU,WE,TH,FR,SA,SU;BYSETPOS=359,360,362,363
DTSTART:20250101T180000Z
RRULE:FREQ=YEARLY;UNTIL=20251231T235959Z;BYDAY=MO,TU,WE,TH,FR,SA,SU;BYSETPOS=359,360,362,363
DTSTART:20260101T060000Z
RRULE:FREQ=YEARLY;UNTIL=20261231T235959Z;BYDAY=MO,TU,WE,TH,FR,SA,SU;BYSETPOS=1,2,3,4,7,8,9,10,13,14,15,16,19,20,21,22,25,26,27,28
```

### Development

rruleByPattern.js is implemented in TypeScript.

To run the code, checkout this repository and run:

```bash
$ yarn
```

To run the tests, run:

```bash
$ yarn test
```

To build files for distribution, run:

```bash
$ yarn build
```

[npm-url]: https://npmjs.org/package/rrule-by-pattern
[npm-image]: http://img.shields.io/npm/v/rrule-by-pattern.svg

[ci-url]: https://github.com/kanunnykov/rrule-by-pattern/actions
[ci-image]: https://github.com/kanunnykov/rrule-by-pattern/workflows/Node.js%20CI/badge.svg

[downloads-url]: https://npmjs.org/package/rrule-by-pattern
[downloads-image]: http://img.shields.io/npm/dm/rrule-by-pattern.svg?style=flat-square
