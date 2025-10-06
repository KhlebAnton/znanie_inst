// ===== HEADER FUNCTIONALITY =====
const menuBtn = document.querySelector('[data-btn="btn-menu"]');
const menuBtnClose = document.querySelector('[data-btn="btn-menu-close"]');
const menu = document.querySelector('.menu');

menuBtn.addEventListener('click', openMenu);
menuBtnClose.addEventListener('click', closeMenu);

const footerNavLink = document.querySelectorAll('.footer__nav-list__title');

footerNavLink.forEach(elem => {
    elem.addEventListener('click', () => {
        elem.classList.toggle('open')
    })
});

function openMenu() {
     menu.classList.remove('hidden');
     setScrollWindow(false);
}
function closeMenu() {
     menu.classList.add('hidden');
     setScrollWindow(true);
}
function setScrollWindow(bool) {
    setTimeout(() => {

        if (bool) {
            document.body.classList.remove('no-scroll');
            document.documentElement.classList.remove('no-scroll');
        } else {
            document.body.classList.add('no-scroll');
            document.documentElement.classList.add('no-scroll');
        }
    }, 100)

}

const header = document.querySelector('.header')
const pageVersionBtn = document.querySelector('.page_version');
const visContent = document.querySelector('.visually__content');

pageVersionBtn.addEventListener('click', () => {

    visContent.classList.toggle('hidden');
    pageVersionBtn.classList.toggle('open')
});
window.addEventListener('click', (e) => {
    if (!visContent.contains(e.target) && !pageVersionBtn.contains(e.target)) {
        visContent.classList.add('hidden');
        pageVersionBtn.classList.remove('open')
    }
});

const visuallyBtnFontMin = document.querySelector('.visually-btn__font-minus');
const visuallyBtnFontPlus = document.querySelector('.visually-btn__font-plus');
let fontSize = 18;
visuallyBtnFontMin.addEventListener('click', () => {
    fontSize--
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
});
visuallyBtnFontPlus.addEventListener('click', () => {
    fontSize++
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
});

const visuallyBtnColors = document.querySelectorAll('.visually-btn-color');

visuallyBtnColors.forEach(btn => {
    btn.addEventListener('click', () => {
        let background = btn.style.backgroundColor;
        let color = btn.style.color;
        document.documentElement.style.setProperty('--color-text-white', `${color}`);
        document.documentElement.style.setProperty('--color-text', `${color}`);
        document.documentElement.style.setProperty('--color-dark', `${color}`);
        document.documentElement.style.setProperty('--primary-color', `${color}`);
        document.documentElement.style.setProperty('--color-text-light', `${color}`);
        document.documentElement.style.setProperty('--color-border', `${color}`);
        document.documentElement.style.setProperty('--color-text-grey', `${color}`);
        document.documentElement.style.setProperty('--color-icon-grey', `${color}`);

        document.documentElement.style.setProperty('--color-bg-primary', `${background}`);
        document.documentElement.style.setProperty('--color-bg', `${background}`);
        document.documentElement.style.setProperty('--primary-color-bg', `${background}`);
        document.documentElement.style.setProperty('--color-bg-white', `${background}`);
        document.documentElement.style.setProperty('--color-bg-blue', `${background}`);


        document.querySelectorAll('img').forEach(img => {
            img.style = `filter: grayscale(1);`;
        });


    })

});

const visuallyRemoveBtn = document.querySelector('.visually-btn__remove');

visuallyRemoveBtn.addEventListener('click', () => {
    document.documentElement.style = ''
});

const menuDropdownItems = document.querySelectorAll('.menu_dropdown-item');

menuDropdownItems.forEach(item => {
    item.addEventListener('click', ()=> {
       
        if(item.classList.contains('open')) {
           
            item.classList.remove('open');
            return

        }
        menuDropdownItems.forEach(item => item.classList.remove('open'));
        item.classList.add('open')
    })
});

const footerDropdownItems = document.querySelectorAll('.footer__nav__item');

