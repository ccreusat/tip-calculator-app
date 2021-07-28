<script>
  // Store
  import {
    bill,
    people,
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
			$people !== "" &&
			$bill !== "" &&
			$people !== 0 &&
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
      <label for="amount" class="legend">Tip Amount
        <span>/ person</span></label>
      <strong class="price">
        $<span id="amount">{amount}</span>
      </strong>
    </div>

    <div class="control flex">
      <label for="total" class="legend">Total
        <span>/ person</span></label>
      <strong class="price">$<span id="total">{total}</span></strong>
    </div>
  </div>

  <button id="reset" on:click={reset}>Reset</button>
</div>