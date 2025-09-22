<script lang="ts">
  import { onMount } from 'svelte';
  import { initReveal } from '../../scripts/initReveal';

  export let threshold = 0;
  export let rootMargin: string | undefined;

  onMount(() => {
    initReveal({ threshold, rootMargin });
  });
</script>
