<script>
  // Store
  import {
    selectedTip,
    customTip
  } from "./store";

  // Variables
  let selected = $selectedTip;
  let value = "";

  // Listeners
  $: selected = $selectedTip;

  $: if (isNaN(value)) value = "";

  // Methods
  const tips = [5, 10, 15, 25, 50];

  const onChange = () => {
    customTip.set("");
    selectedTip.set(selected);
  };

  const onCustomValue = (val) => {
    selected = val;
    customTip.set(selected);
    selectedTip.set(selected);
  }
</script>

<fieldset class="fieldset">
  <span class="legend">Select Tip %</span>
  <div class="tips">
    {#each tips as tip (tip)}
      <label for={`tips-${tip}`} class="tips__control">
        <input
          class="tips__radio"
          type="radio"
          name="tips"
          id={`tips-${tip}`}
          value={tip}
          bind:group={selected}
          on:change={onChange(selected)}>
        <span class="tips__label" >{tip} %</span>
      </label>
    {/each}
    <div class="tips__control">
      <input bind:value={$customTip} on:input={onCustomValue($customTip)} type="text" class="tips__custom" name="tip" id="tip-custom" placeholder="Custom">
    </div>
  </div>
</fieldset>