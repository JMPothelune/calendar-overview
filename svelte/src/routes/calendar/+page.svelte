<script lang="ts">
  import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import EventView from '$lib/components/calendar/EventView.svelte';
	import { calendarEventsStore, calendarSettingsStore } from '$lib/store/stores';
	import CalendarToolbox from '$lib/components/toolbox/CalendarToolbox.svelte';
	import DayView from '$lib/components/calendar/DayView.svelte';

  $:toogleDarkClass($calendarSettingsStore.isLightMode);
  
	function toogleDarkClass(isLightMode:boolean): void {
		const elemHtmlClassList = document.documentElement.classList;
		isLightMode ? elemHtmlClassList.add('dark') : elemHtmlClassList.remove('dark');
	}

</script>

<main style="-webkit-app-region: drag" class="h-[100vh] select-none p-2 overflow-hidden">
  <CalendarToolbox/>
  <DayView/>
</main>


<style>

  :global(button){
    -webkit-app-region: no-drag;
  }

</style>