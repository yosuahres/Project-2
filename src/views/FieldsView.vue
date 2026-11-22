<script setup>
import { ref } from 'vue'
import OutletIntro from '@/components/OutletIntro.vue'
import BaseOverlay from '@/components/BaseOverlay.vue'
import { useI18n } from '@/i18n'
import scorecardImage from '@/assets/icons/handicap.jpeg'
import fieldVideo from '@/assets/icons/field.mp4'

const { t } = useI18n()
const isZoomOpen = ref(false)
</script>

<template>
  <OutletIntro discover="menu" />

  <section class="fields">
    <button type="button" class="fields__scorecard" @click="isZoomOpen = true">
      <img
        :src="scorecardImage"
        :alt="t('fields.scorecardAlt')"
        width="1600"
        height="708"
        class="fields__media"
      />
    </button>
    <p class="fields__hint">{{ t('fields.tapToZoom') }}</p>

    <!-- playsinline + muted are required for autoplay on iOS Safari. -->
    <video class="fields__media" autoplay loop muted playsinline preload="metadata">
      <source :src="fieldVideo" type="video/mp4" />
    </video>
  </section>

  <BaseOverlay
    :open="isZoomOpen"
    placement="center"
    :label="t('fields.scorecardAlt')"
    @close="isZoomOpen = false"
  >
    <img
      :src="scorecardImage"
      :alt="t('fields.scorecardAlt')"
      class="fields__zoomed"
      @click="isZoomOpen = false"
    />
  </BaseOverlay>
</template>

<style scoped>
.fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
}

.fields__scorecard {
  display: block;
  width: 100%;
  border-radius: var(--radius-md);
}

.fields__media {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  background: var(--color-surface);
}

.fields__hint {
  margin-top: -4px;
  color: var(--color-muted);
  font-size: 12px;
  text-align: center;
}

.fields__zoomed {
  max-width: 100%;
  max-height: 90dvh;
  border-radius: var(--radius-md);
}
</style>
