import {
	defineComponent,
	inject,
	onMounted,
	onUnmounted,
	reactive,
	ref,
	toRefs,
	getCurrentInstance,
} from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import dialogLogin from '@/components/DialogLogin/index.vue';
import dialogRegister from '@/components/DialogRegister/index.vue';
import background from "../_notepad/components/Background.vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import API from "@/api";
import moon from "@/store";

export default defineComponent({
	components: {
		background,dialogLogin,dialogRegister,UploadFilled
	},
	setup() {
		const Router = useRouter();
		const state: any = reactive({
			sufu:null,
			loginDialog: true,
			registerDialog: false,
			superior: '',
			packageList: [],
			portfolioList: [],
			userInfo: {}
		});
		// 登录
		const changeLoginDialog = (e: any) => {
			state['registerDialog'] = false
			state['loginDialog'] = e
		}

		// 注册
		const changeRegisterDialog = (e: any) => {
			state['loginDialog'] = false
			state['registerDialog'] = e
		}
		moon.watch('userInfo', (new_val: any)=>{
			state.userInfo = new_val
			state.superior = new_val.userName
			getPackages();
			getPortfolio()
		})
		onMounted(() => {

		});
		const getTouchStart = (value:any, type: string) => {
			clearTimeout(state.sufu);
			state.sufu=setTimeout(async function(){
				//  你要做的功能
				if (type === 'port') {
					await API.delPortfolio({
						uid: state.userInfo.userName,
						superior: `${state.superior}/${value.substring(value.lastIndexOf("/") + 1, value.length)}`
					})
					ElMessage({
						message: '删除目录成功',
						type: 'success',
					})
					getPortfolio()
				}
				if (type === 'pack') {
					await API.delPackages({
						uid: state.userInfo.userName,
						superior: `${state.superior}/${value.substring(value.lastIndexOf("/") + 1, value.length)}`
					})
					ElMessage({
						message: '删除文件成功',
						type: 'success',
					})
					getPackages();
				}
			}, 2000);
		}
		const getTouchEnd = () => {
			clearTimeout(state.sufu);
		}
		// 返回上一级
		const upperLevel =() => {
			const tem = state.superior.split('/')
			tem.pop()
			if (!tem.length) {
				ElMessage({
					message: '已经处于根目录位置',
					type: 'warning',
				})
				return
			}
			state.superior = tem.join('/')
			getPackages();
			getPortfolio()
		}
		//打开目录
		const openPortfolio = (e: any) => {
			state.superior = state.userInfo.userName + e.split(state.userInfo.userName)[1]
			getPackages();
			getPortfolio()
		}
		const openPackage = (e: any) => {
			window.open(e)
		}
		const setPortfolio = () => {
			ElMessageBox.prompt('请输入要新增的文件夹名称', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			  })
				.then(async ({ value }) => {
				  const { data } = await API.setPortfolio({
					uid: state.userInfo.userName,
					superior: `${state.superior}/${value}`
				  });
				  state.portfolioList.push(data)
				})
		}
		const getPortfolio = async () => {
			const { data } = await API.getPortfolio({
				uid: state.userInfo.userName,
				superior: state.superior
			});
			state.portfolioList = data
		}

		const getPackages = async () => {
			const { data } = await API.getPackages({
				uid: state.userInfo.userName,
				superior: state.superior
			});
			state.packageList = data
		};

		return {
			...toRefs(state),
			Router,changeLoginDialog,changeRegisterDialog,setPortfolio,openPortfolio,openPackage, getPackages,
			upperLevel,getTouchStart,getTouchEnd
		};
	},
});
