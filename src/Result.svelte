<script>
  // Store
  import {
    bill,
    numberOfPeople,
    getTotal,
    getTotalAmount
  } from "./store.js";

  // Dispatcher
  import {
    createEventDispatcher
  } from 'svelte';

  const dispatch = createEventDispatcher();

  // Variables
  let total = "0.00";
  let amount = "0.00";

  // Listeners
  $: if (
			$numberOfPeople !== "" &&
			$bill !== "" &&
			$numberOfPeople !== 0 &&
			$bill !== 0
		) {
      total = $getTotal;
      amount = $getTotalAmount;
    } else {
      total = "0.00";
      amount = "0.00";
    }

  // Methods
  const reset = () => dispatch('reset');
</script>

<div class="splitter__result">
  <div>
    <div class="control flex">
      <span class="legend">Tip Amount
        <span>/ person</span></span>
      <strong class="price">
        $<span id="amount">{amount}</span>
      </strong>
    </div>

    <div class="control flex">
      <span class="legend">Total
        <span>/ person</span></span>
      <strong class="price">$<span id="total">{total}</span></strong>
    </div>
  </div>

  <button id="reset" on:click={reset}>Reset</button>
</div>