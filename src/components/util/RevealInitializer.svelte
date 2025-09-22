<script lang="ts">
  import { onMount } from 'svelte';
  import { initReveal } from '../../scripts/initReveal';

  onMount(() => {
    const runReveal = () => initReveal({ threshold: 0, rootMargin: '-6%' });

    runReveal();
    document.addEventListener('astro:page-load', runReveal);

    return () => {
      document.removeEventListener('astro:page-load', runReveal);
    };
  });
</script>
