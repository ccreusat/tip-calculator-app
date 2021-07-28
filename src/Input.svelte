<script>
  // Variables - Props
  export let id;
  export let text;
  export let value = "";
  let error = false;

  // Store
  import {
    bill,
    people
  } from "./store";

  // Listeners
  $: if (value === "" || value === 0) {
    error = true;
  } else {
    error = false;
  }

  // Methods
  const onChange = (val) => {
    if (id === "bill") {
      if (val !== "") {
        bill.set(parseFloat(val));
      } else {
        bill.set("")
      }
    }

    if (id === "number-of-people") {
      if (val !== "") {
        people.set(parseFloat(val));
      } else {
        people.set("");
      }
    }
  }
</script>

<fieldset class="fieldset">
  <div class:error>
    <label class="legend flex" for="{id}">{text}<span class="error-message">Can't be zero</span></label>
    <input bind:value={value} on:input={onChange(value)} type="text" id="{id}" class="{id}" name="{id}" placeholder="0"
      pattern="\d*" />
  </div>
</fieldset>