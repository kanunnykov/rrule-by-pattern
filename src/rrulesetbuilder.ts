import { RRuleSet } from 'rrule'

export abstract class RRuleSetBuilder {
    protected rruleSet: RRuleSet
    protected template: Array<0|1>
    protected count: number
    private _limit: number | undefined

    constructor(rruleSet: RRuleSet, template: Array<0|1>, count: number) {
        this.rruleSet = rruleSet
        this.template = template
        this.count = count
    }

    abstract build(): RRuleSet

    protected get limit(): number {
        if (this._limit) {
            return this._limit
        }

        const template: Array<number> = this.template
        const countOfOneInTemplate = template.reduce(
            (prev, curr) => {return prev + curr}
        )
        const limit = Math.floor(
            this.count * this.template.length / countOfOneInTemplate
        )

        this._limit = limit

        return limit
    }

    protected iterator(): (date: Date, i: number) => boolean {
        return (date: Date, i:number): boolean => {return i < this.limit}
    }
}
