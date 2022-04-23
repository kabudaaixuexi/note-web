import request from '@/utils/request'
export default {
    setPortfolio:async (payload: any) => {
        const { data } = await request({
            url: '/upload/setPortfolio',
            data: {...payload}
        })
        return data
    },
	getPortfolio:async (payload: any) => {
        const { data } = await request({
            url: '/upload/getPortfolio',
            data: {...payload}
        })
        return data
    },
	delPortfolio:async (payload: any) => {
        const { data } = await request({
            url: '/upload/delPortfolio',
            data: {...payload}
        })
        return data
    },
	setPackages:async (payload: any) => {
        const { data } = await request({
            url: '/upload/setPackages',
            data: {...payload}
        })
        return data
    },
	getPackages:async (payload: any) => {
		console.log(payload);

        const { data } = await request({
            url: '/upload/getPackages',
            data: {...payload}
        })
        return data
    },
	delPackages:async (payload: any) => {
        const { data } = await request({
            url: '/upload/delPackages',
            data: {...payload}
        })
        return data
    }
}
