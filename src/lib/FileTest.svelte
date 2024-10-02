<script>
	import { db } from './db';
	export let defaultAge = 21;

	let status = '';

	let friendName = '';
	let friendAge = defaultAge;

	async function addFriend() {
		try {
			const id = await db.friends.add({
				name: friendName,
				age: friendAge
			});

			status = `Friend ${friendName} successfully added. Got id ${id}`;

			friendName = '';
			friendAge = defaultAge;
		} catch (err) {
			status = `Failed to add ${friendName}: ${err}`;
		}
	}

	import { liveQuery } from 'dexie';

	let friends = liveQuery(() => db.friends.toArray());
</script>

<div>
	<p>{status}</p>
	<fieldset>
		<legend>Add new friend</legend>
		<label>
			Name:
			<input type="text" bind:value={friendName} />
		</label>
		<br />
		<label>
			Age:
			<input type="number" bind:value={friendAge} />
		</label>
		<br />
		<button on:click={addFriend}>Add Friend</button>
	</fieldset>
</div>
<ul>
	{#if $friends}
		{#each $friends as friend (friend.id)}
			<li>{friend.name}, {friend.age}</li>
		{/each}
	{/if}
</ul>
