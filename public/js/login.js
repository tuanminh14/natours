/*eslint-disable*/
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async function (email, password) {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert(res.data.status, 'Logged in succesfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async function () {
  try {
    const res = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.assign('/login');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
