<script>
	import * as Menubar from '$lib/components/ui/menubar';
	import { Button } from '$lib/components/ui/button';

	import { toggleMode } from 'mode-watcher';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	let selectedBoard = '';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<!-- TODO: add EXAMPLES tab which creates TEMPORARY example file (but still allows you to upload the program) -->
<nav class="flex gap-2">
	<Menubar.Root class="grow">
		<Menubar.Menu>
			<Menubar.Trigger class="font-bold">BS2-IDE</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>About</Menubar.Item>
				<Menubar.Item>Help</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>Board</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>
					Upload to Board
					<Menubar.Shortcut>⌘R</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Separator />

				<!-- <Menubar.RadioGroup value={selectedBoard}>
					<Menubar.RadioItem
						on:click={() => {
							selectedBoard = 'andy';
						}}
						value="andy">Andy</Menubar.RadioItem
					>
					<Menubar.RadioItem
						on:click={() => {
							selectedBoard = 'benoit';
						}}
						value="benoit">Benoit</Menubar.RadioItem
					>
					<Menubar.RadioItem
						on:click={() => {
							selectedBoard = 'Luis';
						}}
						value="Luis">Luis</Menubar.RadioItem
					>
				</Menubar.RadioGroup> -->
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>
					New File
					<Menubar.Shortcut>⌘T</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item
					on:click={() => {
						dispatch('saveFile');
					}}>Save</Menubar.Item
				>
				<Menubar.Item>Save As...</Menubar.Item>
				<Menubar.Item
					on:click={() => {
						dispatch('renameFile');
					}}>Rename File</Menubar.Item
				>
				<Menubar.Item>Delete File</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>Download to Board</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>Edit</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>Format</Menubar.Item>
				<Menubar.Sub>
					<Menubar.SubTrigger>Snippets</Menubar.SubTrigger>
					<Menubar.SubContent>
						<Menubar.Item>IF...THEN...ELSE</Menubar.Item>
						<Menubar.Item>DO LOOP</Menubar.Item>
						<Menubar.Item>FOR _ = _ to _ ... NEXT</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
	<Button on:click={toggleMode} variant="outline" size="icon">
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</nav>
