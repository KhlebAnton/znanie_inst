document.addEventListener('DOMContentLoaded', function() {
    initNewsPagination();
});

function initNewsPagination() {
    const newsItems = document.querySelectorAll('.news-item');
    const newsTabs = document.querySelectorAll('.news-tabs__item');
    const allNewsContent = document.querySelector('.all-news-content');
    const paginationContainer = document.querySelector('.num-pagination');
    
    let currentPage = 1;
    let currentFilter = 'all';
    const itemsPerPage = 9;
    
    // Сохраняем все новости для фильтрации
    const allNews = Array.from(newsItems);
    
    // Инициализация
    updateNewsDisplay();
    
    // Обработчики для табов фильтрации
    newsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс у всех табов
            newsTabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс к текущему табу
            this.classList.add('active');
            
            currentFilter = this.dataset.news;
            currentPage = 1;
            updateNewsDisplay();
        });
    });
    
    // Обработчики для пагинации
    paginationContainer.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (e.target.classList.contains('num-pagination__prev')) {
            if (currentPage > 1) {
                currentPage--;
                updateNewsDisplay();
            }
        } else if (e.target.classList.contains('num-pagination__next')) {
            const totalPages = getTotalPages();
            if (currentPage < totalPages) {
                currentPage++;
                updateNewsDisplay();
            }
        } else if (e.target.classList.contains('num-pagination__item')) {
            if (e.target.textContent === '...') {
                // Клик на многоточие - переходим к странице 4
                currentPage = 4;
                updateNewsDisplay();
            } else {
                const page = parseInt(e.target.textContent);
                if (!isNaN(page) && page !== currentPage) {
                    currentPage = page;
                    updateNewsDisplay();
                }
            }
        }
    });
    
    function getFilteredNews() {
        if (currentFilter === 'all') {
            return allNews;
        }
        return allNews.filter(item => 
            item.dataset.news === currentFilter
        );
    }
    
    function getTotalPages() {
        const filteredNews = getFilteredNews();
        return Math.ceil(filteredNews.length / itemsPerPage);
    }
    
    function updateNewsDisplay() {
        const filteredNews = getFilteredNews();
        const totalPages = getTotalPages();
        
        // Ограничиваем текущую страницу
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }
        
        // Вычисляем индексы для текущей страницы
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageNews = filteredNews.slice(startIndex, endIndex);
        
        // Скрываем все новости
        allNews.forEach(item => {
            item.style.display = 'none';
        });
        
        // Показываем только новости текущей страницы
        currentPageNews.forEach(newsItem => {
            newsItem.style.display = 'flex';
        });
        
        // Обновляем пагинацию
        updatePagination(totalPages);
    }
    
    function updatePagination(totalPages) {
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        let paginationHTML = '';
        
        // Кнопка "Предыдущая"
        paginationHTML += `
            <div class="num-pagination__prev ${currentPage === 1 ? 'disabled' : ''}">
                
            </div>
        `;
        
        // Номера страниц
        if (totalPages <= 5) {
            // Показываем все страницы
            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <a class="num-pagination__item ${i === currentPage ? 'active' : ''}" href="#">
                        ${i}
                    </a>
                `;
            }
        } else {
            // Сложная логика для большого количества страниц
            if (currentPage <= 3) {
                // Показываем первые 3 страницы + ... + последнюю
                for (let i = 1; i <= 3; i++) {
                    paginationHTML += `
                        <a class="num-pagination__item ${i === currentPage ? 'active' : ''}" href="#">
                            ${i}
                        </a>
                    `;
                }
                paginationHTML += `
                    <a class="num-pagination__item" href="#">...</a>
                    <a class="num-pagination__item" href="#">${totalPages}</a>
                `;
            } else if (currentPage >= totalPages - 2) {
                // Показываем первую + ... + последние 3 страницы
                paginationHTML += `
                    <a class="num-pagination__item" href="#">1</a>
                    <a class="num-pagination__item" href="#">...</a>
                `;
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    paginationHTML += `
                        <a class="num-pagination__item ${i === currentPage ? 'active' : ''}" href="#">
                            ${i}
                        </a>
                    `;
                }
            } else {
                // Показываем первую + ... + текущая-1, текущая, текущая+1 + ... + последняя
                paginationHTML += `
                    <a class="num-pagination__item" href="#">1</a>
                    <a class="num-pagination__item" href="#">...</a>
                `;
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    paginationHTML += `
                        <a class="num-pagination__item ${i === currentPage ? 'active' : ''}" href="#">
                            ${i}
                        </a>
                    `;
                }
                paginationHTML += `
                    <a class="num-pagination__item" href="#">...</a>
                    <a class="num-pagination__item" href="#">${totalPages}</a>
                `;
            }
        }
        
        // Кнопка "Следующая"
        paginationHTML += `
            <div class="num-pagination__next ${currentPage === totalPages ? 'disabled' : ''}">
                
            </div>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
}
