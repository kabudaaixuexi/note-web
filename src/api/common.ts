import request from '@/utils/request'
export default {
    getPackages:async (payload: any) => {
        const { data } = await request({
            url: '/upload/getPackages',
            data: {...payload}
        })
        return data
    }
}
