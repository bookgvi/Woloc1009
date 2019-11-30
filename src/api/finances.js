import api from './instance'
const API_URL = process.env.API_CABINET_URL
export default {
  getAll: async (page, filter) => {
    try {
      const r = await api.get(`${API_URL}/finances`, {
        params: {
          page,
          ...filter
        }
      })
      return r.data
    } catch (e) {
      console.warn('catch :: finances :: getAll', e)
    }
  },
  withdraw: async _ => {
    try {
      await api.post(`${API_URL}/finances/withdrawal`)
    } catch (e) {
      console.warn('catch :: finances :: withdraw', e.message)
    }
  },
  dashboardFinances: async (payload) => {
    const { date } = payload
    try {
      const r = await api.get(`${API_URL}/dashboard/finances`, {
        params: {
          date
        }
      })
      return r.data
    } catch (e) {
      console.warn('catch :: finances :: dashboard/finances', e)
    }
  }
}
