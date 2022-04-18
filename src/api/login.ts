// 仅示例
import request from '@/utils/sqlRequest'
import {getNoteListReq,addNoteReq,editNoteReq,removeNoteReq } from './type'

export default {
  /** 获取笔记列表 */
  getNoteList:async (payload:getNoteListReq) => {
      const { data } = await request({
          url: '/note/getNoteList',
          data: {...payload}
      })
      return data
  },
  /** 添加笔记 */
  addNote: async (payload:addNoteReq) => {
      const { data } = await request({
          url: '/note/addNote',
          data: {...payload}
      })
      return data
  }
} 