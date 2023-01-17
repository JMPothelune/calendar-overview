<script lang="ts">
	import type { ClockSettings } from "$lib/store/store";
	import sharedStore from "$lib/store/store";
	import { LightSwitch, SlideToggle, type ModalSettings } from "@skeletonlabs/skeleton";
  import { modalStore } from '@skeletonlabs/skeleton';
	import { onMount } from "svelte";

  let date = new Date();

let calendarSettings = {
  isLightMode: false,
  showWindow: false,
};


const initialValue = {
  initializated: true,
  calendarSettings,
}

  setInterval(() => {
    date = new Date();
  }, 1000);

  $: {
    sharedStore.update((store) => {
      return {
        ...store,
        calendarSettings:
        {
          ...store.calendarSettings,
          ...calendarSettings
        }
      }
    });
    
  }

  onMount(()=>{
  });

  sharedStore.subscribe((store) => {
    calendarSettings = {...store.calendarSettings}
    console.log("sharedStore.subscribe", calendarSettings)
  });

  function toogleCalendarWindow() {
    calendarSettings.showWindow = !calendarSettings.showWindow;
  }
</script>


<section class="flex flex-col space-y-12">
  {#if calendarSettings.showWindow}
  <button class="btn btn-filled-error self-end" on:click={toogleCalendarWindow}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
    </svg>
    

    <span>Fermer le calendrier</span>
  </button>
    
  {:else}
    <button class="btn btn-filled-secondary self-end" on:click={toogleCalendarWindow}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clip-rule="evenodd" />
      </svg>

      <span> Ouvrir le calendrier</span>
    </button>
  {/if}


  <section>
    <SlideToggle bind:checked={calendarSettings.alwaysVisible}>Toujours visible</SlideToggle>
  </section>

  <section class="flex flex-row items-center space-x-4">

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clip-rule="evenodd" />
    </svg>

    <SlideToggle bind:checked={calendarSettings.isLightMode}></SlideToggle>
 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
    
    
    
  </section>


</section>

