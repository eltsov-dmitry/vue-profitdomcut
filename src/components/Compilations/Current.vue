<template>
  <current-empty v-if="isEmptyCompilation(current)" />
  <div v-else class="current">
    <div class="current__header" :style="{ gridTemplateColumns: headerTemplateColumns() }">
      <div class="current__header--info">
        <div class="current__header--status">
          <q-avatar :color="getColorStatus(current.status)" size="13px">
            <q-tooltip :class="`bg-${getColorStatus(current.status)}`">
              <span style="white-space: nowrap">{{ current.status }}</span>
            </q-tooltip>
          </q-avatar>
        </div>
        <div class="current__header--description">
          <div class="current__header--label">{{ current.name }}</div>
          <div class="current__header--manager">{{ current.position }}: {{ current.manager }}</div>
          <div class="current__header--date">{{ getFormatDate(current.create_at) }}</div>
        </div>
      </div>
      <div class="current__header--buttons">
        <template v-if="isEditable(current)">
          <router-link
            v-if="compilationMode"
            class="current__header--link current__header--link-secondary"
            to="/compilation"
          >
            К подборке
          </router-link>
          <q-btn color="secondary" v-else @click="finishEditable(current)" style="width: 254px">
            <template v-if="loading">
              <q-spinner size="1em" :thickness="10" />
            </template>
            <template v-else>Завершить редактирование</template>
          </q-btn>
        </template>
        <template v-else>
          <a
            class="current__header--link current__header--link-warning"
            :href="getDealLink(current.b24_deal_id)"
            target="_blank"
          >
            Открыть сделку
          </a>
          <q-btn
            color="primary"
            class="current__header--button"
            label="Открыть подборку"
            @click="shareDialogState = true"
          />
        </template>
      </div>
    </div>

    <div class="current__content">
      <q-list>
        <template v-for="item in current.items" :key="item">
          <q-item clickable v-ripple>
            <current-item :editable="isEditable(current)" :item="item" />
          </q-item>
        </template>
      </q-list>
    </div>
  </div>
  <share-dialog v-model="shareDialogState" :link="getCompilationLink(current.uid)" />
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import moment from 'moment';
import CurrentItem from 'components/Compilations/CurrentItem';
import { isEmpty } from 'lodash';
import CurrentEmpty from 'components/Compilations/CurrentEmpty';
import ShareDialog from 'components/Compilations/ShareDialog';
import { getCompilationURL } from 'services/compilation';

export default {
  name: 'CompilationCurrent',
  components: {
    ShareDialog,
    CurrentEmpty,
    CurrentItem,
  },
  setup() {
    const store = useStore();
    const current = computed(() => store.getters['compilations/getCompilationCurrent']);
    const currentUser = computed(() => store.getters['compilations/getUser']);
    const compilationMode = computed({
      get: () => store.getters['compilations/isEditingMode'],
      set: (status) => store.commit('compilations/SET_EDITING_MODE', status),
    });

    const compilationDetail = computed({
      get: () => store.getters['compilations/getFlatDetail'],
      set: (val) => store.commit('compilations/SET_FLAT_DETAIL', val),
    });

    const loading = ref(false);

    return {
      compilationMode,
      compilationDetail,
      current,
      loading,
      headerTemplateColumns: () => (compilationMode.value ? 'calc(100% - 180px) 180px' : 'calc(100% - 355px) 355px'),

      getFormatDate: (date) => moment(date).format('D.MM.YY'),
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
      getDealLink: (id) => `https://b24.72dom.com/crm/deal/details/${id}/`,
      getCompilationLink: (id) => `${getCompilationURL()}/${id}`,
      isEditable: (compilation) => compilation.status === 'Новая'
        && compilation.b24_manager_id === Number(currentUser.value.ID),
      isEmptyCompilation: (compilation) => isEmpty(compilation),
      shareDialogState: ref(false),
      finishEditable: async (offer) => {
        loading.value = true;
        await store.dispatch('compilations/putCompilationStatus', offer);
        loading.value = false;
      },
    };
  },
};
</script>

<style scoped lang="scss">
$headerHeight: 80px;

.current {
  height: 100%;
  padding: 0 10px;
  &__header {
    display: grid;
    //grid-template-columns: calc(100% - 355px) 355px;
    gap: 15px;
    min-height: 80px;
    padding: 15px 16px;
    box-shadow: 0px 11px 8px -12px rgba(34, 60, 80, 0.1);
    &--info {
      display: grid;
      grid-template-columns: 13px calc(100% - 28px);
      gap: 15px;
      align-items: center;
    }

    &--status {
    }
    &--description {
    }
    &--buttons {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      //margin: 0 -10px;
    }

    &--button {
      width: 165px;
      height: 30px;
      font-size: 0.9em;
      margin: 0 10px;
    }
    &--link {
      width: 165px;
      min-height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 0;
      white-space: nowrap;
      text-transform: uppercase;
      border-radius: 3px;
      background-color: #ccc;
      color: #fff;
      transition: 0.3s all ease;
      text-decoration: none;
      font-size: 0.9em;

      &-secondary {
        $color: #26a69a;
        background-color: $color;
        &:hover {
          background-color: lighten($color, $amount: 5%);
        }
      }

      &-warning {
        $color: #ffb42b;
        background-color: $color;
        &:hover {
          background-color: lighten($color, $amount: 5%);
        }
      }
    }

    &--label {
      font-size: 1.1em;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &--manager,
    &--date {
      color: rgba(0, 0, 0, 0.54);
      font-size: 0.8em;
    }
  }

  &__content {
    height: calc(100% - #{$headerHeight});
    overflow: auto;
  }
}
</style>
