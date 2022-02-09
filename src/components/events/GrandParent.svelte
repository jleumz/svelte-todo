<script lang="ts">
	import Parent from "./Parent.svelte";

	let value = 0;
	const handleMessage = (event) => {
		alert(event.detail.text);
	};
</script>

<div>
	<h2>GrandParent</h2>
	<div>Value updated by Parent: {value}</div>
	<Parent on:message={handleMessage} bind:parentValue={value} />
</div>

<style>
	div {
		border: solid;
		border-style: groove;
		border-color: aqua;
	}
</style>
