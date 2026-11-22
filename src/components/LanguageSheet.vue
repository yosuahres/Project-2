<script setup>
import { useRoute, useRouter } from 'vue-router'
import BottomSheet from './BottomSheet.vue'
import OptionList from './OptionList.vue'
import { SUPPORTED_LANGUAGES, translate, useI18n } from '@/i18n'

defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const { lang, t } = useI18n()

const options = SUPPORTED_LANGUAGES.map((code) => ({
  value: code,
  label: translate(code, 'languageName'),
}))

const selectLanguage = (code) => {
  emit('close')
  if (code === lang.value) return
  // Stay on the same page, only swap the language segment of the URL.
  router.replace({
    name: route.name,
    params: { ...route.params, lang: code },
    query: route.query,
    hash: route.hash,
  })
}
</script>

<template>
  <BottomSheet :open="open" :title="t('language.title')" @close="emit('close')">
    <OptionList :options="options" :selected="lang" @select="selectLanguage" />
  </BottomSheet>
</template>
