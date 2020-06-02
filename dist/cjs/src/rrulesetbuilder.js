"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RRuleSetBuilder = void 0;
var RRuleSetBuilder = /** @class */ (function () {
    function RRuleSetBuilder(rruleSet, pattern, count) {
        this.rruleSet = rruleSet;
        this.pattern = pattern;
        this.count = count;
    }
    Object.defineProperty(RRuleSetBuilder.prototype, "limit", {
        get: function () {
            if (this._limit) {
                return this._limit;
            }
            var pattern = this.pattern;
            var countOfOneInPattern = pattern.reduce(function (prev, curr) { return prev + curr; });
            var limit = Math.floor(this.count * this.pattern.length / countOfOneInPattern);
            this._limit = limit;
            return limit;
        },
        enumerable: false,
        configurable: true
    });
    RRuleSetBuilder.prototype.iterator = function () {
        var _this = this;
        return function (date, i) { return i < _this.limit; };
    };
    return RRuleSetBuilder;
}());
exports.RRuleSetBuilder = RRuleSetBuilder;
//# sourceMappingURL=rrulesetbuilder.js.map