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
exports.ReadableRRuleSetBuilder = void 0;
var rrulesetbuilder_1 = require("./rrulesetbuilder");
var ReadableRRuleSetBuilder = /** @class */ (function (_super) {
    __extends(ReadableRRuleSetBuilder, _super);
    function ReadableRRuleSetBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReadableRRuleSetBuilder.prototype.build = function () {
        if (this.builedRRuleSet) {
            return this.builedRRuleSet;
        }
        var rruleSet = this.rruleSet.clone();
        var dates = rruleSet.all(this.iterator());
        for (var i in dates) {
            if (this.pattern[Number(i) % this.pattern.length]) {
                continue;
            }
            rruleSet.exdate(dates[i]);
        }
        this.builedRRuleSet = rruleSet;
        return rruleSet;
    };
    return ReadableRRuleSetBuilder;
}(rrulesetbuilder_1.RRuleSetBuilder));
exports.ReadableRRuleSetBuilder = ReadableRRuleSetBuilder;
//# sourceMappingURL=readablerrulesetbuilder.js.map