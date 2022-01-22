<script lang="ts">
    import { onMount } from "svelte";
    import TodoItem from "./TodoItem.svelte";

    let todos: string[] = [];
    let todoName: string = "";

    onMount(() => {
        const existingTodos = localStorage.getItem("todos");
        todos = JSON.parse(existingTodos) || [];
    });


    asd

    const addTodo = () => {
        if (todoName) {
            todos = [...todos, todoName];
            localStorage.setItem("todos", JSON.stringify(todos));
            todoName = "";
        }
    };

    const removeTodo = (todo: string) => {
        todos = todos.filter((item) => item != todo);
        localStorage.setItem("todos", JSON.stringify(todos));
    };
</script>

<form on:submit|preventDefault={addTodo}>
    <input bind:value={todoName} placeholder="Insert todo" />
    <input type="submit" value="Add" />
</form>

<ul>
    {#each todos as todo}
        <TodoItem name={todo} handleRemove={removeTodo} />
    {/each}
</ul>

<style>
    ul {
        list-style: none;
    }
    input[type="submit"] {
        background-color: darkgreen;
        cursor: pointer;
        color: white;
        border-radius: 0.4rem;
    }
</style>
