<template>
  <div class="compilations" :style="heightWindow">
    <div class="compilations__list">
      <list />
    </div>
    <div class="compilations__current" :style="heightWindow">
      <current />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import List from 'components/Compilations/List';
import Current from 'components/Compilations/Current';

export default defineComponent({
  name: 'PageCompilation',
  components: {
    Current,
    List,
  },
  setup() {
    const store = useStore();
    const heightWindow = computed(() => ({
      height: `${store.getters.getFrameSizes.height - 50}px`,
    }));
    return {
      heightWindow,
    };
  },
});
</script>

<style scoped lang="scss">
$listWith: 400px;
.compilations {
  display: flex;
  &__list {
    width: $listWith;
  }
  &__current {
    width: calc(100% - #{$listWith});
  }
}
</style>
