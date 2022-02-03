<script lang="ts">
	import Parent from "./Parent.svelte";

	const handleMessage = (event) => {
		alert(event.detail.text);
	};
</script>

<div>
	<h2>GrandParent</h2>
	<Parent on:message={handleMessage} />
</div>

<style>
	div {
		border: solid;
		border-style: groove;
		border-color: aqua;
	}
</style>