footerDropdownItems.forEach(item => {
    item.addEventListener('click', ()=> {
        if(item.classList.contains('open')) {
            item.classList.remove('open');
            return

        }
        footerDropdownItems.forEach(item => item.classList.remove('open'));
        item.classList.add('open')
    })
});

// ===== MODAL APPLICATION FUNCTIONALITY =====
// Global variables
let currentStep = 1;
const totalSteps = 3;
let formData = {};
let fileUploads = {};

// DOM elements
const modal = document.getElementById('modal-application');
const form = document.getElementById('application-form');
const successModal = document.getElementById('modal-success');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initModal();
    initCookieNotice();
    
    // Initialize gallery modal with a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        initGalleryModal();
    }, 100);
    
});

function initModal() {
    setupEventListeners();
    initializeCustomSelects();
    initializeFileUploads();
    initializePhoneInputs();
    setupAddressSync();
    setupSuccessModalEvents();
}

function setupEventListeners() {
    // Modal open/close by data attribute
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-btn-modal') && e.target.getAttribute('data-btn-modal') === 'documents') {
            openModal();
        }
    });

    // Close modal
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal on click outside form
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form navigation
    form.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-next')) {
            e.preventDefault();
            nextStep();
        } else if (e.target.classList.contains('btn-prev')) {
            e.preventDefault();
            prevStep();
        } else if (e.target.classList.contains('btn-submit')) {
            e.preventDefault();
            submitForm();
        }
    });

    // Form validation on input
    form.addEventListener('input', function(e) {
        validateField(e.target);
    });

    // Form validation on change (for checkboxes)
    form.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            validateField(e.target);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
    });
}

function openModal() {
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
    currentStep = 1;
    showStep(1);
    
    // Close menu if it's open
    if (menu && !menu.classList.contains('hidden')) {
        closeMenu();
    }
    setScrollWindow(false)
}

function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    resetForm();
    setScrollWindow(true)
}

function nextStep() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(function(step) {
        step.classList.remove('active');
        step.style.display = 'none';
    });

    // Show current step
    const currentStepElement = document.querySelector('.form-step-' + stepNumber);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStepElement.style.display = 'flex';
    }

    // Update button visibility
    updateButtonVisibility();
}

function updateButtonVisibility() {
    const prevBtn = form.querySelector('.btn-prev');
    const nextBtn = form.querySelector('.btn-next');
    const submitBtn = form.querySelector('.btn-submit');

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'flex' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';
}


