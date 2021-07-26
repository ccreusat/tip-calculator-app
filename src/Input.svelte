<script>
	export let id = "bill";
  export let text = "Bill";
  export let errorMessage = "Can't be zero";
</script>

<fieldset class="fieldset">
  <div class="control">
    <label class="legend flex" for="{id}">{text}<span
      class="error-message">{errorMessage}</span></label>
    <input type="text" id="{id}" class="{id}" name="{id}" placeholder="0">
  </div>
</fieldset>

<style>
	fieldset {
	border: 0;
}

fieldset:nth-child(2) {
	margin: 40px 0;
}

label {
	cursor: pointer;
}

input[type="text"] {
	cursor: pointer;
	padding-left: 12px;
	padding-right: 12px;
	width: 100%;
	line-height: 48px;
	border: 0;
	font-family: "Space Mono", monospace;
	font-size: 24px;
	font-weight: 700;
	color: var(--dark-cyan);
	text-align: right;
	border-radius: var(--small-border-radius);
	background-color: #f3f9fa;
}

input[type="text"]:focus {
	border: 2px solid var(--light-cyan);
	outline: none;
}

input[type="text"]::placeholder {
	color: hsla(183, 100%, 15%, 35%);
}

.bill {
	background-position: 20px center;
	background-repeat: no-repeat;
}

.bill {
	background-image: url(./images/icon-dollar.svg);
}

.error-message {
	display: none !important;
	color: var(--error);
	font-size: 16px;
}

.legend {
	display: block;
	margin-bottom: 6px;
	font-size: 16px;
	font-weight: 700;
	color: var(--legend);
}

.legend span {
	display: block;
	font-size: 13px;
	color: var(--subtitle);
}
</style>