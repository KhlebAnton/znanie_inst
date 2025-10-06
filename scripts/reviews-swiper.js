document.addEventListener('DOMContentLoaded', function() {
    initReviewsSwiper();
    initTextToggle();
});

window.addEventListener('resize', function() {
    setTimeout(function() {
        checkTextOverflow();
    }, 100);
});

let reviewsSwiper = null;

function initReviewsSwiper() {
    reviewsSwiper = new Swiper('.reviews-swiper', {
        slidesPerView: 'auto',
        spaceBetween:10,
        navigation: {
            nextEl: '.reviews-swiper .swiper-custom-navigation__next',
            prevEl: '.reviews-swiper .swiper-custom-navigation__prev',
        },
        pagination: {
            el: '.reviews-swiper .swiper-custom__pagination',
            clickable: true
        },
        breakpoints: {
           
            1000: {
                spaceBetween: 20
            }
        },
        on: {
            init: function() {
                checkTextOverflow();
            }
        }
    });
}

function initTextToggle() {
    const moreButtons = document.querySelectorAll('.reviews-item__text-more');
    
    moreButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleText(button);
        });
    });
}

function checkTextOverflow() {
    const reviewItems = document.querySelectorAll('.reviews-item');
    
    reviewItems.forEach(function(item) {
        const textElement = item.querySelector('.reviews-item__text p');
        const moreButton = item.querySelector('.reviews-item__text-more');
        
        if (!textElement || !moreButton) return;
        
        // Сбрасываем состояние
        item.classList.remove('expanded');
        textElement.style.webkitLineClamp = '8';
        textElement.style.lineClamp = '8';
        
        // Принудительно применяем стили
        textElement.offsetHeight;
        
        // Проверяем, обрезается ли текст
        const isOverflowing = textElement.scrollHeight > textElement.clientHeight;
        
        if (isOverflowing) {
            moreButton.style.display = 'flex';
            moreButton.querySelector('span').textContent = 'Развернуть';
        } else {
            moreButton.style.display = 'none';
        }
    });
}

function toggleText(button) {
    const reviewItem = button.closest('.reviews-item');
    const textElement = reviewItem.querySelector('.reviews-item__text p');
    const span = button.querySelector('span');
    const svg = button.querySelector('svg');
    const isExpanded = reviewItem.classList.contains('expanded');
    
    if (isExpanded) {
        // Сворачиваем текст
        reviewItem.classList.remove('expanded');
        textElement.style.webkitLineClamp = '8';
        textElement.style.lineClamp = '8';
        span.textContent = 'Развернуть';
        svg.style.transform = 'rotate(0deg)';
    } else {
        // Разворачиваем текст
        reviewItem.classList.add('expanded');
        textElement.style.webkitLineClamp = 'none';
        textElement.style.lineClamp = 'none';
        span.textContent = 'Свернуть';
        svg.style.transform = 'rotate(180deg)';
    }
    
    // Обновляем swiper после изменения высоты
    if (reviewsSwiper) {
        setTimeout(function() {
            reviewsSwiper.update();
        }, 300);
    }
}
