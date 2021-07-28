// store.js
import { writable, derived } from "svelte/store";

// Basic
export const bill = writable("");
export const people = writable("");
export const selectedTip = writable(5);

// Derived Store
export const getTotal = derived(
	[bill, people, selectedTip],
	([$bill, $people, $selectedTip]) =>
		parseFloat(($bill + $bill * ($selectedTip / 100)) / $people).toFixed(2)
);
export const getTotalAmount = derived(
	[bill, people, selectedTip],
	([$bill, $people, $selectedTip]) =>
		parseFloat(($bill * ($selectedTip / 100)) / $people).toFixed(2)
);
