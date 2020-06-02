import { RRule, RRuleSet } from 'rrule';
import { ReadableRRuleSetBuilder } from '../src/readablerrulesetbuilder';
window.addEventListener('load', function () {
    var patternForm = document.getElementById('patternform');
    if (!patternForm) {
        throw new Error('There is no \'patternform\' element in DOM');
    }
    patternForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var regex = new RegExp('^[01](,\\s*[01])*$');
        var pattern = document.getElementById('pattern');
        if (!regex.test(pattern.value)) {
            var message = 'Incorrect pattern';
            alert(message);
            throw new Error(message);
        }
        build(pattern.value.split(',').map(function (char) {
            return Number(char);
        }));
    });
});
function build(pattern) {
    var rruleSet = new RRuleSet();
    rruleSet.rrule(new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(Date.UTC(2026, 0, 1, 6)),
        until: new Date(Date.UTC(2026, 0, 30, 6)),
    }));
    var builder = new ReadableRRuleSetBuilder(rruleSet, pattern, rruleSet.count());
    var newRRuleSet = builder.build();
    var resultList = document.getElementById('resultlist');
    var resultMessage = document.getElementById('resultmessage');
    if (!resultList) {
        throw new Error('There is no \'resultlist\' element in DOM');
    }
    if (!resultMessage) {
        throw new Error('There is no \'resultmessage\' element in DOM');
    }
    var dates = newRRuleSet.all();
    console.log(dates);
    resultList.innerHTML = '';
    resultMessage.innerHTML = dates.length ? '' : 'Empty';
    for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
        var date = dates_1[_i];
        var item = document.createElement('li');
        item.innerHTML = date.toString();
        resultList.appendChild(item);
    }
}
//# sourceMappingURL=demo.js.map