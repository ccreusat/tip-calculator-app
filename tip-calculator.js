(function () {
	"use strict";

	const form = document.getElementById("splitter");
	const bill = document.getElementById("bill");
	const tips = document.querySelectorAll('input[name="tip"]');
	const defaultTip = document.querySelector('input[name="tip"]:checked');
	const custom = document.getElementById("tip-custom");
	const numOfPeople = document.getElementById("number-of-people");
	const amount = document.getElementById("amount");
	const total = document.getElementById("total");
	const reset = document.getElementById("reset");
	//
	let selectedTip = defaultTip.value || 0;
	let tipAmount = 0;
	let result = 0;

	reset.disabled = true;
	form.onsubmit = e => e.preventDefault();

	const tipCalculator = () => {
		const clearInput = node => {
			node.addEventListener("click", () => {
				node.value = "";
			});
		};

		const handleError = node => {
			if (node.value === "" || node.value === "0") {
				node.parentElement.classList.add("error");
			} else {
				node.parentElement.classList.remove("error");
			}
		};

		document
			.querySelectorAll('input[type="text"]')
			.forEach(item => clearInput(item));

		document
			.querySelectorAll('input[type="text"]:not(.tips__custom)')
			.forEach(item => handleError(item));

		tips.forEach(tip => {
			if (tip.checked) {
				selectedTip = tip.value;
				custom.value = "";
			}
		});

		custom.addEventListener("input", () => {
			selectedTip = custom.value;

			tips.forEach(tip => {
				tip.checked = false;
			});
		});

		let peopleValue = numOfPeople.value;
		let billValue = bill.value;

		if (
			peopleValue !== "" &&
			billValue !== "" &&
			peopleValue !== "0" &&
			billValue !== "0"
		) {
			tipAmount = parseInt((selectedTip / 100) * billValue);
			tipAmount /= parseInt(peopleValue);

			result = parseInt(billValue);
			result += parseInt((selectedTip / 100) * billValue);
			result /= parseInt(peopleValue);

			amount.textContent = tipAmount.toFixed(2);
			total.textContent = result.toFixed(2);

			reset.disabled = false;

			reset.onclick = () => {
				console.log("ok");
				console.log(bill.value);
				bill.value = "";
				numOfPeople.value = "";
				selectedTip = defaultTip.value;
				document.querySelector(
					'input[name="tip"][value="5"]'
				).checked = true;
				console.log(selectedTip);
				amount.textContent = "0.00";
				total.textContent = "0.00";
			};
		}
	};

	tipCalculator();
	form.oninput = () => tipCalculator();
})();
