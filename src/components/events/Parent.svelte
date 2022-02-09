<script lang="ts">
	import CustomButton from "../CustomButton.svelte";
	import Child from "./Child.svelte";
	export let parentValue;

	const increase = () => {
		parentValue += 1;
	};
</script>

<div>
	<h2>Parent</h2>
	<CustomButton on:click={increase} />
	<Child on:message />
</div>

<style>
	div {
		border: 5px;
		border-style: dotted;
		border-color: brown;
	}
</style>
