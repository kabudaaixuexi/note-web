import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
const serves = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8099' : 'http://124.220.16.124:8099',
//   baseURL: process.env.NODE_ENV === 'development' ? 'http://124.220.16.124:8099' : 'http://124.220.16.124:8099',
  method: 'post',
  timeout: 5000
})
let loadingInstance = null
// 设置请求发送之前的拦截器
serves.interceptors.request.use(config => {
  // 设置发送之前数据需要做什么处理
  // loadingInstance = ElLoading.service({
  //   text: '加载中'
  // })
  return config
}, err => Promise.reject(err))

// 设置请求接受拦截器
serves.interceptors.response.use(res => {
  // 设置接受数据之后，做什么处理
  // loadingInstance.close()
  if (res.data.statusCode !== 200) {
	  console.log(res);

    ElMessage.error(res.data.message)
  }
  return res
}, err => {
  // 判断请求异常信息中是否含有超时timeout字符串
  if (err.message.includes('timeout')) {
    console.log('错误回调', err)
    ElMessage.error('网络超时')
  }
  if (err.message.includes('Network Error')) {
    console.log('错误回调', err)
    ElMessage.error('服务端未启动，或网络连接错误')
  }
  return Promise.reject(err)
})

// 将serves抛出去
export default serves
