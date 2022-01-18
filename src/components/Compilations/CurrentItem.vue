<template>
  <div class="current__content--item">
    <div class="current__content--image">
      <q-img
        :src="getItemImage(item.images)"
        loading="lazy"
        width="50px"
        height="50px"
        spinner-color="white"
      >
        <template v-slot:error>
          <q-icon name="collections" size="50px" class="text-grey"/>
        </template>
      </q-img>
    </div>
    <div class="current__content--description">
      <div class="current__content--description-item">
        <div class="current__content--description-title">Объект</div>
        <div class="current__content--description-caption">{{ item.complex }}</div>
      </div>
      <div class="current__content--description-item">
        <div class="current__content--description-title">Дом</div>
        <div class="current__content--description-caption">{{ item.house }}</div>
      </div>
      <div class="current__content--description-item">
        <div class="current__content--description-title">Артикул</div>
        <div class="current__content--description-caption">{{ item.article }}</div>
      </div>
      <div class="current__content--description-item">
        <div class="current__content--description-title">Площадь</div>
        <div class="current__content--description-caption">{{ item.square }}</div>
      </div>
      <div class="current__content--description-item">
        <div class="current__content--description-title">Подъезд</div>
        <div class="current__content--description-caption">{{ item.entrance }}</div>
      </div>
    </div>
    <div class="current__content--remove" v-if="editable">
      <q-btn round color="primary" icon="create" flat size="10px" @click="editItem(item)">
        <q-tooltip class="bg-primary">Редактировать</q-tooltip>
      </q-btn>
      <q-btn round color="negative" icon="close" flat size="10px" @click="deleteState = true">
        <q-tooltip class="bg-negative">Удалить</q-tooltip>
      </q-btn>
    </div>
  </div>

  <delete-dialog placement="current" :item="item" v-model="deleteState"/>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import DeleteDialog from 'components/Compilations/DeleteDialog';

export default {
  name: 'CurrentItem',
  components: { DeleteDialog },
  props: {
    item: Object,
    editable: Boolean,
  },
  setup() {
    const store = useStore();
    const deleteState = ref(false);
    const compilationDetailMode = computed({
      get: () => store.getters['compilations/getFlatDetailState'],
      set: (val) => store.commit('compilations/SET_FLAT_DETAIL_STATE', val),
    });
    const compilationDetail = computed({
      get: () => store.getters['compilations/getFlatDetail'],
      set: (val) => store.commit('compilations/SET_FLAT_DETAIL', val),
    });
    return {
      deleteState,
      getItemImage: (images) => {
        if (images.length) {
          return images[0].preview ?? images[0];
        }
        return 'https://cdn.quasar.dev/img/non-existent-image-src.png';
      },
      editItem: (flat) => {
        compilationDetailMode.value = false;
        compilationDetail.value = {};
        setTimeout(() => {
          compilationDetailMode.value = true;
          compilationDetail.value = flat;
        }, 100);
      },
      deleteItem: (item) => {
        store.dispatch('compilations/deleteCompilationItem', item);
      },
    };
  },
};
</script>

<style scoped lang="scss">
.current__content {
  &--item {
    width: 100%;
    display: grid;
    align-items: center;
    grid-template-columns: 50px 1fr 60px;
    padding: 10px 0;
    gap: 10px;
  }
  &--image {
  }
  &--description {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding-left: 10px;
    &-item {
    }
    &-title {
      font-size: 1.0em;
      margin-bottom: 3px;
    }
    &-caption {
      color: rgba(0, 0, 0, 0.54);
      font-size: 0.9em;
    }
  }
  &--remove {
    display: flex;
    justify-content: space-between;
  }
}
</style>
