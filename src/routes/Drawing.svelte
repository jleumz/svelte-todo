<script lang="ts">
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let mouseEntered = false;
	let drawWeight = 10;
	let drawingColor = "#FF0000";
	const drawStyles = ["rect", "stroke", "arc"];

	onMount(() => {
		console.log(canvas);
		ctx = canvas.getContext("2d");
	});

	const handleMouseDown = (e) => {
		mouseEntered = true;
	};

	const handleMouseUp = (e) => {
		mouseEntered = false;
	};

	const handleMouseMove = (e) => {
		if (!mouseEntered) {
			return;
		}

		ctx.fillStyle = drawingColor;
		ctx.fillRect(e.layerX, e.layerY, drawWeight, drawWeight);
	};

	const reset = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};
</script>

<canvas
	bind:this={canvas}
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
/>
<div class="controls">
	<input type="number" bind:value={drawWeight} />
	<input type="color" bind:value={drawingColor} />
	<select>
		{#each drawStyles as style}
			<option>{style}</option>
		{/each}
	</select>
	<button on:click={reset}>&#x1F6AE</button>
</div>

<style>
	canvas {
		/* background-color: grey; */
		background: url(https://cdn.pixabay.com/photo/2022/01/31/12/46/bird-6983434_960_720.jpg);
		background-size: contain;
		background-position: center;
		height: 50%;
		width: 50%;
	}

	.controls input select button {
		height: 100%;
		padding: 0.1em;
	}
</style>
