<template>
  <div class="flat">
    <div class="flat__wrapper">
      <div class="flat__name">
        <p class="flat__name--title">Название объекта:</p>
        <p class="flat__name--text">{{ flat.type }} - {{ flat.square }} м²</p>
      </div>
      <div class="flat__description">
        <p class="flat__description--title">Описание</p>
        <q-input
          class="flat__description--text"
          v-model="description"
          filled
          autogrow
          :readonly="readonly"
        />
      </div>
      <div class="flat__footer">
        <q-btn @click="saveFlat" v-if="!readonly" color="secondary" style="width: 118px">
          <template v-if="loading">
            <q-spinner size="1em" :thickness="10" />
          </template>
          <template v-else>Сохранить</template>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { isEmpty } from 'lodash';

export default {
  name: 'FlatDetail',
  props: {
    flat: Object,
    readonly: Boolean,
  },
  setup() {
    const store = useStore();
    const description = computed({
      get: () => {
        const flat = store.getters['compilations/getFlatDetail'];
        return isEmpty(flat) ? '' : flat.description;
      },
      set: (value) => store.commit('compilations/SET_FLAT_DESCRIPTION', value),
    });
    const loading = ref(false);
    return {
      loading,
      description,
      saveFlat: async () => {
        loading.value = true;
        await store.dispatch('compilations/putFlat');
        store.commit('compilations/SET_FLAT_DETAIL_STATE', false);
        loading.value = false;
      },
    };
  },
};
</script>

<style scoped lang="scss">
.flat {
  &__wrapper {
    padding: 60px 20px 20px 20px;
  }

  &__name {
    &--title {
      font-size: 12px;
      font-weight: 800;
      color: #9a9a9a;
      margin: 0;
    }
    &--text {
      font-size: 21px;
    }
  }

  &__description {
    &--title {
      font-size: 12px;
      font-weight: 800;
      color: #9a9a9a;
    }
    &--text {
    }
  }

  &__footer {
    margin-top: 20px;
  }
}
</style>
