import { RRule, RRuleSet } from 'rrule'
import { ReadableRRuleSetBuilder } from '../src/readablerrulesetbuilder'

window.addEventListener('load', function() {
    const patternForm = document.getElementById('patternform')

    if (!patternForm) {
        throw new Error('There is no \'patternform\' element in DOM')
    }

    patternForm.addEventListener('submit', function(event) {
        event.preventDefault()

        const regex = new RegExp('^[01](,\\s*[01])*$')
        const pattern = document.getElementById('pattern') as HTMLInputElement

        if (!regex.test(pattern.value)) {
            const message = 'Incorrect pattern'
            alert(message)
            throw new Error(message)
        }

        build(
            pattern.value.split(',').map(function(char) {
                return Number(char) as 0 | 1
            })
        )
    })
})

function build(pattern: Array<0|1>) {
    const rruleSet = new RRuleSet()

    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 6)),
        until: new Date(Date.UTC(2026, 0, 30, 6)),
    }))
    
    const builder = new ReadableRRuleSetBuilder(
        rruleSet,
        pattern,
        rruleSet.count()
    )

    const newRRuleSet = builder.build()
    const resultList = document.getElementById('resultlist')    
    const resultMessage = document.getElementById('resultmessage')    

    if (!resultList) {
        throw new Error('There is no \'resultlist\' element in DOM')
    }

    if (!resultMessage) {
        throw new Error('There is no \'resultmessage\' element in DOM')
    }

    const dates = newRRuleSet.all()

    console.log(dates)

    resultList.innerHTML = ''
    resultMessage.innerHTML = dates.length ? '' : 'Empty'

    for (const date of dates) {
        const item = document.createElement('li')
        item.innerHTML = date.toString()
        resultList.appendChild(item)
    }
}
