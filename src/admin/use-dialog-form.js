import { ref } from 'vue'
import { describeError } from './menu-admin-api'

// The busy flag and error message every admin dialog keeps while it saves or deletes.
export const useDialogForm = () => {
  const error = ref('')
  const isBusy = ref(false)

  // Runs `work`, showing what went wrong in the dialog instead of throwing.
  const run = async (work) => {
    error.value = ''
    isBusy.value = true
    try {
      await work()
    } catch (cause) {
      error.value = describeError(cause)
    } finally {
      isBusy.value = false
    }
  }

  return { error, isBusy, run }
}
