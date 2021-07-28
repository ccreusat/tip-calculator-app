<script>
  // Components
  import Logo from './Logo.svelte';
  import Input from './Input.svelte';
  import Tips from "./Tips.svelte";
  import Result from "./Result.svelte";

  // Variables

  // Store
  import {
    bill,
    people,
    selectedTip
  } from "./store.js";

  // Methods
  const handleOnSubmit = (e) => e.preventDefault();

  const handleResetForm = () => {
    bill.set(0);
    people.set(0);
    selectedTip.set(5);
  }
</script>

<main>
  <Logo />

  <form on:submit={handleOnSubmit} autocomplete="off" class="splitter__container">
    <div class="splitter__calculator">
      <Input id={"bill"} text={"Bill"} value={$bill} />
      <Tips />
      <Input id={"number-of-people"} text={"Number of people"} value={$people} />
    </div>
    <!-- <Result /> -->
    <Result on:reset={handleResetForm} />
  </form>
</main>