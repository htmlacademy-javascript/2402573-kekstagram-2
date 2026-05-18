import { openModal, closeModal } from './modal.js';
import { pristine } from './validator.js';
import { initImageScale, resetImageScale } from './image-scale.js';
import { initImageEffects, resetImageEffects } from './image-filters.js';
import { sendData } from './api.js';

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Отправляю...'
};

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const cancelBtn = form.querySelector('.img-upload__cancel');
const body = document.querySelector('body');
const uploadOverlay = form.querySelector('.img-upload__overlay');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitBtn = form.querySelector('.img-upload__submit');

const resetUploadForm = () => {
  closeModal(uploadOverlay, body);
  form.reset();
  fileInput.value = '';
  resetImageScale();
  resetImageEffects();
  pristine.reset();
};

const initUploadForm = () => {
  initImageScale();
  initImageEffects();

  fileInput.addEventListener('change', () => {
    openModal(uploadOverlay, body);
    resetImageEffects();
  });

  cancelBtn.addEventListener('click', () => {
    resetUploadForm();
  });

  const stopEscPropagation = (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  };
  hashtagInput.addEventListener('keydown', stopEscPropagation);
  commentInput.addEventListener('keydown', stopEscPropagation);
};

const submitHandler = ({ onSuccess, onError }, formData) => {
  if (!pristine.validate()) {
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = SubmitButtonText.SENDING;

  sendData(formData)
    .then(() => {
      onSuccess();
    })
    .catch(() => {
      onError();
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = SubmitButtonText.IDLE;
    });
};
const setUploadFormSubmit = ({ onSuccess, onError }) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    submitHandler({onSuccess, onError}, formData);
  });
};

export { initUploadForm, setUploadFormSubmit, resetUploadForm };

