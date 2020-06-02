"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortRRuleSetBuilder = void 0;
var date_fns_1 = require("date-fns");
var rrule_1 = require("rrule");
var rrulesetbuilder_1 = require("./rrulesetbuilder");
var ShortRRuleSetBuilder = /** @class */ (function (_super) {
    __extends(ShortRRuleSetBuilder, _super);
    function ShortRRuleSetBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShortRRuleSetBuilder.prototype.build = function () {
        if (this.builedRRuleSet) {
            return this.builedRRuleSet;
        }
        var rruleSet = new rrule_1.RRuleSet();
        var dates = this.rruleSet.all(this.iterator());
        var dayIndexesByYearAndTime = {};
        for (var i in dates) {
            if (!this.pattern[Number(i) % this.pattern.length]) {
                continue;
            }
            var yearAndTime = dates[i].getUTCFullYear()
                + '&' + dates[i].getUTCHours()
                + '&' + dates[i].getUTCMinutes()
                + '&' + dates[i].getUTCSeconds();
            if (!(yearAndTime in dayIndexesByYearAndTime)) {
                dayIndexesByYearAndTime[yearAndTime] = [];
            }
            dayIndexesByYearAndTime[yearAndTime].push(date_fns_1.getDayOfYear(dates[i]));
        }
        for (var yearAndTime in dayIndexesByYearAndTime) {
            var _a = yearAndTime.split('&'), year = _a[0], hours = _a[1], minutes = _a[2], seconds = _a[3];
            rruleSet.rrule(new rrule_1.RRule({
                freq: rrule_1.RRule.YEARLY,
                dtstart: new Date(Date.UTC(Number(year), 0, 1, Number(hours), Number(minutes), Number(seconds))),
                until: new Date(Date.UTC(Number(year), 11, 31, 23, 59, 59, 999)),
                byweekday: [
                    rrule_1.RRule.MO,
                    rrule_1.RRule.TU,
                    rrule_1.RRule.WE,
                    rrule_1.RRule.TH,
                    rrule_1.RRule.FR,
                    rrule_1.RRule.SA,
                    rrule_1.RRule.SU
                ],
                bysetpos: dayIndexesByYearAndTime[yearAndTime],
            }));
        }
        this.builedRRuleSet = rruleSet;
        return rruleSet;
    };
    return ShortRRuleSetBuilder;
}(rrulesetbuilder_1.RRuleSetBuilder));
exports.ShortRRuleSetBuilder = ShortRRuleSetBuilder;
//# sourceMappingURL=shortrrulesetbuilder.js.map