<script lang="ts">
	import * as Menubar from '$lib/components/ui/menubar';

	let selectedBoard = '';
</script>

<nav>
	<Menubar.Root>
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

				<Menubar.RadioGroup value={selectedBoard}>
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
				</Menubar.RadioGroup>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>
					New File
					<Menubar.Shortcut>⌘T</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item>Save</Menubar.Item>
				<Menubar.Item>Save As...</Menubar.Item>
				<Menubar.Item>Rename</Menubar.Item>
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
</nav>
