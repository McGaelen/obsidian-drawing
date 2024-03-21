<script lang="ts">
  import { Platform } from 'obsidian'
</script>

<div class="toolbar" class:mobile={Platform.isMobile || Platform.isMobileApp}>
  placeholder
</div>

<style>
  .toolbar {
    position: sticky;
    top: -32px;
    display: flex;
    justify-content: center;
    gap: 8px;
    left: 0;
    z-index: 999999;
    background-color: var(--divider-color);
    border-top-left-radius: var(--radius-s);
    border-top-right-radius: var(--radius-s);
    cursor: default;
  }

  .toolbar.mobile {
    top: -8px;
  }
</style>
