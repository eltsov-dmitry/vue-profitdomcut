<template>
  <div class="list__panels--sort">
    <q-btn round color="primary" icon="filter_list" flat>
      <q-tooltip>Сортировка</q-tooltip>
      <q-menu transition-show="scale" transition-hide="scale" auto-close>
        <q-list style="min-width: 100px">
          <q-item
            v-for="sortItem in sortProxy"
            :key="sortItem"
            clickable
            @click="sortBy(sortItem.sort)"
            :active="isActive(sortItem.sort)"
          >
            <q-item-section>{{ sortItem.label }}</q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import { isEqual } from 'lodash';

export default {
  name: 'ListSort',
  props: {
    name: String,
  },
  setup(props) {
    const store = useStore();
    const { name } = props;
    const sortManager = computed(() => store.getters['compilations/getSortManager']);
    const sortDeal = computed(() => store.getters['compilations/getSortDeal']);
    const sortAll = computed(() => store.getters['compilations/getSortAll']);
    const sortDepartment = computed(() => store.getters['compilations/getSortDepartment']);

    const sortActive = () => {
      switch (name) {
        case 'manager':
          return sortManager;
        case 'deal':
          return sortDeal;
        case 'all':
          return sortAll;
        case 'department':
          return sortDepartment;
        default:
          return null;
      }
    };

    const sortData = [
      {
        label: 'По дате (по возрастанию)',
        sort: { createAt: 'asc' },
      },
      {
        label: 'По дате (по убыванию)',
        sort: { createAt: 'desc' },
      },
      {
        label: 'По менеджеру (по возрастанию)',
        sort: { manager: 'asc', createAt: 'asc' },
      },
      {
        label: 'По менеджеру (по убыванию)',
        sort: { manager: 'desc', createAt: 'asc' },
      },
    ];

    const sortProxy = ref(sortData);
    watch(sortActive(), () => {
      sortProxy.value = sortData;
    });

    return {
      sortProxy,
      sortBy: (sortParam) => {
        switch (name) {
          case 'manager':
            return store.dispatch('compilations/updateCompilationsManager', { sort: sortParam });
          case 'deal':
            return store.dispatch('compilations/updateCompilationsDeal', { sort: sortParam });
          case 'all':
            return store.dispatch('compilations/updateCompilationsAll', { sort: sortParam });
          case 'department':
            return store.dispatch('compilations/updateCompilationsDepartment', { sort: sortParam });
          default:
            return null;
        }
      },
      isActive: (sortParam) => isEqual(sortActive().value, sortParam),
    };
  },
};
</script>

<style scoped>
.list__panels--sort {
  display: flex;
  justify-content: flex-end;
}
</style>
