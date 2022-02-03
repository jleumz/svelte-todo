<script lang="ts">
	import Child from "./Child.svelte";
</script>

<div>
	<h2>Parent</h2>
	<Child on:message />
</div>

<style>
	div {
		border: 5px;
		border-style: dotted;
		border-color: brown;
	}
</style>
