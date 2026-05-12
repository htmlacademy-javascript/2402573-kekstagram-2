import { openModal, closeModal } from './modal.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const TAG_ERROR_TEXT = 'Неправильно заполнены хэштеги';
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
  });

  cancelBtn.addEventListener('click', () => {
    closeModal(uploadOverlay, body);
    form.reset();
    fileInput.value = '';
    pristine.reset();
  });
  const validateTags = (value) => {
    if (!value) {
      return true;
    }
    const splitHashtags = value.split(' ').filter(Boolean);
    const lowerCaseHashtags = splitHashtags.map((hashtag) => hashtag.toLowerCase());
    const sizeUnique = new Set(lowerCaseHashtags).size;
    if (splitHashtags.length > MAX_HASHTAG_COUNT || splitHashtags.length !== sizeUnique) {
      return false;
    }
    return splitHashtags.every((hashtag) => HASHTAG_REGEXP.test(hashtag));
  };

  const validateComment = (value) => {
    if (!value) {
      return true;
    }

    return value.length <= MAX_COMMENT_LENGTH;
  };

  pristine.addValidator(
    hashtagInput,
    validateTags,
    TAG_ERROR_TEXT
  );

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

  const stopEscPropagation = (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  };
  hashtagInput.addEventListener('keydown', stopEscPropagation);
  commentInput.addEventListener('keydown', stopEscPropagation);
};
