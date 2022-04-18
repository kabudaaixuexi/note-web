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
import setup from './components/Setup.vue';
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

export default defineComponent({
  components: {
    background,dialogLogin,dialogRegister,weather,translate,setup,voice,fontStyle,uploadImg,user,skin
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
        removeRender()
        state.curNote = e;
        state.unlockValue = ''
        recoveryRender()
      }
    };
    // 删除编辑区
    const removeRender = () => {
        state.loading = ElLoading.service({
            lock: true,
            // text: 'Loading',
            background: 'rgba(0, 0, 0, 0.4)',
          })
        var self = document.querySelector(`.notepad_sidebar_cont`);
        var parent = document.querySelector(`.notepad_sidebar`);
        self && parent?.removeChild(self);
    }
    // 恢复编辑区
    const recoveryRender = () => {
        state.loading?.close()
        state.loading = null
        console.log('恢复编辑区恢复编辑区');
        var parent = document.querySelector(`.notepad_sidebar`);
        console.log(parent,'parent');
        const newVNode = state.curNote ? state.curNote.vNode : creatEmptyVNode()
        console.log(newVNode,'newVNode');
        newVNode._data.contenteditable = !state.curNote?.lock
        parent?.appendChild(parse(newVNode))
        listeners()
    }
    // 修改编辑区域
    const changeStyle = (data: { command: any; value?: any; }) => {
        console.log(data);
        data.value
        ? document.execCommand(data.command, false, data.value)
        : document.execCommand(data.command, false, '');
    };

    // 获取笔记列表
    const getNoteList = async (cb: Function = () => {}) => {
        const { data } = await API.getNoteList({
            uid: moon.getState('userInfo').uid
        })
        // console.log(data);
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
                uid: moon.getState('userInfo').uid,
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
        } else {
            ElMessage({
                type:'error',
                message: '密码错误，修正后再次确认'
            })
        }
    }
    const changeEncryptionSuccess = async (e: any, ev = state.curNote.lockValue) => {
        removeRender()
        state.curNote.lock = e
        await API.editNote({
            uid: moon.getState('userInfo').uid,
            noteid: state.curNote.noteid,
            subtitle: state.curNote.subtitle,
            vNode:state.curNote.vNode,
            lockValue: ev,
            lock: e,
        })
        getNoteList(() => {
            state.curNote = state.noteList.filter((i: { noteid: any; }) => i.noteid == state.curNote.noteid)[0] || null
            recoveryRender()
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
        } else {
            state.unlockTitle = '解锁笔记'
            state.unlockVisible = true
        }
    }
    // 点击上传添加图片
    const handleExceed = (ev: { data: any; }) => {
        !sessionStorage.getItem('count') && sessionStorage.setItem('count','1')
        var self = document.querySelector(`.notepad_sidebar_cont`);
        sessionStorage.getItem('count') == '1' && changeStyle({
            command: 'insertImage',
            value: `${ev.data}`
        })
        // 添加点击事件
        repaintImg(self)
        sessionStorage.setItem('count','2')
        setTimeout(()=> {
            sessionStorage.setItem('count','1')
        })
    }
    // 搜索笔记
    const f = (list: any, queryString: string) => {
        const temList = JSON.parse(JSON.stringify(list))
        return temList.map((item: { content: any; vNode: any; value: string; subtitle: string; }) => {
            item.content = []
            const getValue = (children: { _value: any; children: any[]; }) => {
                if (children._value) {
                    item.content.push(children._value)
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
        }, 3000 * Math.random())
      }
      
    const handleSelect = (item: any) => {
        noteChange(state.noteList.filter((i: any)=> i.noteid == item.noteid)[0])
    }
    // 修改笔记标题
    const subtitleChange = async (ev: any) => {
        state.disabled = true
        await API.editNote({
            uid: moon.getState('userInfo').uid,
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
        if (!state.curNote) return
        await API.editNote({
            uid: moon.getState('userInfo').uid,
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
        removeRender()
        const { data } = await API.addNote({
            uid: moon.getState('userInfo').uid,
            vNode: creatEmptyVNode(),
            subtitle: '',
            lockValue: '',
            lock: false
        })
        getNoteList(() => {
            state.curNote = state.noteList[0] || null
            recoveryRender()
        })
    }
    // 删除笔记
    const removeNote = async () => {
        removeRender()
        if (!state.curNote) return
        const { data } = await API.removeNote({
            uid: moon.getState('userInfo').uid,
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
            recoveryRender()
        })
    }
    // 监听修改
    const listeners = () => {
        console.log('添加一些监听事件');
        const EditedDom = document.querySelector(`.notepad_sidebar_cont`);
        EditedDom?.addEventListener("input", debounce((ev: any) => {
          editNote(getVNode(ev.target));
        }, 300, false)
        );
        repaintImg(EditedDom)
        listenerDrop(EditedDom);
        listenerDrag();
    }
    // 监听键盘
    const ipcRendererListeners = () => {
        document.onkeydown = async e => {
            if (e.repeat) {
              return
            }
            if (e.code === 'KeyC' && e.metaKey) { 
                console.log('CommandOrControl+C')
                changeStyle({
                    command: 'copy'
                })
            }
            if (e.code === 'KeyV' && e.metaKey) { 
                console.log('CommandOrControl+V')
                const text = await window.navigator.clipboard.readText()
                if (moon.getState('choice') === '粘贴全部信息') {
                    changeStyle({
                        command: 'paste'
                    }) 
                } else {
                    await window.navigator.clipboard.writeText(text)
                    changeStyle({
                        command: 'paste'
                    }) 
                }
            }
            if (e.code === 'KeyX' && e.metaKey) { 
                console.log('CommandOrControl+X')
                changeStyle({
                    command: 'cut'
                })
            }
            if (e.code === 'KeyA' && e.metaKey) { 
                console.log('CommandOrControl+A')
                changeStyle({
                    command: 'selectAll'
                })
            }
            if (e.code === 'KeyZ' && e.metaKey) { 
                console.log('CommandOrControl+Z')
                changeStyle({
                    command: 'undo'
                })
            }
            if (e.code === 'KeyP' && e.metaKey) { 
                console.log('CommandOrControl+P')
                if (window.getSelection()?.toString()) {
                    // ElNotification({
                    //     title: '查询信息',
                    //     message: `${window.getSelection()?.toString()}`,
                    // })
                    const Exp = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
                    const url = Exp.test((window.getSelection() as any).toString()) ? window.getSelection()?.toString() : `https://www.baidu.com/s?wd=${window.getSelection()?.toString()}`
                    window.open(url)
                }
            }
          }
    }
    moon.watch('userInfo', (new_val: any)=>{
      state.userInfo = new_val
      removeRender()
      setTimeout(() => {
          if (moon.getState('userInfo')) {
              getNoteList(()=>{
                  state.curNote = state.noteList[0] || null
                  recoveryRender()
               })
          } else {
              recoveryRender()
          }
      })
    })
    onMounted(() => {
      moon.watch('themeStyle', (ne: any) => (state.themeStyle = ne))
      ipcRendererListeners()
    });
    onUnmounted(() => {
        window.removeEventListener('keyup',()=>{})
    });
    // 登录
    const changeLoginDialog = (e: any) => {
        state['registerDialog'] = false
        state['loginDialog'] = e
    }
    const unLogin = () => {
        moon.setState(null,'userInfo')
        state['loginDialog'] = true
    }
    // 注册
    const changeRegisterDialog = (e: any) => {
        state['loginDialog'] = false
        state['registerDialog'] = e
    }
    // 看一眼密码
    const concealClick = () => {
        ElMessage({
            message: `密码是 ${state.curNote.lockValue} ，别再忘了`,
            type: 'warning',
        })
    }
    return {
      ...toRefs(state),
      noteChange,
      changeStyle,
      unLogin,unlockChange,handleSelect,querySearchAsync,layoutChange,handleExceed,changeLoginDialog,changeRegisterDialog,addNote,removeNote,subtitleChange,preEditSubtitle,changeEncryption,concealClick,
      fontNames,fontSizes
    };
  },
});
