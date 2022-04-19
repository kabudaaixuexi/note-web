import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  reactive,
  toRefs,
} from "vue";
import { ElMessage } from "element-plus";
import moon from "@/store";
import { filterUser } from "@/utils/tool";
import api from "@/api";

export default defineComponent({
  name: "dialogRegister",
  props: {
    dialogVisible: Boolean,
    changeRegisterDialog: Function,
    changeLogin: Function,
  },
  setup(props: any, context) {
    const ruleFormRef: any = ref();
    const state = reactive({
      ruleForm: {
        userName: "",
        passWord: "",
		photo: "",
        desc: "",
      },
      rules: {
        userName: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 12,
            message: "昵称长度不能超过12个字节",
            trigger: "blur",
          },
        ],
        passWord: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "change",
          },
        ],
        desc: [
          { required: true, message: "不妨夸自己两句～", trigger: "blur" },
        ],
      },
    });
    const handleExceed = (ev: { data: any; }) => {
        state.ruleForm.photo = ev.data
    }
    const chatRegister = async () => {
      await ruleFormRef.value.validate((valid: any, fields: any) => {
        if (valid) {
			const data: any = {
				...state.ruleForm,
				extData: JSON.stringify({
					desc: state.ruleForm.desc
				})
			}
			delete data.desc
			api.postRegister(data).then(res => {
				if(res.statusCode == 200) {
					ElMessage({
						type:'success',
						message:"注册成功"
					})
					moon.setState(data, 'userInfo')
					window.localStorage.setItem('userInfo', filterUser(data, 0) || '')
					state.ruleForm = {
						userName: "",
						passWord: "",
						photo: "",
						desc: "",
					}
					props.changeRegisterDialog(false)
				}
			})
        } else {
          console.log("error submit!", fields);
        }
      });
    };
    onMounted(() => {
    });
    onUnmounted(() => {});
    return {
      ...toRefs(state),
      ruleFormRef,handleExceed,
      chatRegister,
    };
  },
});
