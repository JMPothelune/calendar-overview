<script lang="ts">
  import '@skeletonlabs/skeleton/themes/theme-crimson.css';
  import { storePrefersDarkScheme, storeLightSwitch } from '@skeletonlabs/skeleton';
	import { tick } from 'svelte';
	import EventView from '$lib/components/EventView.svelte';
	import { calendarEventsStore, calendarSettingsStore } from '$lib/store/stores';

  $:toogleDarkClass($calendarSettingsStore.isLightMode);
  
	function toogleDarkClass(isLightMode:boolean): void {
		const elemHtmlClassList = document.documentElement.classList;
		isLightMode ? elemHtmlClassList.add('dark') : elemHtmlClassList.remove('dark');
	}

</script>

<main style="-webkit-app-region: drag" class="min-h-full select-none p-2">
  <h1>Events</h1>
  $calendarEventsStore : {JSON.stringify($calendarEventsStore)}
  <div class="flex flex-col space-y-2">
    {#each $calendarEventsStore as event}
      <EventView event={event} />
    {/each}
  </div>
</main>
