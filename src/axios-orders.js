import axios from 'axios';

const instance = axios.create({ baseURL: 'https://burger-react-project-80d7c.firebaseio.com/'})

export default instance;