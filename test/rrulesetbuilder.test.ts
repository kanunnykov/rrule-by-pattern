import { expect } from 'chai'
import { RRule, RRuleSet } from 'rrule'
import { ReadableRRuleSetBuilder, ShortRRuleSetBuilder } from '../src/rrulesetbuilder'

class TestCase {
    title: string
    rruleSet: RRuleSet
    template: Array<0|1>
    limit: number
    result: Array<Date>

    constructor(title: string, rruleSet: RRuleSet, template: Array<0|1>, limit: number, result: Array<Date>) {
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

describe('ReadableRRuleSetBuilder', function() {
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
