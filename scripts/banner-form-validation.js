/**
 * Валидация формы баннера
 * Обрабатывает валидацию телефона и отправку формы
 */

class BannerFormValidation {
    constructor() {
        this.form = document.querySelector('.form-banner__form');
        this.phoneInput = this.form?.querySelector('input[type="tel"]');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        this.errorMessage = this.form?.querySelector('.error-message');
        this.modal = document.getElementById('modal-success');
        
        this.init();
    }

    init() {
        if (!this.form || !this.phoneInput || !this.modal) {
            console.warn('Banner form elements not found');
            return;
        }

        this.bindEvents();
        this.setupModalEvents();
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        // Валидация при вводе
        this.phoneInput.addEventListener('input', () => {
            this.clearError();
        });

        // Валидация при потере фокуса
        this.phoneInput.addEventListener('blur', () => {
            this.validatePhone();
        });

        // Обработка отправки формы
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    /**
     * Настройка событий модалки
     */
    setupModalEvents() {
        // Закрытие модалки по кнопке
        const closeBtn = this.modal.querySelector('.modal__close');
        const successCloseBtn = this.modal.querySelector('.success-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Закрытие модалки по клику вне формы
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Закрытие модалки по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    /**
     * Валидация номера телефона
     */
    validatePhone() {
        const phoneNumber = this.phoneInput.value.trim();
        
        if (!phoneNumber) {
            this.showError('Введите номер телефона');
            return false;
        }

        // Используем уже инициализированный intl-tel-input из main.js
        if (this.phoneInput.iti && window.intlTelInput) {
            if (!this.phoneInput.iti.isValidNumber()) {
                this.showError('Введите корректный номер телефона');
                return false;
            }
        } else {
            // Простая валидация российского номера
            const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
            if (!phoneRegex.test(phoneNumber)) {
                this.showError('Введите корректный номер телефона');
                return false;
            }
        }

        this.clearError();
        return true;
    }

    /**
     * Показать ошибку валидации
     */
    showError(message) {
        this.phoneInput.classList.add('error');
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
        }
    }

    /**
     * Очистить ошибку валидации
     */
    clearError() {
        this.phoneInput.classList.remove('error');
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
        }
    }

    /**
     * Обработка отправки формы
     */
    async handleSubmit() {
        // Валидация перед отправкой
        if (!this.validatePhone()) {
            return;
        }

        // Блокируем кнопку отправки
        this.setSubmitButtonState(true);

        try {
            // Получаем номер телефона в международном формате
            let phoneNumber = this.phoneInput.value.trim();
            if (this.phoneInput.iti) {
                phoneNumber = this.phoneInput.iti.getNumber();
            }

            // Имитация отправки данных на сервер
            const formData = {
                phone: phoneNumber,
                timestamp: new Date().toISOString()
            };

            console.log('Отправка данных формы:', formData);

            // Имитация задержки сервера
            await this.simulateServerRequest();

            // Показываем модалку успеха
            this.showSuccessModal();

        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            this.showError('Произошла ошибка. Попробуйте еще раз.');
        } finally {
            this.setSubmitButtonState(false);
        }
    }

    /**
     * Имитация запроса к серверу
     */
    simulateServerRequest() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }

    /**
     * Управление состоянием кнопки отправки
     */
    setSubmitButtonState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <span>Отправка...</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" stroke="white" stroke-width="2" fill="none" opacity="0.3"/>
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
                </svg>
            `;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = `
                <span>Отправить</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.61084 13.3337L10.0015 8.94299C10.2505 8.69244 10.3902 8.35356 10.3902 8.00033C10.3902 7.6471 10.2505 7.30821 10.0015 7.05766L5.61084 2.66699" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    }

    /**
     * Показать модалку успеха
     */
    showSuccessModal(title = 'Спасибо за обращение!', text = 'Мы получили ваш номер телефона и свяжемся с вами в ближайшее время.') {
        // Устанавливаем текст
        const titleElement = this.modal.querySelector('.success-title');
        const textElement = this.modal.querySelector('.success-text');
        
        if (titleElement) titleElement.textContent = title;
        if (textElement) textElement.textContent = text;
        
        this.modal.classList.add('active');
        document.body.classList.add('no-scroll');
        this.setScrollWindow(false);
    }

    /**
     * Закрыть модалку
     */
    closeModal() {
        this.modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        this.setScrollWindow(true);
        this.resetForm();
    }

    /**
     * Сбросить форму
     */
    resetForm() {
        this.form.reset();
        this.clearError();
    }

    /**
     * Управление скроллом страницы
     */
    setScrollWindow(bool) {
        setTimeout(() => {
            if (bool) {
                document.body.classList.remove('no-scroll');
                document.documentElement.classList.remove('no-scroll');
            } else {
                document.body.classList.add('no-scroll');
                document.documentElement.classList.add('no-scroll');
            }
        }, 100);
    }
}

// Инициализация после загрузки всех скриптов
// Ждем, пока main.js инициализирует intl-tel-input
window.addEventListener('load', () => {
    // Небольшая задержка, чтобы убедиться, что main.js уже инициализировал intl-tel-input
    setTimeout(() => {
        new BannerFormValidation();
    }, 100);
});
