import { defineComponent } from "vue"
import styles from './css/Pagination.module.less'
export default defineComponent({
  props: {
    curData: {
      type: Object,
      required: true
    },
  },
  emits: ['setLoadFn'],
  setup(props, { emit }) {
    const pageChange = (val: number) => {
      if (val) emit('setLoadFn', val)
    }

    return {
      pageChange,
    }
  },

  render(props) {
    const { pageChange } = this
    return (
      <div class={styles.pageBox}>
        <van-pagination
          v-model={props.curData.current}
          total-items={props.curData.total}
          show-page-size={props.curData.showPageSize || 3}
          items-per-page={props.curData.pageSize || 5}
          force-ellipses
          onChange={pageChange}
        />
      </div>
    )
  }
})