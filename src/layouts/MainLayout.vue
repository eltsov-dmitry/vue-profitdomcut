<template>
  <q-layout view="lHh Lpr lFf" ref="layout">
    <!-- HEADER -->
    <q-header>
      <q-toolbar>
        <q-tabs shrink stretch>
          <q-route-tab name="catalog" label="Шахматка" to="/" />
          <q-route-tab name="compilation" label="Подборки" to="/compilation" />
          <q-route-tab name="orders" v-if="isAdmin" label="Мои брони" to="/order" />
          <q-route-tab name="admin" label="Администрирование" v-if="isAdmin" to="/admin" />
        </q-tabs>
        <q-space />
        <div class="app-version">ProfitDom v1.3.0</div>
      </q-toolbar>
    </q-header>
    <!-- HEADER -->

    <!-- PAGES -->

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- PAGES -->

    <!-- DRAWER COMPILATION -->
    <q-drawer
      side="right"
      v-model="compilationMode"
      bordered
      class="bg-grey-1"
      :width="550"
      overlay
    >
      <div class="q-mini-drawer-hide absolute" style="top: 15px; left: -17px">
        <q-btn
          dense
          round
          unelevated
          color="yellow-9"
          icon="chevron_right"
          @click="compilationMode = false"
        />
      </div>
      <compilation-current />
    </q-drawer>
    <!-- DRAWER COMPILATION -->

    <!-- DRAWER FLAT PROPERTY -->
    <q-drawer
      side="right"
      v-model="flatPropertyMode"
      bordered
      class="bg-grey-1"
      :width="550"
      overlay
    >
      <dom-flat-detail />
    </q-drawer>
    <!-- DRAWER FLAT PROPERTY -->

    <q-drawer
      side="right"
      v-model="compilationDetailMode"
      bordered
      class="bg-grey-1"
      :width="550"
      overlay
    >
      <div class="q-mini-drawer-hide absolute" style="top: 15px; left: -17px">
        <q-btn
          dense
          round
          unelevated
          color="yellow-9"
          icon="chevron_right"
          @click="compilationDetailMode = false"
        />
      </div>

      <flat-detail :readonly="!isEditingCompilation" :flat="compilationDetail" />
    </q-drawer>
  </q-layout>
</template>

<script>
import {
  defineComponent, computed, watch, ref,
} from 'vue';
import { useStore } from 'vuex';
import { bxResizeWindow } from 'services/bx';
import { dom } from 'quasar';
import DomFlatDetail from 'components/DomFlatDetail';
import CompilationCurrent from 'components/Compilations/Current';
import FlatDetail from 'components/Compilations/FlatDetail';

export default defineComponent({
  name: 'MainLayout',
  components: {
    DomFlatDetail,
    CompilationCurrent,
    FlatDetail,
  },

  setup() {
    const store = useStore();
    window.dd = store;

    const isAdmin = computed({
      get: () => store.getters.isAdmin,
    });

    const compilationMode = computed({
      get: () => store.getters['compilations/isEditingMode'],
      set: (status) => store.commit('compilations/SET_EDITING_MODE', status),
    });
    const compilationDetailMode = computed({
      get: () => store.getters['compilations/getFlatDetailState'],
      set: (val) => store.commit('compilations/SET_FLAT_DETAIL_STATE', val),
    });
    const compilationDetail = computed({
      get: () => store.getters['compilations/getFlatDetail'],
      set: (val) => store.commit('compilations/SET_FLAT_DETAIL', val),
    });
    const isEditingCompilation = computed(() => store.getters['compilations/isEditingCompilation']);

    const flatPropertyMode = computed({
      get: () => store.getters['detail/isOpen'],
      set: (status) => store.dispatch('detail/open', status),
    });

    const flatPropertyWidth = computed({
      get: () => (compilationMode.value ? 450 : 500),
    });

    const layout = ref(null);

    watch(
      () => store.getters.isSized,
      async (status) => {
        const component = layout.value;
        if (status && component) {
          const height = dom.height(component.$el);
          const width = dom.width(component.$el);
          await bxResizeWindow(width, height);
        }
      },
    );

    return {
      isAdmin,
      compilationMode,
      flatPropertyMode,
      flatPropertyWidth,
      layout,
      compilationDetailMode,
      compilationDetail,
      isEditingCompilation,
    };
  },
});
</script>
