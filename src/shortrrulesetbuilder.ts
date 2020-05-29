import { getDayOfYear } from 'date-fns'
import { RRule, RRuleSet } from 'rrule'
import { RRuleSetBuilder } from './rrulesetbuilder'

interface Dictionary<T> {
    [key: string]: T
}

export class ShortRRuleSetBuilder extends RRuleSetBuilder {
    private builedRRuleSet: RRuleSet | undefined

    public build() {
        if (this.builedRRuleSet) {
            return this.builedRRuleSet
        }

        const rruleSet = new RRuleSet()
        const dates = this.rruleSet.all(this.iterator())
        const dayIndexesByYearAndTime: Dictionary<Array<number>> = {}

        for (let i in dates) {
            if (!this.template[Number(i) % this.template.length]) {
                continue
            }

            let yearAndTime = dates[i].getUTCFullYear()
                + '&' + dates[i].getUTCHours()
                + '&' + dates[i].getUTCMinutes()
                + '&' + dates[i].getUTCSeconds()

            if (!(yearAndTime in dayIndexesByYearAndTime)) {
                dayIndexesByYearAndTime[yearAndTime] = []
            }

            dayIndexesByYearAndTime[yearAndTime].push(getDayOfYear(dates[i]))
        }

        for (let yearAndTime in dayIndexesByYearAndTime) {
            let [year, hours, minutes, seconds] = yearAndTime.split('&')
            rruleSet.rrule(new RRule({
                freq: RRule.YEARLY,
                dtstart: new Date(
                    Date.UTC(
                        Number(year),
                        0,
                        1,
                        Number(hours),
                        Number(minutes),
                        Number(seconds))
                ),
                until: new Date(
                    Date.UTC(Number(year), 11, 31, 23, 59, 59, 999)
                ),
                byweekday: [
                    RRule.MO,
                    RRule.TU,
                    RRule.WE,
                    RRule.TH,
                    RRule.FR,
                    RRule.SA,
                    RRule.SU
                ],
                bysetpos: dayIndexesByYearAndTime[yearAndTime],
            }))
        }

        this.builedRRuleSet = rruleSet

        return rruleSet
    }
}
