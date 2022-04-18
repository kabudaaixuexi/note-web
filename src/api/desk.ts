import request from '@/utils/request'
export default {
    getDeskImgList:async (payload: any) => {
        const { data } = await request({
            url: '/upload/getFiles',
            data: {...payload}
        })
        return data
    }
} 