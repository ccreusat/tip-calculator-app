<script>
  // Components
  import Logo from './Logo.svelte';
  import Input from './Input.svelte';
  import Tips from "./Tips.svelte";
  import Result from "./Result.svelte";

  // Store
  import {
    bill,
    numberOfPeople,
    selectedTip,
    customTip
  } from "./store.js";

  // Methods
  const handleOnSubmit = (e) => e.preventDefault();

  const handleResetForm = () => {
    bill.set("");
    numberOfPeople.set("");
    selectedTip.set(25);
    customTip.set("");
  }
</script>

<main>
  <Logo />

  <form on:submit={handleOnSubmit} autocomplete="off" class="splitter__container">
    <div class="splitter__calculator">
      <Input bind:value={$bill} on:input={$bill} id={"bill"} text={"Bill"} />
      <Tips />
      <Input bind:value={$numberOfPeople} on:input={$numberOfPeople} id={"numberOfPeople"} text={"Number of people"} />
    </div>
    <Result on:reset={handleResetForm} />
  </form>
</main>