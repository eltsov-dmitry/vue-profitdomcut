<template>
  <router-view />
</template>
<script>
import { defineComponent, onBeforeMount, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'App',
  setup() {
    const quasar = useQuasar();
    const store = useStore();

    quasar.loading.show({
      delay: 300,
    });

    const unwatch = store.watch(
      (state) => state.loaded,
      (status) => {
        if (status) {
          quasar.loading.hide();
          unwatch();
        }
      }
    );

    onBeforeMount(async () => {
      const priceTypes = await getPriceTypes();
      store.dispatch('detail/setPriceTypes', priceTypes);

      const complexOptions = await getComplexes();
      store.dispatch('filter/setComplexOptions', complexOptions);
      store.commit('setLoaded', true);

      await store.dispatch('admin');
      await store.dispatch('updateUserCurrent');
      await store.dispatch('updateFrameSizes');
      await store.dispatch('compilations/updateCompilations');

    });

    return {};
  },
});
</script>
