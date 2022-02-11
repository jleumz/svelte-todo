<script lang="ts">
	let width;
	let height;
	let size: number = 42;
	let text = "Edit me";
</script>

<h2>Use Directives</h2>
<a href="https://svelte.dev/docs#use_action" target="_blank"
	>Link to directives</a
>

<section>
	<input type="range" bind:value={size} />
	<input type="text" bind:value={text} />
	<p>size: {width}px x {height}px</p>

	<div bind:clientHeight={height} bind:clientWidth={width}>
		<span style="font-size: {size}px">{text}</span>
	</div>
</section>

<style>
	input[type="text"]:focus {
		box-shadow: 0 0 0 2px rgba(224, 124, 9, 0.3);
		outline: 0px;
	}
</style>
