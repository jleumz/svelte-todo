<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	const sayHello = () => {
		dispatch("message", {
			text: "Hello World!",
		});
	};
</script>

<div>
	<h2>Child</h2>
	<button on:click={sayHello}>Send Message</button>
</div>

<style>
	div {
		border: 5px;
		border-style: solid;
		border-color: black;
	}
</style>
