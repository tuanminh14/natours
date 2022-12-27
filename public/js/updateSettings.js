import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

export const updateUser = async function (data, type) {
  try {
    const res = await axios({
      method: 'patch',
      url: `${
        type === 'password'
          ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
          : 'http://127.0.0.1:3000/api/v1/users/updateMe'
      }`,
      data: data,
    });
    if (res.data.status === 'success') {
      showAlert(res.data.status, 'Updated succesfully');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
