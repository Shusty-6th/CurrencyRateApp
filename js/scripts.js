"use strict";

const currencyArr = [
    'USD',
    'EUR',
    'JPY',
    'CZK',
    'PLN',
    'GBP',
    'RUB',
    'CAD'
]; // TODO: add more from https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html

const selCurrency1 = document.getElementById('currency1');
const selCurrency2 = document.getElementById('currency2');
const iCurrencyValue1 = document.getElementById('currencyValue1');
const iCurrencyValue2 = document.getElementById('currencyValue2');
const rateInfo = document.querySelector('.rate');
const btnSwitch = document.getElementById('switchCurrency');
let rates;


iCurrencyValue1.addEventListener("change", function () {
    calculateAndFillRate(iCurrencyValue1.value, rates[selCurrency2.value]);
});


fillCurrencyComboboxes();
getAndFillCurrency();
registerListeners();

function registerListeners() {
    selCurrency1.addEventListener("change", function (e) {
        fillCurrencyComboboxes();
        getAndFillCurrency();
    });

    selCurrency2.addEventListener("change", function () {
        calculateAndFillRate(iCurrencyValue1.value, rates[selCurrency2.value]);
        showSelectedRate();
    });

    btnSwitch.addEventListener("click", function () {
        let c2 = selCurrency2.value;

        var opt = document.createElement('option');
        opt.value = selCurrency1.value;
        opt.textContent = selCurrency1.value;
        selCurrency2.appendChild(opt);

        selCurrency2.value = selCurrency1.value;
        selCurrency1.value = c2;
        fillCurrencyComboboxes();
        getAndFillCurrency();
    });
}

function calculateAndFillRate(value, rate) {
    iCurrencyValue2.value = Math.round(value * rate * 100) / 100;
}

function getAndFillCurrency() {
    fetch(`https://api.ratesapi.io/api/latest?base=${selCurrency1.value}`)
        .then(response => response.json())
        .then(response => {
            rates = response.rates;
            calculateAndFillRate(iCurrencyValue1.value, rates[selCurrency2.value]);
            showSelectedRate();
        });
}

function fillCurrencyComboboxes() {
    let selected1 = selCurrency1.value;
    const selected2 = selCurrency2.value;

    selCurrency1.innerText = null;
    selCurrency2.innerText = null;

    currencyArr.forEach(curr => {
        var opt = document.createElement('option');
        opt.value = curr;
        opt.textContent = curr;
        selCurrency1.appendChild(opt);
        if (selected1 == curr) {
            selCurrency1.value = curr;
        }

        if (!selected1) {
            selected1 = selCurrency1.value;
        }

        if (selected1 != curr) {
            selCurrency2.appendChild(opt.cloneNode(true));
        }
    });

    if (selected2) {
        selCurrency2.value = selected2;
    }
}

function showSelectedRate() {
    rateInfo.textContent = `1 ${selCurrency1.value} = ${Math.round(rates[selCurrency2.value] * 10000) /10000 } ${selCurrency2.value}`;
}