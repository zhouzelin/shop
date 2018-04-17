Component({
  externalClasses: ['my-class'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    tips: {
      type: 'string',
      value: '下拉加载更多'
    }
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    // 这里是一个自定义方法
    scrolltolower(event) {
      //触发成功回调
      this.triggerEvent("scrolltolowerEvent")
    }
  }
})