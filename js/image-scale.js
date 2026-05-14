const form = document.querySelector('.img-upload__form');
const scaleSmallerBtn = form.querySelector('.scale__control--smaller');
const scaleBiggerBtn = form.querySelector('.scale__control--bigger');
const scaleControlValue = form.querySelector('.scale__control--value');
const uploadedImage = form.querySelector('.img-upload__preview img');

let currentScale = 100;
export const initImageScale = () => {
  scaleSmallerBtn.addEventListener('click', () => {
    if (currentScale > 25) {
      currentScale -= 25;
      scaleControlValue.value = `${currentScale}%`;
      uploadedImage.style.transform = `scale(${currentScale / 100})`;
    }
  });

  scaleBiggerBtn.addEventListener('click', () => {
    if (currentScale < 100) {
      currentScale += 25;
      scaleControlValue.value = `${currentScale}%`;
      uploadedImage.style.transform = `scale(${currentScale / 100})`;
    }
  });
};
