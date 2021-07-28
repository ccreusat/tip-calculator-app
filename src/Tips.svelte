<script>
  import {
    selectedTip
  } from "./store";

  let selected = 5;
  let value = "";
  const tips = [5, 10, 15, 25, 50];
  const onChange = () => {
    value = "";
    selectedTip.set(parseInt(selected));
  };
  const onCustomValue = (val) => {
    selected = val;
    selectedTip.set(parseInt(selected));
  }
</script>

<fieldset class="fieldset">
  <label for="tips" class="legend">Select Tip %</label>
  <div class="tips">
    {#each tips as tip (tip)}
      <div class="tips__control">
        <input
          class="tips__radio"
          type="radio"
          name="tips"
          value={tip}
          bind:group={selected}
          on:change={onChange(selected)}>
        <label class="tips__label" for="tip-{tip}">{tip} %</label>
      </div>
    {/each}
    <div class="tips__control">
      <input bind:value={value} on:input={onCustomValue(value)} type="text" class="tips__custom" name="tip" id="tip-custom" placeholder="Custom">
    </div>
  </div>
</fieldset>