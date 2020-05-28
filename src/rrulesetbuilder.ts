import { getDayOfYear } from 'date-fns'
import { RRule, RRuleSet } from 'rrule'

export abstract class RRuleSetBuilder {
    protected rruleSet: RRuleSet
    protected template: Array<0|1>
    protected limit: number

    constructor(rruleSet: RRuleSet, template: Array<0|1>, limit: number) {
        this.rruleSet = rruleSet
        this.template = template
        this.limit = limit
    }

    abstract build(): RRuleSet

    protected iterator(limit: number): (date: Date, i: number) => boolean {
        return (date, i) => {return i < limit}
    }
}

export class ReadableRRuleSetBuilder extends RRuleSetBuilder {
    private builedRRuleSet: RRuleSet | undefined

    public build() {
        if (this.builedRRuleSet) {
            return this.builedRRuleSet
        }

        const rruleSet = new RRuleSet()
        const dates: Array<Date> = []

        for (let rrule of this.rruleSet.rrules()) {
            if (dates.length >= this.limit) {
                break
            }

            let iterator = this.iterator(this.limit - dates.length)

            for (let date of rrule.all(iterator)) {
                dates.push(date)
            }

            rrule.origOptions.until = dates[dates.length - 1]
            rruleSet.rrule(new RRule(rrule.origOptions))
        }

        dates.sort(function(a, b) {
            return a.getTime() - b.getTime()
        })

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
        const dates = this.rruleSet.all(this.iterator(this.limit))
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
