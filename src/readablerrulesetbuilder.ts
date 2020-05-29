import { RRuleSet } from 'rrule'
import { RRuleSetBuilder } from './rrulesetbuilder'

export class ReadableRRuleSetBuilder extends RRuleSetBuilder {
    private builedRRuleSet: RRuleSet | undefined

    public build() {
        if (this.builedRRuleSet) {
            return this.builedRRuleSet
        }

        const rruleSet = this.rruleSet.clone()
        const dates = rruleSet.all(this.iterator())

        for (let i in dates) {
            if (this.template[Number(i) % this.template.length]) {
                continue
            }
            
            rruleSet.exdate(dates[i])
        }

        this.builedRRuleSet = rruleSet

        return rruleSet
    }
}
