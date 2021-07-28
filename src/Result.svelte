<script>
  import {
    bill,
    people,
    selectedTip,
    getTotal,
    getTotalAmount
  } from "./store.js";
  import {
    createEventDispatcher
  } from 'svelte';
  const dispatch = createEventDispatcher();

  let total = "0.00";
  let amount = "0.00";

  $: if ($bill !== "" && $people !== "") {
    total = $getTotal;
  } else {
    total = "0.00";
  }

  $: if ($selectedTip && $people) {
    amount = $getTotalAmount
  } else {
    amount = "0.00";
  }

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