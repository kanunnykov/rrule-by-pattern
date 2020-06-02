import { RRuleSet } from 'rrule';
export declare abstract class RRuleSetBuilder {
    protected rruleSet: RRuleSet;
    protected pattern: Array<0 | 1>;
    protected count: number;
    private _limit;
    constructor(rruleSet: RRuleSet, pattern: Array<0 | 1>, count: number);
    abstract build(): RRuleSet;
    protected get limit(): number;
    protected iterator(): (date: Date, i: number) => boolean;
}
//# sourceMappingURL=rrulesetbuilder.d.ts.map