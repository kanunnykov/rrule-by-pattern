"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rrule_1 = require("rrule");
var readablerrulesetbuilder_1 = require("../src/readablerrulesetbuilder");
var shortrrulesetbuilder_1 = require("../src/shortrrulesetbuilder");
var testCases = [];
testCases.push(function () {
    var rruleSet = new rrule_1.RRuleSet();
    rruleSet.rrule(new rrule_1.RRule({
        freq: rrule_1.RRule.DAILY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        until: new Date(Date.UTC(2026, 0, 6)),
    }));
    return {
        title: 'Limited period | requested count >= period max count',
        rruleSet: rruleSet,
        pattern: [1, 0, 1, 1, 0],
        count: 10,
        result: [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-29T06:00:00.000Z'),
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2026-01-01T06:00:00.000Z'),
            new Date('2026-01-03T06:00:00.000Z'),
            new Date('2026-01-04T06:00:00.000Z'),
        ]
    };
}());
testCases.push(function () {
    var rruleSet = new rrule_1.RRuleSet();
    rruleSet.rrule(new rrule_1.RRule({
        freq: rrule_1.RRule.DAILY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        until: new Date(Date.UTC(2026, 0, 6)),
    }));
    return {
        title: 'Limited period | requested count < period max count',
        rruleSet: rruleSet,
        pattern: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-29T06:00:00.000Z'),
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2026-01-01T06:00:00.000Z'),
            new Date('2026-01-03T06:00:00.000Z'),
        ]
    };
}());
testCases.push(function () {
    var rruleSet = new rrule_1.RRuleSet();
    rruleSet.rrule(new rrule_1.RRule({
        freq: rrule_1.RRule.HOURLY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        interval: 12
    }));
    return {
        title: 'Unlimited period',
        rruleSet: rruleSet,
        pattern: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-28T06:00:00.000Z'),
            new Date('2025-12-28T18:00:00.000Z'),
            new Date('2025-12-29T18:00:00.000Z'),
            new Date('2025-12-30T18:00:00.000Z'),
        ]
    };
}());
testCases.push(function () {
    var rruleSet = new rrule_1.RRuleSet();
    rruleSet.rrule(new rrule_1.RRule({
        freq: rrule_1.RRule.DAILY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 10)),
        until: new Date(Date.UTC(2026, 0, 6))
    }));
    rruleSet.rrule(new rrule_1.RRule({
        freq: rrule_1.RRule.HOURLY,
        dtstart: new Date(Date.UTC(2025, 11, 27, 6)),
        interval: 12
    }));
    return {
        title: 'Combined intersecting periods | limited before unlimited',
        rruleSet: rruleSet,
        pattern: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2025-12-27T06:00:00.000Z'),
            new Date('2025-12-28T06:00:00.000Z'),
            new Date('2026-01-01T10:00:00.000Z'),
            new Date('2026-01-03T10:00:00.000Z'),
            new Date('2026-01-05T10:00:00.000Z'),
        ]
    };
}());
testCases.push(function () {
    var rruleSet = new rrule_1.RRuleSet();
    rruleSet.rrule(new rrule_1.RRule({
        freq: rrule_1.RRule.HOURLY,
        dtstart: new Date(Date.UTC(2025, 11, 30, 6)),
        interval: 12
    }));
    rruleSet.rrule(new rrule_1.RRule({
        freq: rrule_1.RRule.DAILY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 10)),
        until: new Date(Date.UTC(2026, 0, 6))
    }));
    return {
        title: 'Combined intersecting periods | limited after unlimited',
        rruleSet: rruleSet,
        pattern: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2025-12-30T06:00:00.000Z'),
            new Date('2025-12-31T06:00:00.000Z'),
            new Date('2025-12-31T18:00:00.000Z'),
            new Date('2026-01-01T18:00:00.000Z'),
            new Date('2026-01-02T18:00:00.000Z'),
        ]
    };
}());
testCases.push(function () {
    var rruleSet = new rrule_1.RRuleSet();
    rruleSet.rrule(new rrule_1.RRule({
        freq: rrule_1.RRule.HOURLY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 6)),
        interval: 12
    }));
    rruleSet.exrule(new rrule_1.RRule({
        freq: rrule_1.RRule.DAILY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 18)),
        byweekday: rrule_1.RRule.SU
    }));
    return {
        title: 'Combined with exclusion rule',
        rruleSet: rruleSet,
        pattern: [1, 0, 1, 1, 0],
        count: 5,
        result: [
            new Date('2026-01-01T06:00:00.000Z'),
            new Date('2026-01-02T06:00:00.000Z'),
            new Date('2026-01-02T18:00:00.000Z'),
            new Date('2026-01-03T18:00:00.000Z'),
            new Date('2026-01-05T06:00:00.000Z'),
        ]
    };
}());
describe('ReadableRRuleSetBuilder', function () {
    it('Cache', function () {
        var builder = new readablerrulesetbuilder_1.ReadableRRuleSetBuilder(new rrule_1.RRuleSet(), [], 0);
        chai_1.expect(builder.build()).to.equal(builder.build());
    });
    var _loop_1 = function (testCase) {
        it(testCase.title, function () {
            var builder = new readablerrulesetbuilder_1.ReadableRRuleSetBuilder(testCase.rruleSet, testCase.pattern, testCase.count);
            var rruleSet = builder.build();
            chai_1.expect(rruleSet.all(function (date, i) { return i < testCase.count; })).to.eql(testCase.result);
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var testCase = testCases_1[_i];
        _loop_1(testCase);
    }
});
describe('ShortRRuleSetBuilder', function () {
    it('Cache', function () {
        var builder = new shortrrulesetbuilder_1.ShortRRuleSetBuilder(new rrule_1.RRuleSet(), [], 0);
        chai_1.expect(builder.build()).to.equal(builder.build());
    });
    var _loop_2 = function (testCase) {
        it(testCase.title, function () {
            var builder = new shortrrulesetbuilder_1.ShortRRuleSetBuilder(testCase.rruleSet, testCase.pattern, testCase.count);
            var rruleSet = builder.build();
            chai_1.expect(rruleSet.all()).to.eql(testCase.result);
        });
    };
    for (var _i = 0, testCases_2 = testCases; _i < testCases_2.length; _i++) {
        var testCase = testCases_2[_i];
        _loop_2(testCase);
    }
});
//# sourceMappingURL=rrulesetbuilder.test.js.map