function validateCurrentStep() {
    const currentStepElement = document.querySelector('.form-step-' + currentStep);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(function(field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Special validation for file uploads in step 3
    if (currentStep === 3) {
        const requiredFileGroups = currentStepElement.querySelectorAll('.file-group');
        requiredFileGroups.forEach(function(group) {
            const fileUpload = group.querySelector('.file-upload');
            const files = fileUploads[fileUpload.dataset.name] || [];
            if (fileUpload.dataset.name !== 'ege' && fileUpload.dataset.name !== 'other' && files.length === 0) {
                showFieldError(fileUpload, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });
    }

    return isValid;
}

function validateField(field) {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required')) {
        if (field.type === 'checkbox' && !field.checked) {
            errorMessage = 'Это поле обязательно для заполнения';
            isValid = false;
        } else if (field.type !== 'checkbox' && !value) {
            errorMessage = 'Это поле обязательно для заполнения';
            isValid = false;
        }
    }

    // Specific field validations
    if (value && isValid) {
        switch (fieldName) {
            case 'fio':
            case 'parent_fio':
                if (value.length < 2) {
                    errorMessage = 'ФИО должно содержать минимум 2 символа';
                    isValid = false;
                } else if (!/^[а-яё\s]+$/i.test(value)) {
                    errorMessage = 'ФИО должно содержать только русские буквы';
                    isValid = false;
                }
                break;

            case 'phone':
            case 'parent_phone':
                if (!isValidPhone(field, value)) {
                    errorMessage = 'Введите корректный номер телефона';
                    isValid = false;
                }
                break;

            case 'birthdate':
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 16 || age > 100) {
                    errorMessage = 'Возраст должен быть от 16 до 100 лет';
                    isValid = false;
                }
                break;

            case 'address_fact':
            case 'address_reg':
                if (value.length < 10) {
                    errorMessage = 'Адрес должен содержать минимум 10 символов';
                    isValid = false;
                }
                break;
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldValid(field);
    }

    return isValid;
}

function isValidPhone(field, phone) {
    // Use intl-tel-input validation if available
    if (field.iti && window.intlTelInput) {
        return field.iti.isValidNumber();
    }
    
    // Fallback validation
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('valid');
    
    // Find the form-group container or use field's parent
    const formGroup = field.closest('.form-group') || field.parentNode;
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showFieldValid(field) {
    field.classList.add('valid');
    field.classList.remove('error');
    clearFieldError(field);
}

function clearFieldError(field) {
    field.classList.remove('error', 'valid');
    const formGroup = field.closest('.form-group') || field.parentNode;
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function saveCurrentStepData() {
    const currentStepElement = document.querySelector('.form-step-' + currentStep);
    const inputs = currentStepElement.querySelectorAll('input, select');
    
    inputs.forEach(function(input) {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else {
            formData[input.name] = input.value;
        }
    });
}

function initializeCustomSelects() {
    const selects = document.querySelectorAll('.custom-select');
    
    selects.forEach(function(select) {
        const input = select.querySelector('input');
        const options = select.querySelector('.select-options');
        
        // Toggle dropdown
        input.addEventListener('click', function() {
            toggleSelect(select);
        });

        // Handle option selection
        options.addEventListener('click', function(e) {
            if (e.target.tagName === 'LI') {
                const value = e.target.dataset.value;
                const text = e.target.textContent;
                
                input.value = text;
                input.dataset.value = value;
                
                // Update visual state
                options.querySelectorAll('li').forEach(function(li) {
                    li.classList.remove('selected');
                });
                e.target.classList.add('selected');
                
                toggleSelect(select);
                validateField(input);
            }
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!select.contains(e.target)) {
                closeSelect(select);
            }
        });
    });
}

function toggleSelect(select) {
    const isOpen = select.classList.contains('open');
    
    // Close all other selects
    document.querySelectorAll('.custom-select').forEach(function(s) {
        if (s !== select) {
            closeSelect(s);
        }
    });
    
    if (isOpen) {
        closeSelect(select);
    } else {
        openSelect(select);
    }
}

function openSelect(select) {
    select.classList.add('open');
    const options = select.querySelector('.select-options');
    options.style.display = 'flex';
}

function closeSelect(select) {
    select.classList.remove('open');
    const options = select.querySelector('.select-options');
    options.style.display = 'none';
}

function initializeFileUploads() {
    const fileUploadsElements = document.querySelectorAll('.file-upload');
    
    fileUploadsElements.forEach(function(upload) {
        const button = upload.querySelector('.file-btn');
        const name = upload.dataset.name;
        const maxFiles = parseInt(upload.dataset.max);
        const maxSize = parseInt(upload.dataset.maxsize);
        const accept = upload.dataset.accept;
        
        fileUploads[name] = [];
        
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = maxFiles > 1;
        fileInput.accept = accept;
        fileInput.style.display = 'none';
        upload.appendChild(fileInput);
        
        // Button click
        button.addEventListener('click', function() {
            fileInput.click();
        });
        
        // File selection
        fileInput.addEventListener('change', function(e) {
            handleFileSelection(e.target.files, upload, maxFiles, maxSize, accept);
        });
        
        // Drag and drop
        upload.addEventListener('dragover', function(e) {
            e.preventDefault();
            upload.classList.add('dragover');
        });
        
        upload.addEventListener('dragleave', function() {
            upload.classList.remove('dragover');
        });
        
        upload.addEventListener('drop', function(e) {
            e.preventDefault();
            upload.classList.remove('dragover');
            handleFileSelection(e.dataTransfer.files, upload, maxFiles, maxSize, accept);
        });
    });
}

function handleFileSelection(files, upload, maxFiles, maxSize, accept) {
    const name = upload.dataset.name;
    const currentFiles = fileUploads[name] || [];
    
    Array.from(files).forEach(function(file) {
        // Validate file
        if (currentFiles.length >= maxFiles) {
            alert('Максимальное количество файлов: ' + maxFiles);
            return;
        }
        
        if (file.size > maxSize) {
            alert('Файл "' + file.name + '" слишком большой. Максимальный размер: ' + formatFileSize(maxSize));
            return;
        }
        
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        const acceptedExtensions = accept.split(',').map(function(ext) {
            return ext.trim();
        });
        
        if (acceptedExtensions.indexOf(fileExtension) === -1) {
            alert('Неподдерживаемый формат файла. Разрешены: ' + accept);
            return;
        }
        
        // Add file
        currentFiles.push(file);
    });
    
    fileUploads[name] = currentFiles;
    updateFileList(upload, currentFiles);
}

function updateFileList(upload, files) {
    const fileList = upload.querySelector('.file-list');
    const buttonGroup = upload.querySelector('.file-btn_group');
    const maxFiles = parseInt(upload.dataset.max);
    
    fileList.innerHTML = '';
    
    files.forEach(function(file, index) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = 
            `
             <div class="file-icon"></div>
            <div class="file-info">
                 <span class="file-name">${file.name}</span>
            <span class="file-size"> ${formatFileSize(file.size)}</span>
            </div>
           
            <button type="button" class="file-remove" data-index=" ${index}"></button>`;
        
        // Remove file
        fileItem.querySelector('.file-remove').addEventListener('click', function() {
            files.splice(index, 1);
            updateFileList(upload, files);
        });
        
        fileList.appendChild(fileItem);
    });
    
    // Show/hide file list based on file count
    if (files.length > 0) {
        fileList.style.display = 'flex';
        fileList.style.visibility = 'visible';
        fileList.style.height = 'auto';
        fileList.style.margin = '';
    } else {
        fileList.style.display = 'none';
        fileList.style.visibility = 'hidden';
        fileList.style.height = '0';
        fileList.style.margin = '0';
    }
    
    // Show/hide upload button group based on file count
    if (files.length >= maxFiles) {
        buttonGroup.style.display = 'none';
    } else {
        buttonGroup.style.display = 'flex';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function initializePhoneInputs() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(function(input) {
        // Initialize intl-tel-input if available
        if (window.intlTelInput) {
            const iti = window.intlTelInput(input, {
                initialCountry: 'ru',
                preferredCountries: ['ru', 'kz', 'by', 'ua'],
                utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
                nationalMode: true,
                autoPlaceholder: 'aggressive'
            });
            
            // Store iti instance for validation
            input.iti = iti;
            
            // Update validation on input change
            input.addEventListener('input', function() {
                validateField(input);
            });
            
            input.addEventListener('blur', function() {
                validateField(input);
            });
        } else {
            // Fallback to basic phone formatting
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value[0] === '8') {
                        value = '7' + value.slice(1);
                    }
                    if (value[0] === '7') {
                        value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
                    }
                }
                e.target.value = value;
            });
        }
    });
}

