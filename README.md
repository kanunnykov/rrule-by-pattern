rrule-from-template.js
======================

**Build recurrence rules from templates like '111100' (i.e. 4 on, 2 off)**

[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Downloads][downloads-image]][downloads-url]

It is a [rrule.js](https://github.com/jakubroztocil/rrule) extension.

* * *

### Quick Start

```bash
$ yarn add rrule-from-template
# or
$ npm install rrule-from-template
```

#### Usage

There are 2 builders. One builds readable rrule sets, another - short.

Both builders need 3 arguments: RRuleSet, template, count.

RRuleSet should be built and then passed to the builder. The builder will build a new RRuleSet based on the passed one.

The template is just an array of 0 and 1:
* 0 exclude date (e.g. shift off);
* 1 include date (e.g. shift on).

The count is a number of dates you want to have in built RRuleSet. For sets that have 'until' or 'count', it can be just rruleSet.count(). For unlimited sets you should pick a count by yourself. 

**ReadableRRuleSetBuilder:**
```es6
import { RRule, RRuleSet } from 'rrule'
import { ReadableRRuleSetBuilder } from 'rrule-from-template'

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

const template: Array<0|1> = [1,1,1,1,0,0]

const builder = new ReadableRRuleSetBuilder(
    rruleSet,
    template,
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

**ReadableRRuleSetBuilder:**
```es6
import { RRule, RRuleSet } from 'rrule'
import { ShortRRuleSetBuilder } from 'rrule-from-template'

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

const template: Array<0|1> = [1,1,1,1,0,0]

const builder = new ShortRRuleSetBuilder(
    rruleSet,
    template,
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

[npm-url]: https://npmjs.org/package/rrule-from-template
[npm-image]: http://img.shields.io/npm/v/rrule-from-template.svg

[ci-url]: https://github.com/kanunnykov/rrule-from-template/actions
[ci-image]: https://github.com/kanunnykov/rrule-from-template/workflows/Node.js%20CI/badge.svg

[downloads-url]: https://npmjs.org/package/rrule-from-template
[downloads-image]: http://img.shields.io/npm/dm/rrule-from-template.svg?style=flat-square
