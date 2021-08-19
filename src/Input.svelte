<script>
  // Variables - Props
  export let id;
  export let text;
  export let value = "";
  let error = false;

  // Listeners
  $: if (value === "" || parseInt(value) === 0) {
    error = true;
  } else {
    error = false;
  }

  $: if (isNaN(value)) {
    value = "";
    error = true;
  } else {
    error = false;
  }


</script>

<fieldset class="fieldset">
  <div class:error>
    <label class="legend flex" for="{id}">{text}<span class="error-message">Can't be zero</span></label>
    <input bind:value type="text" id="{id}" class="{id}" name="{id}" placeholder="0"
      pattern="\d*" />
  </div>
</fieldset>