function setupAddressSync() {
    const sameAddressCheckbox = document.getElementById('same-address');
    const factAddressInput = document.getElementById('address-fact');
    const regAddressInput = document.getElementById('address-reg');
    
    sameAddressCheckbox.addEventListener('change', function() {
        if (sameAddressCheckbox.checked) {
            regAddressInput.value = factAddressInput.value;
            regAddressInput.disabled = true;
        } else {
            regAddressInput.disabled = false;
        }
    });
    
    factAddressInput.addEventListener('input', function() {
        if (sameAddressCheckbox.checked) {
            regAddressInput.value = factAddressInput.value;
        }
    });
}

function setupSuccessModalEvents() {
    if (!successModal) return;
    
    // Закрытие модалки по кнопке
    const closeBtn = successModal.querySelector('.modal__close');
    const successCloseBtn = successModal.querySelector('.success-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeSuccessModal();
        });
    }
    
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', function() {
            closeSuccessModal();
        });
    }

    // Закрытие модалки по клику вне формы
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });

    // Закрытие модалки по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            closeSuccessModal();
        }
    });
}


function submitForm() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(function() {
            showSuccessModal();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
}

function showSuccessModal(title = 'Заявка успешно отправлена!', text = 'Мы получили вашу заявку и свяжемся с вами в ближайшее время.') {
    // Закрываем основную модалку
    closeModal();
    
    // Устанавливаем текст
    const titleElement = successModal.querySelector('.success-title');
    const textElement = successModal.querySelector('.success-text');
    
    if (titleElement) titleElement.textContent = title;
    if (textElement) textElement.textContent = text;
    
    // Показываем модалку успеха
    successModal.classList.add('active');
    document.body.classList.add('no-scroll');
    setScrollWindow(false);
}

function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    setScrollWindow(true);
}

