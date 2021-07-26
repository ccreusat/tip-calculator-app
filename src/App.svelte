<script>
  import Logo from './Logo.svelte';
  import Input from './Input.svelte';

  let bill = "bill";
  let billText = "Bill";
  let numOfPeople = "number-of-people";
  let numOfPeopleText = "Number of people";
</script>

<main>
	<Logo />

  <div class="splitter__container">
    <div class="splitter__calculator">
      <Input id={bill} text={billText} />
      <Input id={numOfPeople} text={numOfPeopleText} />
    </div>
  </div>
</main>

<style>
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --body: hsl(185, 41%, 84%);
    --dark-cyan: hsl(183, 100%, 15%);
    --light-cyan: hsl(172, 67%, 45%);
    --white: hsl(0, 0%, 100%);
    --error: hsl(13, 70%, 61%);

    --small-border-radius: 5px;
    --medium-border-radius: 15px;
    --large-border-radius: 25px;

    --legend: hsl(186, 14%, 43%);
    --subtitle: hsl(184, 14%, 56%);
  }

  :global(html),
  :global(body) {
    height: 100vh;
  }

  :global(body) {
    font-family: "Space Mono", monospace;
    font-size: 24px;
    display: flex;
    place-content: center;
    place-items: center;
    background-color: var(--body);
  }
  .splitter__container {
    display: flex;
    justify-content: space-between;
    width: 920px;
    border-radius: var(--large-border-radius);
    background-color: var(--white);
  }

  .splitter__container > div {
    flex-basis: 0;
    flex: 1;
  }

  .splitter__calculator {
    margin: 48px;
    min-width: 380px;
    max-width: 380px;
  }
</style>