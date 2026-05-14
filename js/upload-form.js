import { openModal, closeModal } from './modal.js';
import { initImageScale } from './image-scale.js';
import { initImageEffects } from './image-filters.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEXP = /^#[a-zа-я0-9]{1,19}$/i;

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const cancelBtn = form.querySelector('.img-upload__cancel');
const body = document.querySelector('body');
const uploadOverlay = form.querySelector('.img-upload__overlay');
const hashtagInput = form.querySelector('.text__hashtags');

const commentInput = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
});

export const initUploadForm = () => {
  fileInput.addEventListener('change', () => {
    openModal(uploadOverlay, body);
    initImageScale();
    initImageEffects();
  });

  cancelBtn.addEventListener('click', () => {
    closeModal(uploadOverlay, body);
    form.reset();
    fileInput.value = '';
    pristine.reset();
  });

  const stopEscPropagation = (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  };

  const parseHashTags = (value) => {
    if (!value) {
      return [];
    }
    return value.split(' ').filter(Boolean);
  };

  const validateHashtagFormat = (value) => {
    const tags = parseHashTags(value);
    return tags.every((tag) => HASHTAG_REGEXP.test(tag));
  };

  const validateHashtagCount = (value) => {
    const tags = parseHashTags(value);
    return tags.length <= MAX_HASHTAG_COUNT;
  };

  const validateHashtagUnique = (value) => {
    const tags = parseHashTags(value);
    const lowerCaseHashtags = tags.map((tag) => tag.toLowerCase());
    const sizeUnique = new Set(lowerCaseHashtags).size;
    return tags.length === sizeUnique;
  };

  const hashtagValidators = [
    {
      validator: validateHashtagFormat,
      error: 'Хэштег должен начинаться с # и содержать только буквы и цифры, максимум 20 символов'
    },
    {
      validator: validateHashtagCount,
      error: 'Количество хэштегов не может быть больше 5'
    },
    {
      validator: validateHashtagUnique,
      error: 'Хэштеги не могут повторяться'
    },
  ];

  const validateComment = (value) => {
    if (!value) {
      return true;
    }

    return value.length <= MAX_COMMENT_LENGTH;
  };

  hashtagValidators.forEach((rule) => {
    pristine.addValidator(hashtagInput, rule.validator, rule.error);
  });

  pristine.addValidator(
    commentInput,
    validateComment,
    `Длина комментария не может составлять больше ${MAX_COMMENT_LENGTH} символов`
  );

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (!pristine.validate()) {
      // eslint-disable-next-line no-useless-return
      return;
    }
  });

  hashtagInput.addEventListener('keydown', stopEscPropagation);
  commentInput.addEventListener('keydown', stopEscPropagation);
};