function resetForm() {
    // Show form content
    form.style.display = 'block';
    
    form.reset();
    currentStep = 1;
    formData = {};
    fileUploads = {};
    
    // Clear all file lists and hide them
    document.querySelectorAll('.file-list').forEach(function(list) {
        list.innerHTML = '';
        list.style.display = 'none';
        list.style.visibility = 'hidden';
        list.style.height = '0';
        list.style.margin = '0';
    });
    
    // Show all upload button groups
    document.querySelectorAll('.file-btn_group').forEach(function(buttonGroup) {
        buttonGroup.style.display = 'flex';
    });
    
    // Clear all errors
    document.querySelectorAll('.error-message').forEach(function(error) {
        error.classList.remove('show');
    });
    
    document.querySelectorAll('.error, .valid').forEach(function(field) {
        field.classList.remove('error', 'valid');
    });
    
    // Reset address sync
    const regAddressInput = document.getElementById('address-reg');
    regAddressInput.disabled = false;
    
    showStep(1);
}

// ===== COOKIE NOTICE FUNCTIONALITY =====
function initCookieNotice() {
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptBtn = document.getElementById('cookie-accept');
    
    // Check if user already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookiesAccepted) {
        // Show cookie notice after a short delay
        setTimeout(() => {
            cookieNotice.classList.add('show');
        }, 1000);
    }
    
    // Handle accept button click
    acceptBtn.addEventListener('click', function() {
        // Hide cookie notice
        cookieNotice.classList.remove('show');
        
        // Save acceptance to localStorage
        localStorage.setItem('cookiesAccepted', 'true');
        
        // Optional: Add any cookie-related functionality here
        // For example, initialize analytics, etc.
    });
}

// ===== GALLERY MODAL FUNCTIONALITY =====
function initGalleryModal() {
    const galleries = document.querySelectorAll('.gallery');
    let modal = null;

    galleries.forEach((gallery) => {
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item) => {
            const img = item.querySelector('img');
            if (img) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openGalleryModal(img.src, img.alt);
                });
            }
        });
    });

    function createGalleryModal() {
        if (modal) return modal;

        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal__overlay">
                <div class="image-modal__content">
                    <button class="image-modal__close" id="gallery-modal-close">
                        <img src="./img/icons/close.svg" alt="Закрыть">
                    </button>
                    <img class="image-modal__img" id="gallery-modal-image" src="" alt="">
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    function openGalleryModal(src, alt) {
        const modalElement = createGalleryModal();
        const modalImage = modalElement.querySelector('#gallery-modal-image');
        const closeBtn = modalElement.querySelector('#gallery-modal-close');

        modalImage.src = src;
        modalImage.alt = alt;
        modalElement.classList.add('active');
        document.body.classList.add('no-scroll');

        // Close modal events
        closeBtn.addEventListener('click', closeGalleryModal);
        
        modalElement.addEventListener('click', function(e) {
            if (e.target === modalElement || e.target.classList.contains('image-modal__overlay')) {
                closeGalleryModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeGalleryModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }

    function closeGalleryModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Remove modal after animation
            setTimeout(() => {
                if (modal && modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                    modal = null;
                }
            }, 300);
        }
    }
}

