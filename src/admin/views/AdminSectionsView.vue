<script setup>
import { computed, ref } from 'vue'
import { ArrowDown, ArrowUp, CircleAlert, Pencil, Plus } from 'lucide-vue-next'
import AdminTopbar from '../components/AdminTopbar.vue'
import CategoryDialog from '../components/CategoryDialog.vue'
import GroupDialog from '../components/GroupDialog.vue'
import { describeError, moveRow } from '../menu-admin-api'
import { showToast } from '../toast'
import { useMenuRows } from '../use-menu-rows'

const { rows, status, loadError, reload, upsert, remove, groups, categories, categoriesIn } =
  useMenuRows()

const itemCounts = computed(() => {
  const counts = new Map()
  for (const item of rows.items)
    counts.set(item.category_id, (counts.get(item.category_id) ?? 0) + 1)
  return counts
})

const shownItemCount = (categoryId) =>
  rows.items.filter((item) => item.category_id === categoryId && item.is_available).length

// Each dialog: a row to edit, `null` for a new one, or `undefined` while closed.
const editingGroup = ref(undefined)
const editingCategory = ref(undefined)
const newCategoryGroupId = ref('')

const openNewCategory = (groupId) => {
  newCategoryGroupId.value = groupId
  editingCategory.value = null
}

const announceSaved = (wasNew, row) =>
  showToast(wasNew ? `Added “${row.name_en}”.` : `Saved “${row.name_en}”.`)

const onGroupSaved = (row) => {
  announceSaved(editingGroup.value === null, row)
  upsert('group', row)
  editingGroup.value = undefined
}

const onCategorySaved = (row) => {
  announceSaved(editingCategory.value === null, row)
  upsert('category', row)
  editingCategory.value = undefined
}

const onGroupDeleted = (id) => {
  showToast(`Deleted “${editingGroup.value.name_en}”.`)
  remove('group', id)
  editingGroup.value = undefined
}

const onCategoryDeleted = (id) => {
  showToast(`Deleted “${editingCategory.value.name_en}”.`)
  remove('category', id)
  editingCategory.value = undefined
}

const isMoving = ref(false)

const move = async (kind, list, index, direction) => {
  isMoving.value = true
  try {
    upsert(kind, ...(await moveRow(kind, list, index, direction)))
  } catch (cause) {
    showToast(describeError(cause), 'error')
  } finally {
    isMoving.value = false
  }
}
</script>

