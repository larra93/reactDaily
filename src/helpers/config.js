export const BASE_URL = 'https://laraveldaily-bybhdnaea7d6dmdm.eastus-01.azurewebsites.net/api'

export const getConfig = (token) => {
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    return config
}