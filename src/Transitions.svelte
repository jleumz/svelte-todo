<script lang="ts">
	import { fade, slide, fly } from "svelte/transition";
	import TodoDeferTransition from "./components/Todo/TodoDeferTransition.svelte";

	let showFade = false;
	let showList = true;
	let i = 3;
	let elements = ["Svelte", "React", "Vue", "Angular", "Inferno", "VanillaJS"];
	let showFly = false;
	let status = "...waiting";
	let blockNumber = 0;
</script>

<h2>How to use svelte transitions</h2>
<label>
	<input type="checkbox" bind:checked={showFade} />
	Show fade
</label>
{#if showFade}
	<p transition:fade>Fades in and out</p>
{/if}

<label>
	<input type="checkbox" bind:checked={showList} />
	Show list
</label>
<label>
	<input type="range" bind:value={i} max={elements.length} />
</label>

<!-- local prevents to play the transition if show list is triggered -->
{#if showList}
	{#each elements.slice(0, i) as elem}
		<div transition:slide|local>{elem}</div>
	{/each}
{/if}

<p>Status: {status}</p>
<label
	><input type="checkbox" bind:checked={showFly} />
	show fly</label
>

{#if showFly}
	<p
		transition:fly={{ x: 200, duration: 1000 }}
		on:introstart={() => (status = "intro started")}
		on:introend={() => (status = "intro end")}
		on:outrostart={() => (status = "outro started")}
		on:outroend={() => (status = "outro end")}
	>
		Flying
	</p>

	<p in:fade out:fly={{ x: 200, duration: 2000 }}>In and out</p>
{/if}

<TodoDeferTransition />

<h2>Key blocks</h2>
<p>
	Useful if an element should play its transition whenever value changes instead
	of only wehen the element enters or leaves the DOM
</p>
<div>
	The number is:
	{#key blockNumber}
		<span style="display: inline-block" in:fly={{ y: -20 }}>{blockNumber}</span>
	{/key}
</div>
<br />
<button
	on:click={() => {
		blockNumber += 1;
	}}>Increment</button
>
<button
	on:click={() => {
		blockNumber -= 1;
	}}>Decrement</button
>

<style>
</style>
