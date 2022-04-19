import { defineComponent, inject, onMounted, onUnmounted, reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import moon from '@/store'
import { filterUser } from '@/utils/tool'
import Api from '@/api';
// [
// 	{ value: "Root", password: "q", arturl: 'https://img0.baidu.com/it/u=2646185998,3900821575&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400'},
// 	{ value: "LixPabor", password: "currency123", arturl: 'https://himg.bdimg.com/sys/portrait/item/wise.1.34e37c47.mffK6OgXuMmfRzKuI7flGw.jpg?time=3667' },
// 	{ value: "Administrator", password: "currency123", arturl: 'https://img1.baidu.com/it/u=2626139180,1799659217&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400' },
// 	{ value: "Spare01", password: "currency123", arturl: 'https://img2.baidu.com/it/u=545361740,2471025881&fm=253&fmt=auto&app=138&f=JPEG?w=538&h=500' },
// 	{ value: "Spare02", password: "currency123", arturl: 'https://img1.baidu.com/it/u=2453887706,2673720703&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
// 	{ value: "灰太狼气球", password: "currency123", arturl: 'https://img2.baidu.com/it/u=247411357,1332972594&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
// 	{ value: "尤达大师", password: "currency123", arturl: 'https://img1.baidu.com/it/u=496025556,4148887618&fm=253&fmt=auto&app=138&f=JPEG?w=518&h=500' },
// 	{ value: "麻油百香果", password: "Fullstack123", arturl: 'https://img0.baidu.com/it/u=1135208145,2674949746&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500' },
// ]
export default defineComponent({
  name: 'dialogLogin',
  props: {
    dialogVisible: Boolean,
    changeLoginDialog: Function,
    changeRegister: Function
  },
  setup(props: any, context) {
    const state: any = reactive({
      value: null,
      password: null,
      restaurants: [],
    });
    const querySearch = (queryString: string, cb:any) => {
      const results = queryString
        ? state.restaurants.filter(createFilter(queryString))
        : state.restaurants
      cb(results)
    }
    const createFilter = (queryString: any) => {
      return (restaurant: any) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    }
    const chatLogin = async () => {
		if(!state.value || !state.password) {
			ElMessage({
				type:'error',
				message:"请确认昵称密码输入完整"
				})
				return
		}
		const { data } = await Api.postLogin({
			userName: state.value,
			passWord: state.password
		})
		moon.setState(data, 'userInfo')
		window.localStorage.setItem('userInfo', filterUser(data, 0) || '')
        props.changeLoginDialog(false)
    }
	const getUserList = async () => {
		const { data } = await Api.getUserList()
		state.restaurants = data.map((ev: any) => ({
			value: ev.userName,
			password: ev.passWord,
			arturl: ev.photo
		}))
	}
    onMounted(() => {
      if (window.localStorage.getItem('userInfo')) {
        moon.setState(filterUser(window.localStorage.getItem('userInfo'), 1), 'userInfo')
        props.changeLoginDialog(false)
      }
	  getUserList()
    })
    onUnmounted(() => {
    })
    return {
      ...toRefs(state),
      querySearch,chatLogin
    };
  }
});
