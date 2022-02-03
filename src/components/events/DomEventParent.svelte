<script lang="ts">
	import CustomButton from "../CustomButton.svelte";

	const handleClick = () => {
		alert("Click");
	};
</script>

<h2>Parent defines function to handle on click event in child.</h2>
<h3>No need to pass function to child component. Just listen on event</h3>
<CustomButton on:click={handleClick} />
