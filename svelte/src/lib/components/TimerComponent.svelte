<script lang="ts">
	import { ProgressRadial } from "@skeletonlabs/skeleton";




  export let showHours = true;
  export let showDuration = true;
  export let startTime = "00:00:00";
  export let endTime = "00:00:00";
  export let duration = "00:00:00";

  let now = new Date();
  setInterval(() => {
    now = new Date()
  }, 1000);
  
  $: formattedTime = now.getHours() + ":" + now.getMinutes().toString().padStart(2, "0");

  let startDate = new Date();
  $: {
    const [hours, minutes] = startTime.split(":").map((x) => parseInt(x));
    startDate = new Date();
    startDate.setHours(hours);
    startDate.setMinutes(minutes);
    startDate.setSeconds(0);
  }

  let endDate = new Date();
  $: {
    const [hours, minutes] = endTime.split(":").map((x) => parseInt(x));
    endDate = new Date();
    endDate.setHours(hours);
    endDate.setMinutes(minutes);
    endDate.setSeconds(0);
  }

  // calculate avancement
  let avancement = 120;
  $: {
    const diff = endDate.getTime() - startDate.getTime();
    const nowDiff = now.getTime() - startDate.getTime();
    if(diff > 0){
      avancement = (nowDiff / diff) * 100;
    }
    else{
      avancement = 0;
    }

    if(avancement > 100){
      avancement = 100;
    }
    
  }


</script>


<div class="relative h-[40vh] w-[40vh] aspect-square m-[1vh]">
  {#if showHours}
  <div class="absolute inset-0 text-[10vh] font-black flex justify-center items-center">
    {formattedTime}
  </div>
  {/if}

  {#if showDuration}
    <ProgressRadial
      class="absolute inset-0"
      value={avancement}
      color="red"
      size="large"
      thickness="medium"
    />
  {/if}

  {#if showDuration}
    <div class="absolute left-[-9vh] bottom-[-2vh] flex flex-col space-y-[-2vh] ">
      <div class="text-[3vh] uppercase">
        Début
      </div>
      <div class="text-[5vh] uppercase font-bold">
        {startTime.slice(0, 5)}
      </div>
    </div>


    <div class="absolute right-[-9vh] bottom-[-2vh] flex flex-col items-end space-y-[-2vh] ">
      <div class="text-[3vh] uppercase">
        Fin
      </div>
      <div class="text-[5vh] uppercase font-bold">
        {endTime.slice(0, 5)}
      </div>
    </div>
  {/if}

</div>