import { expect } from 'chai'
import { RRule, RRuleSet } from 'rrule'
import {
    ReadableRRuleSetBuilder,
    ShortRRuleSetBuilder
} from '../src/rrulesetbuilder'

class TestCase {
    title: string
    rruleSet: RRuleSet
    template: Array<0|1>
    limit: number
    result: Array<Date>

    constructor(
        title: string,
        rruleSet: RRuleSet,
        template: Array<0|1>,
        limit: number,
        result: Array<Date>
    ) {
        this.title = title
        this.rruleSet = rruleSet
        this.template = template
        this.limit = limit
        this.result = result
    }
}

const testCases: Array<TestCase> = []

testCases.push(function() {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        until: new Date(Date.UTC(2026, 0, 6)),
    }))

    return new TestCase(
        'Limited period | period length = builder limit',
        rruleSet,
        [1, 0, 0],
        rruleSet.count(),
        [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2026-01-02T06:00:00.000Z'),
            new Date('2026-01-05T06:00:00.000Z'),
        ]
    )
}())

testCases.push(function() {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        until: new Date(Date.UTC(2026, 0, 6)),
    }))

    return new TestCase(
        'Limited period | period length < builder limit',
        rruleSet,
        [1, 0, 0],
        rruleSet.count() + 1,
        [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2026-01-02T06:00:00.000Z'),
            new Date('2026-01-05T06:00:00.000Z'),
        ]
    )    
}())

testCases.push(function() {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        until: new Date(Date.UTC(2026, 0, 6)),
    }))

    return new TestCase(
        'Limited period | period length > builder limit',
        rruleSet,
        [1, 0, 0],
        Math.floor(rruleSet.count() / 2),
        [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-30T06:00:00.000Z'),
        ]
    )    
}())

testCases.push(function() {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        interval: 12
    }))

    return new TestCase(
        'Unlimited period',
        rruleSet,
        [1, 0, 0],
        10,
        [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-28T18:00:00.000Z'),
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2025-12-31T18:00:00.000Z'),
        ]
    )    
}())

testCases.push(function() {
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

    return new TestCase(
        'Combined intersecting periods | limited before unlimited',
        rruleSet,
        [1, 0, 0],
        10,
        [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-28T18:00:00.000Z'),
            new Date('2026-01-02T10:00:00.000Z'),
            new Date('2026-01-05T10:00:00.000Z'),
        ]
    )    
}())

testCases.push(function() {
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

    return new TestCase(
        'Combined intersecting periods | limited after unlimited',
        rruleSet,
        [1, 0, 0],
        10,
        [
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2025-12-31T18:00:00.000Z'),
            new Date('2026-01-02T06:00:00.000Z'),
            new Date('2026-01-03T18:00:00.000Z'),
        ]
    )    
}())

testCases.push(function() {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2025, 10, 1, 10)),
        until: new Date(Date.UTC(2025, 10, 11))
    }))

    rruleSet.rrule(new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        interval: 12
    }))

    return new TestCase(
        'Combined not intersecting periods',
        rruleSet,
        [1, 0, 0],
        10,
        [
            new Date('2025-11-01T10:00:00.000Z'),
            new Date('2025-11-04T10:00:00.000Z'),
            new Date('2025-11-07T10:00:00.000Z'),
            new Date('2025-11-10T10:00:00.000Z'),
        ]
    )    
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
                testCase.limit
            )
            const rruleSet = builder.build()

            expect(rruleSet.all()).to.eql(testCase.result)
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
                testCase.limit
            )
            const rruleSet = builder.build()

            expect(rruleSet.all()).to.eql(testCase.result)
        })
    }
})
