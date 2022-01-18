<template>
  {{  }}
  <div :class="['list-item', isActive(item) && 'active']">
    <div class="list-item--click" @click="setCompilationCurrent(item)">
      <div class="list-item--status">
        <q-avatar :color="getColorStatus(item.status)" size="13px">
          <q-tooltip :class="`bg-${getColorStatus(item.status)}`">
            <span style="white-space: nowrap">{{ item.status }}</span>
          </q-tooltip>
        </q-avatar>
      </div>
      <div class="list-item--description">
        <div class="list-item--name">
          <div class="list-item--label">
            {{ item.name }}
            <q-tooltip>
              <span style="white-space: nowrap">{{ item.name }}</span>
            </q-tooltip>
          </div>
          <div class="list-item--manager">{{ item.position }}: {{ item.manager }}</div>
        </div>
        <div class="list-item--date">{{ getFormatDate(item.create_at) }}</div>
      </div>
    </div>

    <div class="list-item--remove" v-if="editable">
      <q-btn round color="negative" icon="close" flat size="10px" @click="deleteState = true">
        <q-tooltip class="bg-negative">Удалить</q-tooltip>
      </q-btn>
    </div>
  </div>

  <delete-dialog placement="list" :item="item" v-model="deleteState" />
</template>

<script>
import moment from 'moment';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import DeleteDialog from 'components/Compilations/DeleteDialog';

export default {
  name: 'ListItem',
  components: { DeleteDialog },
  props: {
    item: Object,
    editable: Boolean,
  },
  setup(props) {
    const store = useStore();
    const isCreateCompilation = computed(() => store.getters['compilations/isCreateCompilation']);
    const compilationCurrent = computed(() => store.getters['compilations/getCompilationCurrent']);
    const deleteState = ref(false);
    return {
      deleteState,
      isCreateCompilation,
      getColorStatus: (status) => {
        switch (status) {
          case 'Новая':
            return 'positive';
          case 'Отправлена клиенту':
            return 'info';
          case 'Посмотрена клиентом':
            return 'warning';
          default:
            return '';
        }
      },
      getFormatDate: (date) => moment(date).format('DD.MM.YY'),
      setCompilationCurrent(item) {
        store.commit('compilations/SET_COMPILATION_CURRENT', item);
        store.commit('compilations/SET_FLAT_DETAIL_STATE', false);
        store.commit('compilations/SET_FLAT_DETAIL', {});
      },
      isActive: (item) => compilationCurrent.value.id === item.id,
    };
  },
};
</script>

<style scoped lang="scss">
$dateWidth: 47px;
.list-item {
  display: grid;
  grid-template-columns: 1fr 30px;
  align-items: center;
  padding: 15px 7px 15px 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  &.active{
    background-color: darken(#fff, 5%);
  }
  &:hover {
    background-color: darken(#fff, 10%);
  }
  &--click {
    display: flex;
    align-items: center;
  }
  &--status {
  }
  &--description {
    width: calc(100% - 23px);
    padding: 0 10px;
    display: flex;
  }
  &--name {
    width: calc(100% - #{$dateWidth});
    padding: 0 5px;
  }
  &--date {
    width: #{$dateWidth};
    font-size: 12px;
    color: rgba(0, 0, 0, 0.54);
  }
  &--label {
    line-height: 120%;
    font-size: 1.1em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  &--manager {
    font-size: 12px;
    margin-top: 5px;
    color: rgba(0, 0, 0, 0.54);
  }

  &--remove {
  }
}
</style>
