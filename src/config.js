import { getAll, get, set, remove } from './utils/opration'

module.exports = async function (action, key, value) {
    switch(action) {
        case 'get':
            const val = await get(key)
            console.log(val)
            break;
        case 'set':
            set(key, value)
            break;
        case 'remove':
            remove(key)
            break;
        case 'list':
            const config = await getAll()
            Object.keys(config).forEach(key => {
                console.log(`${key}=${config[key]}`)
            })
            break;
    }
}