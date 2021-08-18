// store.js
import { writable, derived } from "svelte/store";

// Basic
export const bill = writable("");
export const numberOfPeople = writable("");
export const selectedTip = writable(5);
export const customTip = writable("");

// Derived Store
export const getTotal = derived(
	[bill, numberOfPeople, selectedTip],
	([$bill, $numberOfPeople, $selectedTip]) =>
		parseFloat(
			$bill / $numberOfPeople + $bill * ($selectedTip / 100)
		).toFixed(2)
);
export const getTotalAmount = derived(
	[bill, numberOfPeople, selectedTip],
	([$bill, $numberOfPeople, $selectedTip]) =>
		parseFloat(($bill * ($selectedTip / 100)) / $numberOfPeople).toFixed(2)
);
