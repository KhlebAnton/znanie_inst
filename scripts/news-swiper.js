document.addEventListener('DOMContentLoaded', function() {
    initNewsSwiper();
    initNewsFilter();
});

let newsSwiper = null;

function initNewsSwiper() {
    newsSwiper = new Swiper('.swiper-news', {
        slidesPerView: 'auto',
        spaceBetween:10,
        navigation: {
            nextEl: '.swiper-custom-navigation__next',
            prevEl: '.swiper-custom-navigation__prev',
        },
        pagination: {
            el: '.swiper-custom__pagination',
            clickable: true
        },
        breakpoints: {
           
            1000: {
                spaceBetween: 20
            }
        }
    });
}

function initNewsFilter() {
    const tabs = document.querySelectorAll('.news-tabs__item');
    const newsItems = document.querySelectorAll('.news-item');
    
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const filter = tab.getAttribute('data-news');
            
            tabs.forEach(function(t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            filterNews(filter);
        });
    });
}

function filterNews(filter) {
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach(function(item) {
        const itemCategory = item.getAttribute('data-news');
        
        if (filter === 'all' || itemCategory === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Обновляем swiper после фильтрации
    if (newsSwiper) {
        setTimeout(function() {
            newsSwiper.update();
        }, 100);
    }
}
