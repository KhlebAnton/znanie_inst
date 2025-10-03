document.addEventListener('DOMContentLoaded', function() {
    const tabNavItems = document.querySelectorAll('.tab-nav-item');
    const specItems = document.querySelectorAll('.spec-item');
    const specContainer = document.querySelector('.spec-container');
    
    // Добавляем data-атрибуты к элементам для фильтрации
    function addDataAttributes() {
        specItems.forEach((item, index) => {
            // Получаем форму обучения из hints
            const hints = item.querySelectorAll('.spec-item__hint span');
            let formType = 'all'; // по умолчанию
            
            hints.forEach(hint => {
                const hintText = hint.textContent.trim();
                if (hintText.includes('Очно-заочная форма')) {
                    formType = 'part-time';
                } else if (hintText.includes('Заочная форма')) {
                    formType = 'correspondence';
                } else if (hintText.includes('Очная форма')) {
                    formType = 'full-time';
                }
            });
            
            item.setAttribute('data-form-type', formType);
            item.setAttribute('data-index', index);
        });
    }
    
    // Функция фильтрации элементов
    function filterItems(activeTab) {
        const filterValue = activeTab.getAttribute('data-filter');
        
        specItems.forEach((item, index) => {
            const itemFormType = item.getAttribute('data-form-type');
            const shouldShow = filterValue === 'all' || itemFormType === filterValue;
            
            if (shouldShow) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Функция переключения активного таба
    function switchActiveTab(clickedTab) {
        // Убираем активный класс со всех табов
        tabNavItems.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Добавляем активный класс к кликнутому табу
        clickedTab.classList.add('active');
    }
    
    // Инициализация
    function init() {
        addDataAttributes();
        
        // Добавляем data-атрибуты к табам
        tabNavItems.forEach((tab, index) => {
            const filterValues = ['all', 'part-time', 'correspondence', 'full-time'];
            tab.setAttribute('data-filter', filterValues[index]);
        });
        
        // Добавляем обработчики событий
        tabNavItems.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Переключаем активный таб
                switchActiveTab(this);
                
                // Фильтруем элементы
                filterItems(this);
            });
        });
    }
    
    // Запускаем инициализацию
    init();
});
