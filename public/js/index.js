import { login, logout } from './login';
import { displayMap } from './mapbox.js';
import { updateUser } from './updateSettings';
import { bookTour } from './stripe';

// DOM ElEMENT
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateUserForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('form.form-user-settings');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);
if (updateUserForm) {
  updateUserForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.email = document.getElementById('email').value;
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    // updateUser(form);
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    console.log(passwordCurrent, password);
    updateUser({ passwordCurrent, password, passwordConfirm }, 'password');
  });
}

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
