import { RRuleSet } from 'rrule'

export abstract class RRuleSetBuilder {
    protected rruleSet: RRuleSet
    protected pattern: Array<0|1>
    protected count: number
    private _limit: number | undefined

    constructor(rruleSet: RRuleSet, pattern: Array<0|1>, count: number) {
        this.rruleSet = rruleSet
        this.pattern = pattern
        this.count = count
    }

    abstract build(): RRuleSet

    protected get limit(): number {
        if (this._limit) {
            return this._limit
        }

        const pattern: Array<number> = this.pattern
        const countOfOneInPattern = pattern.reduce(
            (prev, curr) => {return prev + curr}
        )
        const limit = Math.floor(
            this.count * this.pattern.length / countOfOneInPattern
        )

        this._limit = limit

        return limit
    }

    protected iterator(): (date: Date, i: number) => boolean {
        return (date: Date, i:number): boolean => {return i < this.limit}
    }
}
