let invoices = '[{"customer": "MDT", "performance": [{"playId": "Гамлет", "audience": 55, "type": "tragedy"},{"playId": "Ромео и Джульетта", "audience": 35, "type": "tragedy"},{"playId": "Отелло", "audience": 40, "type": "comedy"}]}]';
let showResult=statement(invoices);
console.log(showResult);

function statement(invoices) {
    const tragedyType = "tragedy";
    const comedyType = "comedy";
    const maxQuantityOfAudienceForComedy = 20;
    const maxQuantityOfAudienceForTragedy = 30;
    let result = "";
    let parsedInvoices = parseIncomingJsonFile(invoices);
    parsedInvoices.forEach(function (invoice) {
        let calculatedFeeToPay = 0;
        for (let performance of invoice.performance) {
            let playId = performance.playId;
            let playType = performance.type;
            calculatedFeeToPay = 0;
            switch (playType) {
                case tragedyType:
                    calculatedFeeToPay = 40000;
                    if (performance.audience > maxQuantityOfAudienceForTragedy) {
                        calculatedFeeToPay += 1000 * (performance.audience - maxQuantityOfAudienceForTragedy);
                    }
                    break;
                case comedyType:
                    calculatedFeeToPay = 30000;
                    if (performance.audience > maxQuantityOfAudienceForComedy) {
                        calculatedFeeToPay += 1000 + 500 * (performance.audience - maxQuantityOfAudienceForComedy);
                    }
                    break;
                default:
                    throw new Error(`Неизвестный тип: ${playType}`)
            }
            let bonus = generalBonusCalculation(performance.audience);
            bonus += comedyBonusCalculation(bonus, performance.audience);
            result += resultForCustomerExpenses(playId, calculatedFeeToPay, performance.audience);
            result += resultCustomerFee(calculatedFeeToPay);
            result += resultForCustomerBonuses(bonus);
        }
    });
    return result;
}

function parseIncomingJsonFile(file) {
    return JSON.parse(file)
}

function generalBonusCalculation(audience) {
    return Math.max(audience - 30, 0);

}

function comedyBonusCalculation(currentBonus, audience) {
    return currentBonus + Math.floor(audience / 10)

}

function resultForCustomerExpenses(playName, feeToPay, audienceForPlay) {
    return `${playName}: ${formatCurrencyAmount(feeToPay)} (${audienceForPlay} мест)\n`;
}

function formatCurrencyAmount(amount) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2
    }).format(amount);
}


function resultCustomerFee(feeToPay) {
    return `Итого с Вас ${formatCurrencyAmount(feeToPay)}\n`;

}

function resultForCustomerBonuses(profitFromPlaysInBonuses) {
    return `Вы заработали ${profitFromPlaysInBonuses} бонусов\n`;
}
