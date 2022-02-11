<script lang="ts">
	import Reactivity from "../Reactivity.svelte";
	import TodoList from "../components/Todo/TodoList.svelte";
	import EventListener from "../components/EventListener.svelte";
	import Directives from "../components/Directives.svelte";
	import Transitions from "../Transitions.svelte";
	import Animation from "../components/Animation.svelte";
	import GrandParent from "../components/events/GrandParent.svelte";
	import DomEventParent from "../components/events/DomEventParent.svelte";
	import Video from "../components/media/Video.svelte";
	import Image from "../components/media/Image.svelte";
	import Gallery from "../components/media/Gallery.svelte";
</script>

<main>
	<section>
		<h1>Introduction</h1>
	</section>
	<section>
		<h1>Todo application</h1>
		<TodoList />
	</section>
	<section>
		<h1>Reactivity</h1>
		<Reactivity />
	</section>
	<section>
		<h1>Event Listener</h1>
		<EventListener />
	</section>
	<section>
		<h1>Directives</h1>
		<Directives />
	</section>
	<section>
		<h1>Transitions</h1>
		<Transitions />
	</section>
	<section>
		<h1>Animations</h1>
		<Animation />
	</section>
	<section>
		<h1>Event forwarding</h1>
		<GrandParent />
	</section>
	<section>
		<h1>DOM event</h1>
		<DomEventParent />
	</section>
	<section>
		<h1>Media</h1>
		<Video />
	</section>
	<section>
		<h1>Image</h1>
		<Image
			src="https://cdn.pixabay.com/photo/2022/01/31/12/46/bird-6983434_960_720.jpg"
			alt="Birdie"
			description="Birdie on concrete"
		/>
	</section>
	<section>
		<h1>Gallery</h1>
		<Gallery />
	</section>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 250px;
		margin: 0 auto;
	}

	section {
		width: 100%;
		height: auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	h1:focus {
		outline: 0px;
	}
</style>
