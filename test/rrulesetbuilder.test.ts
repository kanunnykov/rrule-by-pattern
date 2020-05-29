import { expect } from 'chai'
import { RRule, RRuleSet } from 'rrule'
import {
    ReadableRRuleSetBuilder,
    ShortRRuleSetBuilder
} from '../src/rrulesetbuilder'

interface TestCase {
    title: string
    rruleSet: RRuleSet
    template: Array<0|1>
    count: number
    result: Array<Date>
}

const testCases: Array<TestCase> = []

testCases.push(function(): TestCase {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        until: new Date(Date.UTC(2026, 0, 6)),
    }))

    return {
        title: 'Limited period | requested count >= period max count',
        rruleSet: rruleSet,
        template: [1, 0, 1, 1, 0],
        count: 10,
        result: [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-29T06:00:00.000Z'),
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2026-01-01T06:00:00.000Z'),
            new Date('2026-01-03T06:00:00.000Z'),
            new Date('2026-01-04T06:00:00.000Z'),
        ]
    }
}())

testCases.push(function(): TestCase {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        until: new Date(Date.UTC(2026, 0, 6)),
    }))

    return {
        title: 'Limited period | requested count < period max count',
        rruleSet: rruleSet,
        template: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-29T06:00:00.000Z'),
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2026-01-01T06:00:00.000Z'),
            new Date('2026-01-03T06:00:00.000Z'),
        ]
    }
}())

testCases.push(function(): TestCase {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        interval: 12
    }))

    return {
        title: 'Unlimited period',
        rruleSet: rruleSet,
        template: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-28T06:00:00.000Z'),
            new Date('2025-12-28T18:00:00.000Z'),
            new Date('2025-12-29T18:00:00.000Z'),
            new Date('2025-12-30T18:00:00.000Z'),
        ]
    }
}())

testCases.push(function(): TestCase {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 10)),
        until: new Date(Date.UTC(2026, 0, 6))
    }))

    rruleSet.rrule(new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        interval: 12
    }))

    return {
        title: 'Combined intersecting periods | limited before unlimited',
        rruleSet: rruleSet,
        template: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-28T06:00:00.000Z'),
            new Date('2026-01-01T10:00:00.000Z'),
            new Date('2026-01-03T10:00:00.000Z'),
            new Date('2026-01-05T10:00:00.000Z'),
        ]
    }
}())

testCases.push(function(): TestCase {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2025, 11, 30, 6)),
        interval: 12
    }))

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 10)),
        until: new Date(Date.UTC(2026, 0, 6))
    }))

    return {
        title: 'Combined intersecting periods | limited after unlimited',
        rruleSet: rruleSet,
        template: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2025-12-31T06:00:00.000Z'),
            new Date('2025-12-31T18:00:00.000Z'),
            new Date('2026-01-01T18:00:00.000Z'),
            new Date('2026-01-02T18:00:00.000Z'),
        ]
    }
}())

testCases.push(function(): TestCase {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 6)),
        interval: 12
    }))

    rruleSet.exrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 18)),
        byweekday: RRule.SU
    }))

    return {
        title: 'Combined with exclusion rule',
        rruleSet: rruleSet,
        template: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2026-01-01T06:00:00.000Z'),
            new Date('2026-01-02T06:00:00.000Z'),
            new Date('2026-01-02T18:00:00.000Z'),
            new Date('2026-01-03T18:00:00.000Z'),
            new Date('2026-01-05T06:00:00.000Z'),
        ]
    }
}())

describe('ReadableRRuleSetBuilder', function() {
    it('Cache', function() {
        const builder = new ReadableRRuleSetBuilder(new RRuleSet(), [], 0)
        expect(builder.build()).to.equal(builder.build())
    })    

    for (let testCase of testCases) {
        it(testCase.title, function() {
            const builder = new ReadableRRuleSetBuilder(
                testCase.rruleSet,
                testCase.template,
                testCase.count
            )
            const rruleSet = builder.build()

            expect(
                rruleSet.all((date, i) => {return i < testCase.count})
            ).to.eql(testCase.result)
        })
    }
})

describe('ShortRRuleSetBuilder', function() {
    it('Cache', function() {
        const builder = new ShortRRuleSetBuilder(new RRuleSet(), [], 0)
        expect(builder.build()).to.equal(builder.build())
    })    

    for (let testCase of testCases) {
        it(testCase.title, function() {
            const builder = new ShortRRuleSetBuilder(
                testCase.rruleSet,
                testCase.template,
                testCase.count
            )
            const rruleSet = builder.build()

            expect(rruleSet.all()).to.eql(testCase.result)
        })
    }
})
