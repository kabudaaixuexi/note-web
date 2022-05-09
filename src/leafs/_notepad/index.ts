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
import dialogLogin from '@/components/DialogLogin/index.vue';
import dialogRegister from '@/components/DialogRegister/index.vue';
import background from './components/Background.vue';
import translate from './components/Translate.vue';
import weather from './components/Weather.vue';
import skin from './components/Skin.vue';
import voice from './components/Voice.vue';
import uploadImg from './components/UploadImg.vue';
import fontStyle from './components/FontStyle.vue';
import user from './components/User.vue';
import { useRouter } from "vue-router";
import { ElMessage, ElLoading, ElNotification } from 'element-plus'
import { listenerDrag, listenerDrop, getVNode, parse,creatEmptyVNode,repaintImg } from "./util";
import { fontNames, fontSizes } from "./config"
import { debounce } from '@/utils/tool'
import API from '@/api'
import moon from "@/store";
import foundEdit from 'xs-editor'

export default defineComponent({
  components: {
    background,dialogLogin,dialogRegister,weather,translate,voice,fontStyle,uploadImg,user,skin
  },
  setup() {
    const Router = useRouter();
    const state: any = reactive({
        unlockTitle:'',
        unlockValue:'',
        unlockVisible:false,
      input:'',
      layoutType: 2,
      disabled: true,
      loginDialog: true,
      registerDialog: false,
      noteList: [],
      curNote: null,
      themeStyle: moon.getState('themeStyle'),
      userInfo: null,
      loading: null
    });
    // 修改布局方式
    const layoutChange = (layoutType: number) => {
        state.layoutType = layoutType
    }
    // 左侧切换
    const noteChange = (e: any) => {
      if (state.curNote.noteid != e.noteid) {
        state.curNote = e;
		console.log(e,'eee');

		foundXsEditor(e.vNode, !e.lock)
        state.unlockValue = ''
      }
    };
    // 获取笔记列表
    const getNoteList = async (cb: Function = () => {}) => {
        const { data } = await API.getNoteList({
            uid: moon.getState('userInfo').userName
        })
        state.noteList = data
        cb ()
    }
    // 准备修改笔记标题
    const preEditSubtitle = () => {
        state.disabled = false
    }

    // 修改笔记加密状态
    const unlockChange = async () => {
        // 没有设置密码的加密
        if (!state.curNote?.lockValue) {
            changeEncryptionSuccess(true, state.unlockValue)
            await API.editNote({
                uid: moon.getState('userInfo').userName,
                noteid: state.curNote.noteid,
                subtitle: state.curNote.subtitle,
                vNode: state.curNote.vNode,
                lock: state.curNote.lock,
                lockValue: state.unlockValue
            })
            ElMessage({
                message: '笔记设置密码成功，不要忘记密码哦～',
                type: 'success',
            })
            state.unlockVisible = false
			foundXsEditor(state.curNote.vNode, false)
            return
        }
        // 设置过的走校验
        if (state.curNote.lockValue && state.unlockValue == state.curNote.lockValue) {
            await changeEncryptionSuccess(false)
            ElMessage({
                message: '笔记已解密，可以开始编辑',
                type: 'success',
            })
            state.unlockVisible = false
			foundXsEditor(state.curNote.vNode)
        } else {
            ElMessage({
                type:'error',
                message: '密码错误，修正后再次确认'
            })
        }
    }
    const changeEncryptionSuccess = async (e: any, ev = state.curNote.lockValue) => {
        state.curNote.lock = e
        await API.editNote({
            uid: moon.getState('userInfo').userName,
            noteid: state.curNote.noteid,
            subtitle: state.curNote.subtitle,
            vNode:state.curNote.vNode,
            lockValue: ev,
            lock: e,
        })
    }
    const changeEncryption = async (e: any) => {
        // 第一次设置密码
        if (!state.curNote.lockValue) {
            state.unlockTitle = '笔记加密'
            state.unlockVisible = true
            return
        }
        // 加密
        if (e) {
            await changeEncryptionSuccess(e)
            ElMessage({
                message: '笔记已加密,不可被编辑',
                type: 'warning',
            })
			foundXsEditor(state.curNote.vNode, false)
        } else {
            state.unlockTitle = '解锁笔记'
            state.unlockVisible = true
        }
    }

    // 搜索笔记
    const f = (list: any, queryString: string) => {
        const temList = JSON.parse(JSON.stringify(list))
        return temList.map((item: { content: any; vNode: any; value: string; subtitle: string; }) => {
            item.content = []
            const getValue = (children: { xs_value: any; children: any[]; }) => {
                if (children.xs_value) {
                    item.content.push(children.xs_value)
                }
                if (children.children) {
                   children.children.map(i => {
                        getValue(i)
                   })
                }
            }
            getValue(item.vNode)
            item.value = queryString
            const temB = item.content.join(',')
            const temC = item.content.filter((i: string | string[]) => {
                return i.indexOf(queryString) !== -1
            }).join(',')
            item.content = temC ? `<span>${temC.replace(queryString,`<spa style="color:red">${queryString}</spa>`)}</span>` : temB
            if (queryString && item.subtitle.indexOf(queryString) !== -1) {
                item.subtitle = `<spa>${item.subtitle.replace(queryString,`<spa style="color:red">${queryString}</spa>`)}</spa>`
            } else {
                item.subtitle = item.subtitle || '未设置标题'
            }
            return item
        }).filter((i: { content: string | string[]; subtitle: string | string[]; }) => i.content.indexOf('<spa') !== -1 || i.subtitle.indexOf('<spa>') !== -1)
    }

    let timeout:NodeJS.Timeout
    const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(f(state.noteList, queryString))
        }, 2000 * Math.random())
      }

    const handleSelect = (item: any) => {
        noteChange(state.noteList.filter((i: any)=> i.noteid == item.noteid)[0])
    }
    // 修改笔记标题
    const subtitleChange = async (ev: any) => {
        state.disabled = true
        await API.editNote({
            uid: moon.getState('userInfo').userName,
            noteid: state.curNote.noteid,
            subtitle: ev,
            vNode: state.curNote.vNode,
            lockValue: state.curNote.lockValue,
            lock: state.curNote.lock,
        })
        getNoteList()
    }
    // 修改笔记实时保存
    const editNote = async (ev: any) => {
        if (!state.curNote) {
			ElMessage({
				message: `您应该先创建一篇笔记`,
				type: 'warning',
			})
			return
		}
        await API.editNote({
            uid: moon.getState('userInfo').userName,
            noteid: state.curNote.noteid,
            subtitle: state.curNote.subtitle,
            vNode: ev,
            lock: state.curNote.lock,
            lockValue: state.curNote.lockValue,
        })
        getNoteList(() => {
            state.curNote = state.noteList.filter((i: any) => i.noteid == state.curNote.noteid)[0] || null
        })
    }
    // 新增笔记
    const addNote = async () => {
        await API.addNote({
            uid: moon.getState('userInfo').userName,
            vNode: creatEmptyVNode(),
            subtitle: '',
            lockValue: '',
            lock: false
        })
        getNoteList(() => {
            state.curNote = state.noteList[0] || null
            foundXsEditor(state.curNote.vNode)
        })
    }
    // 删除笔记
    const removeNote = async () => {
        if (!state.curNote) return
        await API.removeNote({
            uid: moon.getState('userInfo').userName,
            noteid: state.curNote.noteid,
        })
        let index = 0
        state.noteList.map((i: any, ind: any) => {
            if (state.curNote.noteid == i.noteid) {
                index = ind == 0 ? 1 : ind
            }
        })
        getNoteList(() => {
            state.curNote = state.noteList[index - 1] || null
            foundXsEditor(state.curNote.vNode)
        })
    }

    moon.watch('userInfo', (newest: any)=>{
      state.userInfo = newest
	  setTimeout(() => {
		if (moon.getState('userInfo')) {
			getNoteList(()=>{
				state.curNote = state.noteList[0] || null
				foundXsEditor(state.curNote.vNode, !state.curNote.lock)
			})
		} else {
			foundXsEditor()
		}
	  })
    })
	const foundXsEditor = (value: any = null, operable: Boolean = true) => {
		foundEdit(document.querySelector('#xs-editor-note'), {
			value,
			operable,
			watermark: state.userInfo ? state.userInfo.userName : null,
			upFileUrl: 'http://124.220.16.124:8099/upload/setFilesNote',
			onChange: (vm: Element, vn:any) => {
				editNote(vn)
			}
		}, () => {
			listenerDrag()
		})
	}
	moon.watch('themeStyle', (ne: any) => (state.themeStyle = ne))
    onMounted(() => {

    });
    onUnmounted(() => {
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
	const unLogin = () => {
        moon.setState(null,'userInfo')
        state['loginDialog'] = true
    }
    // 看一眼密码
    const concealClick = () => {
        ElMessage({
            message: `密码是 ${state.curNote.lockValue} ，别再忘了`,
            type: 'warning',
        })
    }
    return {
      ...toRefs(state),Router,
      noteChange,
      unLogin,unlockChange,handleSelect,querySearchAsync,layoutChange,changeLoginDialog,changeRegisterDialog,addNote,removeNote,subtitleChange,preEditSubtitle,changeEncryption,concealClick,
      fontNames,fontSizes
    };
  },
});
