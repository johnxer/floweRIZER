import axiosAPI from 'axios'

const axios = axiosAPI.create({
  baseURL: 'http://localhost:3000', // Replace URL
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axios
