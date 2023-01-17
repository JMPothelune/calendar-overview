<script lang="ts">
	import type { CalendarEvent } from "$lib/store/store";
  import dayjs from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  dayjs.extend(duration)

  export let event: CalendarEvent;

  let now = new Date();
  setInterval(() => {
    now = new Date();
  }, 1000);

  let avancement = 0;
  $: {
    avancement = (now.getTime() - event.start.getTime()) / (event.end.getTime() - event.start.getTime()) * 100;
    avancement = Math.min(Math.max(avancement, 0), 100);
  }

  $: leftTimeFormatted = formatDuration(dayjs.duration(event.end.getTime() - now.getTime()));

  let status = 'upcoming';
  $: {
    if(now.getTime() < event.start.getTime()) {
      status = 'upcoming'
    } else if(now.getTime() < event.end.getTime()) {
      status = 'ongoing'
    } else {
      status = 'finished'
    }
  }
  function formatDuration(duration: any) {
    if(duration.asMilliseconds() < 0) {
      return ''
    }
    const hours = duration.hours()
    const minutes = duration.minutes()
    const seconds = duration.seconds()
    if(hours === 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  }
</script>

<div class="flex flex-row relative rounded overflow-hidden items-stretch bg-sky-900">
  <div class="bg-sky-400 w-2 mr-3"/>
  <div class="flex flex-col">
    <h2 class="text-base font-semibold">{event.summary}</h2>
    <div class="text-sm opacity-80">
      <span >{formatTime(event.start)}</span>
      <span>-</span>
      <span>{formatTime(event.end)}</span>
    </div>
  </div>

  <div class="flex flex-col flex-grow justify-end items-end  pr-2">
    <div class="text-sm text-opacity-80 flex flex-row font-black">
      {#each leftTimeFormatted as char}
        <div class:w-[0.35em]={(char===":")} class="w-[0.63em] text-center" >
          {char}
        </div>
      {/each}
    </div>
  </div>
  <div class="bg-sky-50 absolute left-0 top-0 bottom-0 opacity-20" style={`width: ${avancement}%`}/>
</div>
