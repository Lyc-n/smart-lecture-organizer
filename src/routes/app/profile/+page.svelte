<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { CardTitle } from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Item from '$lib/components/ui/item/item.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';

	let { data } = $props();
</script>

<div class="flex min-h-dvh w-full bg-background">
	<div class="flex w-full flex-col gap-4 px-11 py-8">
		<Card class="flex-row items-center px-8">
			<Button class="relative h-20 w-20 rounded-full bg-divider ring-4 ring-primaryLight">
				<i class="ph-bold ph-camera absolute right-0 bottom-0 rounded-full bg-primary p-1.5 text-xs"
				></i>
			</Button>
			<div class="">
				<h2 class="text-2xl font-medium">{data.user.name}</h2>
				<span class="text-innactive">{data.user.email}</span>
			</div>
		</Card>
		<Card>
			<div class="flex items-center gap-3 px-8">
				<i class="ph-bold ph-user-gear text-lg text-primary"></i>
				<p class="font-medium">Account Information</p>
			</div>
			<div class="grid grid-cols-3 grid-rows-2 gap-3 px-8">
				<div class="col-span-2 flex flex-col gap-1.5">
					<label for="username" class="text-xs font-medium text-innactive">username</label>
					<Input
						type="text"
						id="username"
						placeholder="username"
						value={data.user.email}
						class="bg-divider/25 px-6 py-5 shadow-[0_0_1px_1px_rgba(0,0,0,0.1)] focus:ring-red-700"
					/>
				</div>
				<div class="col-span-1 flex flex-col gap-1.5">
					<label for="bahasa" class="text-xs font-medium text-innactive">bahasa</label>
					<Input
						type="text"
						id="bahasa"
						placeholder="bahasa"
						value="Bahasa Indonesia"
						class="bg-divider/25 px-6 py-5 shadow-[0_0_1px_1px_rgba(0,0,0,0.1)] focus:ring-red-700"
					/>
				</div>
				<div class="col-span-3 flex flex-col gap-1.5">
					<label for="password" class="text-xs font-medium text-innactive">password</label>
					<Input
						type="password"
						id="password"
						placeholder="password"
						value={data.user.email}
						class="bg-divider/25 px-6 py-5 shadow-[0_0_1px_1px_rgba(0,0,0,0.1)] focus:ring-red-700"
					/>
				</div>
			</div>
		</Card>
		<Card>
			<div class="flex items-center gap-3 px-8">
				<i class="ph-bold ph-bell-ringing text-lg text-primary"></i>
				<p class="font-medium">Notification</p>
			</div>
			<label for="1" class="flex w-full cursor-default justify-between px-8">
				<div class="flex flex-col">
					<p class="text-sm font-medium">Upcoming Deadlines</p>
					<span class="text-xs text-innactive"
						>Receive all notification alert for every deadline you set.</span
					>
				</div>
				<Switch id="1" />
			</label>
			<label for="2" class="flex w-full cursor-default justify-between px-8">
				<div class="flex flex-col">
					<p class="text-sm font-medium">New Material Allert</p>
					<span class="text-xs text-innactive"
						>Receive all notification alert for every deadline you set.</span
					>
				</div>
				<Switch id="2" />
			</label>
			<label for="3" class="flex w-full cursor-default justify-between px-8">
				<div class="flex flex-col">
					<p class="text-sm font-medium">Daily Activity Streak</p>
					<span class="text-xs text-innactive"
						>Receive all notification alert for every deadline you set.</span
					>
				</div>
				<Switch id="3" />
			</label>
		</Card>
	</div>
	<div class="w-fit py-6 ps-3 pe-6">
		<Card class="w-fit cursor-default gap-4 p-6">
			<CardTitle class="font-semibold tracking-wider">Activity Summary</CardTitle>
			<div class="space-y-2">
				<Item variant="muted" class="w-full flex-nowrap justify-between rounded-xl bg-divider/25">
					<div class="flex items-center justify-center gap-3">
						<i class="ph-bold ph-book-open-text rounded-lg bg-primary/10 p-2"></i>
						<span class="text-nowrap">Total Mata Kuliah</span>
					</div>
					<span>4</span>
				</Item>
				<Item variant="muted" class="w-full flex-nowrap justify-between rounded-xl bg-divider/25">
					<div class="flex items-center justify-center gap-3">
						<i class="ph-bold ph-book-open-text rounded-lg bg-primary/10 p-2"></i>
						<span class="text-nowrap">FIle Tersimpan</span>
					</div>
					<span>14</span>
				</Item>
			</div>
		</Card>
	</div>
</div>
