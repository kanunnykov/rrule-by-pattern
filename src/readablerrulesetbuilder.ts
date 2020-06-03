import { RRuleSet } from 'rrule'
import { RRuleSetBuilder } from './rrulesetbuilder'

export class ReadableRRuleSetBuilder extends RRuleSetBuilder {
    private builedRRuleSet: RRuleSet | undefined

    public build(): RRuleSet {
        if (this.builedRRuleSet) {
            return this.builedRRuleSet
        }

        const rruleSet = this.rruleSet.clone()
        const dates = rruleSet.all(this.iterator())

        for (const i in dates) {
            if (this.pattern[Number(i) % this.pattern.length]) {
                continue
            }
            
            rruleSet.exdate(dates[i])
        }

        this.builedRRuleSet = rruleSet

        return rruleSet
    }
}
