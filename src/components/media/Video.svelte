<script lang="ts">
	import { onMount } from "svelte/internal";

	let time = 0;
	let duration;
	let paused = true;

	let video;

	let showControls = true;
	let showControlsTimeout;

	let lastMouseDown: Date;

	onMount(() => {
		console.log(video);
		const boundingClientRect = video.getBoundingClientRect();
		console.log({ boundingClientRect });
	});

	const handleMove = (e) => {
		clearTimeout(showControlsTimeout);
		showControlsTimeout = setTimeout(() => (showControls = false), 1000);
		showControls = true;

		if (!duration) return;

		const mouseEvent = e as MouseEvent;
		const touchEvent = e as TouchEvent;
		if (e.type !== "touchmove" && !(mouseEvent.buttons & 1)) return;

		const clientX =
			e.type === "touchmove"
				? touchEvent.touches[0].clientX
				: mouseEvent.clientX;

		const { left, right } = e.target.getBoundingClientRect();

		time = (duration * (clientX - left)) / (right - left);
	};

	const handleMouseDown = (e: MouseEvent) => {
		lastMouseDown = new Date();
	};

	const handleMouseUp = (e) => {
		if (new Date().getDate() - lastMouseDown.getDate() < 300) {
			if (paused) e.target.play();
			else {
				e.target.pause();
			}
		}
	};

	const format = (seconds: number) => {
		if (isNaN(seconds)) return "...";

		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		return `${minutes}:${seconds}`;
	};
</script>

<h2>Videoplayer</h2>
<p>From <a href="https://studio.blender.org/films">Blender Studio</a>. CC-BY</p>

<div class="wrapper">
	<video
		poster="https://sveltejs.github.io/assets/caminandes-llamigos.jpg"
		src="https://sveltejs.github.io/assets/caminandes-llamigos.mp4"
		on:mousemove={handleMove}
		on:touchmove|preventDefault={handleMove}
		on:mousedown={handleMouseDown}
		on:mouseup={handleMouseUp}
		bind:paused
		bind:duration
		bind:currentTime={time}
		bind:this={video}
	>
		<track kind="captions" />
	</video>
	<div class="controls" style="opacity: {showControls ? 1 : 0}">
		<progress value={time / duration || 0} />
		<div class="info">
			<span class="time">{format(time)}</span>
			<span>click anywhere to / {paused ? "play" : "pause"} drag to seek</span>
			<span class="time">{format(duration)}</span>
		</div>
	</div>
</div>

<style>
	p {
		font-size: 1.2em;
		font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
	}

	h2 {
		font-family: monospace;
	}

	a {
		color: blueviolet;
	}

	a:hover {
		color: darkgreen;
	}

	div {
		position: relative;
	}

	.controls {
		position: absolute;
		top: 0;
		width: 100%;
		transition: opacity 1s;
	}

	.info {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	span {
		padding: 0.2em 0.5em;
		color: white;
		text-shadow: 0 0 8px black;
		font-size: 1.4em;
		opacity: 0.7;
	}

	.time {
		width: 3em;
	}

	progress {
		display: block;
		width: 100%;
		height: 100%;
		-webkit-appearance: none;
		appearance: none;
	}

	progress::-webkit-progress-value {
		background-color: rgba(255, 255, 255, 0.6);
	}

	video {
		width: 100%;
	}
</style>
