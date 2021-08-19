<script>
  // Variables
	export let src = './images/logo.svg';
	export let name = 'Splitter';
</script>

<h1 class="logo">
  <a href="/" aria-label="Splitter Logo"><img src={src} alt={name}></a>
</h1>

<style>
	.logo {
    margin: 50px auto;
    text-align: center;
  }

  @media only screen and (min-width: 940px) {
	.logo {
    margin-top: 0;
		margin-bottom: 80px;
	}
}
</style>