<template>
  <div class="list">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey list__tabs"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab class="list__tabs--item" name="manager" label="Мои" icon="person" />
      <q-tab class="list__tabs--item" name="deal" label="Сделка" icon="work" v-if="isShowDeal" />
      <q-tab class="list__tabs--item" name="all" label="Все" icon="group" v-if="isShowAll" />
      <q-tab
        class="list__tabs--item"
        name="department"
        label="Отдел"
        icon="group"
        v-if="isShowDepartment"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels class="list__panels" v-model="tab" animated>
      <q-tab-panel class="list__panels--item" name="manager">
        <template v-if="compilationsManager.length">
          <loader v-if="loaderManager" />
          <list-sort name="manager" />
          <div class="list__panels--content" v-for="item in compilationsManager" :key="item">
            <list-item :editable="isEditable(item)" :item="item" />
          </div>
          <div class="q-pa-lg flex flex-center" v-if="paginatorManagerTotal > 1">
            <q-pagination
              class="list__panels--paginator"
              v-model="paginatorManagerCurrent"
              :max="paginatorManagerTotal"
              :max-pages="6"
            />
          </div>
        </template>
        <template v-else>
          <loader v-if="loaderManager" />
          <list-empty v-else />
        </template>
      </q-tab-panel>

      <q-tab-panel class="list__panels--item" name="deal" v-if="isShowDeal">
        <template v-if="compilationsDeal.length">
          <loader v-if="loaderDeal" />
          <list-sort name="deal" />
          <div class="list__panels--content" v-for="item in compilationsDeal" :key="item">
            <list-item :editable="isEditable(item)" :item="item" />
          </div>
          <div class="q-pa-lg flex flex-center" v-if="paginatorDealTotal > 1">
            <q-pagination
              class="list__panels--paginator"
              v-model="paginatorDealCurrent"
              :max="paginatorDealTotal"
              :max-pages="6"
            />
          </div>
        </template>
        <template v-else>
          <loader v-if="loaderDeal" />
          <list-empty v-else />
        </template>
      </q-tab-panel>

      <q-tab-panel class="list__panels--item" name="all" v-if="isShowAll">
        <template v-if="compilationsAll.length">
          <loader v-if="loaderAll" />
          <list-sort name="all" />
          <div class="list__panels--content" v-for="item in compilationsAll" :key="item">
            <list-item :editable="isEditable(item)" :item="item" />
          </div>
          <div class="q-pa-lg flex flex-center" v-if="paginatorAllTotal > 1">
            <q-pagination
              class="list__panels--paginator"
              v-model="paginatorAllCurrent"
              :max="paginatorAllTotal"
              :max-pages="6"
            />
          </div>
        </template>
        <template v-else>
          <loader v-if="loaderAll" />
          <list-empty v-else />
        </template>
      </q-tab-panel>

      <q-tab-panel class="list__panels--item" name="department" v-if="isShowDepartment">
        <template v-if="compilationsDepartment.length">
          <loader v-if="loaderDepartment" />
          <list-sort name="department" />
          <div class="list__panels--content" v-for="item in compilationsDepartment" :key="item">
            <list-item :editable="isEditable(item)" :item="item" />
          </div>
          <div class="q-pa-lg flex flex-center" v-if="paginatorDepartmentTotal > 1">
            <q-pagination
              class="list__panels--paginator"
              v-model="paginatorDepartmentCurrent"
              :max="paginatorDepartmentTotal"
              :max-pages="6"
            />
          </div>
        </template>
        <template v-else>
          <loader v-if="loaderDepartment" />
          <list-empty v-else />
        </template>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import ListItem from 'components/Compilations/ListItem';
import ListEmpty from 'components/Compilations/ListEmpty';
import ListSort from 'components/Compilations/ListSort';
import Loader from 'components/Loading';
import { isEmpty } from 'lodash';

export default {
  name: 'CompilationList',
  components: {
    Loader,
    ListSort,
    ListEmpty,
    ListItem,
  },
  setup() {
    const store = useStore();
    const currentUser = computed(() => store.getters['compilations/getUser']);

    const compilationsAll = computed(() => store.getters['compilations/getCompilationsAll']);
    const compilationsDeal = computed(() => store.getters['compilations/getCompilationsDeal']);
    const compilationsManager = computed(
      () => store.getters['compilations/getCompilationsManager'],
    );
    const compilationsDepartment = computed(
      () => store.getters['compilations/getCompilationsDepartment'],
    );

    const paginatorAllCurrent = computed({
      get: () => store.getters['compilations/getPaginatorAllCurrent'],
      set: (page) => store.dispatch('compilations/updateCompilationsAll', { page }),
    });
    const paginatorAllTotal = computed(() => store.getters['compilations/getPaginatorAllTotal']);

    const paginatorDealCurrent = computed({
      get: () => store.getters['compilations/getPaginatorDealCurrent'],
      set: (page) => store.dispatch('compilations/updateCompilationsDeal', { page }),
    });
    const paginatorDealTotal = computed(() => store.getters['compilations/getPaginatorDealTotal']);

    const paginatorManagerCurrent = computed({
      get: () => store.getters['compilations/getPaginatorManagerCurrent'],
      set: (page) => store.dispatch('compilations/updateCompilationsManager', { page }),
    });
    const paginatorManagerTotal = computed(
      () => store.getters['compilations/getPaginatorManagerTotal'],
    );

    const paginatorDepartmentCurrent = computed({
      get: () => store.getters['compilations/getPaginatorDepartmentCurrent'],
      set: (page) => store.dispatch('compilations/updateCompilationsDepartment', { page }),
    });
    const paginatorDepartmentTotal = computed(
      () => store.getters['compilations/getPaginatorDepartmentTotal'],
    );

    const isShowAll = computed(
      () => store.getters['compilations/getUserPosition'] === 'superAdmin',
    );
    const isShowDepartment = computed(
      () => store.getters['compilations/getUserPosition'] === 'departmentHead',
    );
    const isShowDeal = computed(() => store.getters['compilations/isCreateCompilation']);

    const loaderManager = computed(() => store.getters['compilations/getLoaderManager']);
    const loaderDeal = computed(() => store.getters['compilations/getLoaderDeal']);
    const loaderAll = computed(() => store.getters['compilations/getLoaderAll']);
    const loaderDepartment = computed(() => store.getters['compilations/getLoaderDepartment']);

    return {
      compilationsAll,
      compilationsDeal,
      compilationsManager,
      compilationsDepartment,

      paginatorAllCurrent,
      paginatorAllTotal,
      paginatorDealCurrent,
      paginatorDealTotal,
      paginatorManagerCurrent,
      paginatorManagerTotal,
      paginatorDepartmentCurrent,
      paginatorDepartmentTotal,

      loaderManager,
      loaderDeal,
      loaderAll,
      loaderDepartment,

      isShowDeal,
      isShowAll,
      isShowDepartment,

      tab: ref('manager'),
      isEditable: (compilation) => compilation.status === 'Новая' && compilation.b24_manager_id === Number(currentUser.value.ID),
    };
  },
};
</script>

<style scoped lang="scss">
$tabsHeight: 80px;
.list {
  height: 100%;

  &__tabs {
    height: $tabsHeight;

    &--item {
    }
  }

  &__panels {
    height: calc(100% - #{$tabsHeight});
    &--item {
      position: relative;
      padding: 16px 0;
    }
    &--content {
    }
    &--paginator {
    }
  }
}
</style>
