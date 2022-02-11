<script lang="ts"></script>

<body>
	<div class="sidebar">
		<div class="banner" />
		<div class="title"><h1>Sidebar</h1></div>
		<div class="sidebar-content" />
	</div>
	<div class="content">
		<h1>Content</h1>
	</div>
</body>

<style>
	body {
		background-color: grey;
		color: #333;
		box-sizing: border-box;
		/* position: relative; */
		width: 100%;
		height: 100vh;
		display: flex;
		padding: 0;
		font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
			sans-serif;
	}

	@media screen and (max-width: 650px) {
		body {
			flex-direction: column;
		}

		/* .sidebar {
			overflow-y: hidden;
		} */
	}

	.sidebar {
		width: 100%;
		max-width: 100%;
		/* height: 100%; */
		left: 0;
		flex-basis: 70%;
		overflow-y: scroll;
		overflow-x: hidden;
		/* position: fixed; */
	}

	.content {
		width: 100%;
		/* height: 100%; */
		background-color: aqua;
		/* position: relative; */
	}

	.title {
		box-sizing: border-box;
		padding: 1em;
		border-radius: 0.5em;
		margin: 1em;
		z-index: 2;
		background-color: white;
		box-shadow: 2px 2px 2px rgba(54, 53, 53, 0.2);
		position: absolute;
		top: 13em;
	}

	.banner {
		height: 18em;
		z-index: 1;
		background-repeat: no-repeat;
		background-size: contain;
		object-fit: cover;
		overflow: hidden;
		/* background-position: center; */
		background-image: url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fc.wallhere.com%2Fphotos%2Fe7%2F98%2Ftree_green_nature_spring_forrest_natur_gr_n_wald-649041.jpg!d&f=1&nofb=1);
		/* position: absolute; */
	}

	.sidebar-content {
		background-color: blue;
		height: 100%;
	}
</style>
