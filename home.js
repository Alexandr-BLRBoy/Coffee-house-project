// Slider
const sliderBox = document.querySelector('.slider_box');
const btnLeft = document.querySelector('.slider_btn__left');
const btnRight = document.querySelector('.slider_btn__right');
const sliderControl = document.querySelectorAll('.slider_control__item');

let position = 0; // Смещение от левого края
let pagIndex = 0;
let slideWidth = 480; // Начальная ширина слайда
let startX = 0;
let endX = 0;

// Функция для обновления ширины слайда в зависимости от ширины окна
const updateSlideWidth = () => {
    const widthWindow = document.documentElement.clientWidth;
    if (widthWindow <= 380) {
        slideWidth = 348;
    } else if (widthWindow <= 550) {
        slideWidth = widthWindow - 70; // Учитываем возможные отступы
    } else {
        slideWidth = 480;
    }
};

// Функция для обновления положения слайдера
const updateSliderPosition = () => {
    sliderBox.style.left = -position + 'px';
    thisSlide(pagIndex);
};

// Функция для обновления активного слайда
const thisSlide = (index) => {
    sliderControl.forEach(slider_control__item => {
        slider_control__item.classList.remove('active');
    });
    sliderControl[index].classList.add('active');
};

// Next slide
const nextSlide = () => {
    if (position < (sliderControl.length - 1) * slideWidth) {
        position += slideWidth;
        pagIndex++;
    } else {
        position = 0;
        pagIndex = 0;
    }
    updateSliderPosition();
};

// Prev slide
const prevSlide = () => {
    if (position > 0) {
        position -= slideWidth;
        pagIndex--;
    } else {
        position = (sliderControl.length - 1) * slideWidth;
        pagIndex = sliderControl.length - 1;
    }
    updateSliderPosition();
};

// Обработка свайпов
const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
    endX = event.touches[0].clientX;
};

const handleTouchEnd = () => {
    if (startX > endX + 50) {
        nextSlide();
    } else if (startX < endX - 50) {
        prevSlide();
    }
};

// Функция для установки обработчиков событий
const setEventListeners = () => {
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    sliderControl.forEach((slider_control__item, index) => {
        slider_control__item.addEventListener('click', () => {
            position = slideWidth * index;
            updateSliderPosition();
            pagIndex = index;
            thisSlide(pagIndex);
        });
    });

    // Добавляем обработку свайпов для мобильных устройств
    if (document.documentElement.clientWidth <= 550) {
        sliderBox.addEventListener('touchstart', handleTouchStart);
        sliderBox.addEventListener('touchmove', handleTouchMove);
        sliderBox.addEventListener('touchend', handleTouchEnd);
    }
};

// Функция для удаления обработчиков событий
const removeEventListeners = () => {
    btnRight.removeEventListener('click', nextSlide);
    btnLeft.removeEventListener('click', prevSlide);

    sliderControl.forEach((slider_control__item, index) => {
        slider_control__item.removeEventListener('click', () => {
            position = slideWidth * index;
            updateSliderPosition();
            pagIndex = index;
            thisSlide(pagIndex);
        });
    });

    // Удаляем обработку свайпов для мобильных устройств
    if (document.documentElement.clientWidth <= 550) {
        sliderBox.removeEventListener('touchstart', handleTouchStart);
        sliderBox.removeEventListener('touchmove', handleTouchMove);
        sliderBox.removeEventListener('touchend', handleTouchEnd);
    }
};

// Функция для обновления состояния слайдера при изменении размера окна
const updateSliderState = () => {
    removeEventListeners();  // Удаляем старые обработчики событий
    updateSlideWidth();      // Обновляем ширину слайда
    setEventListeners();     // Устанавливаем новые обработчики событий
};

// Инициализация слайдера
updateSliderState();

// Обновление слайдера при изменении размера окна
window.addEventListener('resize', updateSliderState);


//Burger and burger menu
document.addEventListener('DOMContentLoaded',  function(){
    document.getElementById('burger').addEventListener('click', function(){
        document.querySelector('.header_menu').classList.toggle('open');
    })

    const link = document.querySelectorAll('.burger_item');
    link.forEach((item) => {
        item.addEventListener('click', function(){
            document.querySelector('.header_menu').classList.remove('open');
        })
    })

})