<template>
  <AdminTopbar title="Sections" section="Setup">
    <button
      type="button"
      class="admin-button"
      :disabled="status !== 'ready'"
      @click="editingGroup = null"
    >
      <Plus :size="16" :stroke-width="2" />
      <span class="wide-only">New Heading</span>
    </button>
    <button
      type="button"
      class="admin-button admin-button--primary"
      :disabled="status !== 'ready' || !groups.length"
      @click="openNewCategory(groups[0].id)"
    >
      <Plus :size="16" :stroke-width="2" />
      <span class="wide-only">New Section</span>
    </button>
  </AdminTopbar>

  <main class="page">
    <section v-if="status !== 'ready'" class="admin-section">
      <div class="admin-section__inner">
        <p v-if="status === 'loading'" class="admin-empty">Loading the menu…</p>
        <div v-else class="admin-form">
          <p class="admin-error" role="alert">
            <CircleAlert :size="16" aria-hidden="true" />
            <span>{{ loadError }}</span>
          </p>
          <button type="button" class="admin-button retry" @click="reload">Try again</button>
        </div>
      </div>
    </section>

    <section v-for="(group, groupIndex) in groups" v-else :key="group.id" class="admin-section">
      <div class="admin-section__inner">
        <div class="group-head">
          <div class="group-title">
            <h2 class="admin-section__title">{{ group.name_en }}</h2>
            <span class="admin-muted">{{ group.name_id }}</span>
          </div>
          <div class="group-actions">
            <button
              type="button"
              class="admin-icon-button"
              :aria-label="`Move ${group.name_en} up`"
              :disabled="isMoving || groupIndex === 0"
              @click="move('group', groups, groupIndex, -1)"
            >
              <ArrowUp :size="16" :stroke-width="1.75" />
            </button>
            <button
              type="button"
              class="admin-icon-button"
              :aria-label="`Move ${group.name_en} down`"
              :disabled="isMoving || groupIndex === groups.length - 1"
              @click="move('group', groups, groupIndex, 1)"
            >
              <ArrowDown :size="16" :stroke-width="1.75" />
            </button>
            <button
              type="button"
              class="admin-button admin-button--ghost"
              @click="editingGroup = group"
            >
              <Pencil :size="14" :stroke-width="1.75" />
              Edit heading
            </button>
            <button
              type="button"
              class="admin-button admin-button--ghost"
              @click="openNewCategory(group.id)"
            >
              <Plus :size="14" :stroke-width="2" />
              Section
            </button>
          </div>
        </div>

        <div class="admin-table-frame">
          <table class="admin-table">
            <thead>
              <tr>
                <th scope="col">Section</th>
                <th scope="col">Indonesia</th>
                <th scope="col" class="is-number">Items</th>
                <th scope="col">Status</th>
                <th scope="col" class="is-actions"><span class="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(category, index) in categoriesIn(group.id)" :key="category.id">
                <td class="is-strong">
                  <button type="button" class="name-button" @click="editingCategory = category">
                    {{ category.name_en }}
                  </button>
                </td>
                <td>{{ category.name_id }}</td>
                <td class="is-number">
                  {{ shownItemCount(category.id) }}
                  <span
                    v-if="shownItemCount(category.id) !== (itemCounts.get(category.id) ?? 0)"
                    class="admin-muted"
                  >
                    / {{ itemCounts.get(category.id) }}
                  </span>
                </td>
                <td>
                  <span v-if="!category.is_visible" class="admin-badge">Hidden</span>
                  <span v-else-if="!shownItemCount(category.id)" class="admin-badge">
                    Empty, not shown
                  </span>
                  <span v-else class="shown">Shown</span>
                </td>
                <td class="is-actions">
                  <button
                    type="button"
                    class="admin-icon-button"
                    :aria-label="`Move ${category.name_en} up`"
                    :disabled="isMoving || index === 0"
                    @click="move('category', categoriesIn(group.id), index, -1)"
                  >
                    <ArrowUp :size="16" :stroke-width="1.75" />
                  </button>
                  <button
                    type="button"
                    class="admin-icon-button"
                    :aria-label="`Move ${category.name_en} down`"
                    :disabled="isMoving || index === categoriesIn(group.id).length - 1"
                    @click="move('category', categoriesIn(group.id), index, 1)"
                  >
                    <ArrowDown :size="16" :stroke-width="1.75" />
                  </button>
                  <button
                    type="button"
                    class="admin-icon-button"
                    :aria-label="`Edit ${category.name_en}`"
                    @click="editingCategory = category"
                  >
                    <Pencil :size="16" :stroke-width="1.75" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="!categoriesIn(group.id).length" class="admin-empty">
            No sections under this heading yet.
          </p>
        </div>
      </div>
    </section>
  </main>

  <GroupDialog
    v-if="editingGroup !== undefined"
    :group="editingGroup"
    :groups="groups"
    :category-count="editingGroup ? categoriesIn(editingGroup.id).length : 0"
    @close="editingGroup = undefined"
    @saved="onGroupSaved"
    @deleted="onGroupDeleted"
  />

  <CategoryDialog
    v-if="editingCategory !== undefined"
    :category="editingCategory"
    :group-id="editingCategory?.group_id ?? newCategoryGroupId"
    :groups="groups"
    :categories="categories"
    :item-count="editingCategory ? (itemCounts.get(editingCategory.id) ?? 0) : 0"
    @close="editingCategory = undefined"
    @saved="onCategorySaved"
    @deleted="onCategoryDeleted"
  />
</template>

<style scoped>
.page {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.retry {
  align-self: flex-start;
}

.group-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.group-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.group-title .admin-section__title {
  margin: 0;
}

.group-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.name-button {
  color: var(--n-900);
  font-weight: 500;
  text-align: left;
}

.name-button:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.shown {
  color: var(--n-500);
  font-size: 13px;
}

.wide-only {
  display: none;
}

@media (min-width: 640px) {
  .wide-only {
    display: inline;
  }
}
</style>
