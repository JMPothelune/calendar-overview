<script lang="ts">
	import { calendarSettingsStore } from "$lib/store/stores";
	import { menu } from "@skeletonlabs/skeleton";
  
  $: sources = $calendarSettingsStore.sources || [];
  console.log(sources)

  function handleAddSource(): void {
    $calendarSettingsStore.sources = [
      ...sources, 
      { 
        name: '', 
        icalUrl: '',
        color: '#000000'
      }
    ];
  }

  function deleteSource(source: any): void {
    $calendarSettingsStore.sources = sources.filter((s: any) => s !== source);
  }
</script>



<div class="space-y-2">
{#each $calendarSettingsStore.sources as source, i}
 <div class="card p-4 space-y-2 ">
  <span class="relative float-right">
    <button 
      use:menu={{ menu: `more-${i}`, interactive: true }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
      </svg>      
    </button>
    <div class="card p-4" data-menu={`more-${i}`}>
      <button class="w-full" on:click={()=>deleteSource(source)}>
        Delete
      </button>
    </div>
  </span>


    <label for="name">
      <span>Name</span>
      <input type="text" bind:value={source.name} />
    </label>
    <label for="icalUrl">
      <span>iCal URL</span>
      <input type="url" bind:value={source.icalUrl} />
    </label>
    <!-- <label for="color" class="flex flex-row">
      <span>Color</span>
      <input type="color" bind:value={source.color} />
    </label> -->
  </div>
{/each}


<button on:click={handleAddSource} class="float-right my-4">
  + Add source
</button>

</div>