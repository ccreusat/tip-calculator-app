(function () {
	"use strict";

	const form = document.getElementById("splitter");
	const bill = document.getElementById("bill");
	const tips = document.querySelectorAll('input[name="tip"]');
	const custom = document.getElementById("tip-custom");
	const numOfPeople = document.getElementById("number-of-people");
	const warning = document.getElementById("error");
	const amount = document.getElementById("amount");
	const total = document.getElementById("total");
	const reset = document.getElementById("reset");
	//
	let selectedTip = 0;
	let tipAmount = 0;
	let result = 0;

	reset.disabled = true;

	const tipCalculator = () => {
		if (Number(numOfPeople.value) === 0) {
			warning.innerHTML = "Can't be zero";
			numOfPeople.classList.add("error");
			amount.innerHTML = 0.0;
			total.innerHTML = 0.0;
		} else {
			warning.innerHTML = "";
			numOfPeople.classList.remove("error");

			if (Number(custom.value) === 0) {
				for (let tip of tips) {
					if (tip.checked) {
						selectedTip = Number(tip.value);
						break;
					}
				}
			} else {
				selectedTip = Number(custom.value);
			}

			result = Number(bill.value);
			result += Number(selectedTip / 100) * Number(bill.value);
			result /= Number(numOfPeople.value);

			tipAmount = Number(selectedTip / 100) * Number(bill.value);
			tipAmount /= Number(numOfPeople.value);

			amount.innerHTML = tipAmount.toFixed(2);
			total.innerHTML = result.toFixed(2);
			reset.disabled = false;
		}
	};

	tipCalculator();
	form.oninput = () => tipCalculator();
})();
