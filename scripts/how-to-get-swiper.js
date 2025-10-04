document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper === 'undefined') {
        return;
    }

    const howToGetSwiper = new Swiper('.swiper-how-to-get', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false,
        centeredSlides: false,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            750: {
                slidesPerView: 2,
                spaceBetween: 20
            }
        },
        navigation: {
            nextEl: '.swiper-how-to-get .swiper-custom-navigation__next',
            prevEl: '.swiper-how-to-get .swiper-custom-navigation__prev',
        },
        pagination: {
            el: '.swiper-how-to-get .swiper-custom__pagination',
            clickable: true
        }
    });

    // Image modal functionality
    initImageModal();
});

function initImageModal() {
    const howToGetItems = document.querySelectorAll('.how-to-get__item');
    let modal = null;

    // Open modal on item click
    howToGetItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openImageModal(img.src, img.alt);
            }
        });
    });

    function createModal() {
        if (modal) return modal;

        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal__overlay">
                <div class="image-modal__content">
                    <button class="image-modal__close" id="image-modal-close">
                        <img src="./img/icons/close.svg" alt="Закрыть">
                    </button>
                    <img class="image-modal__img" id="modal-image" src="" alt="">
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    function openImageModal(src, alt) {
        const modalElement = createModal();
        const modalImage = modalElement.querySelector('#modal-image');
        const closeBtn = modalElement.querySelector('#image-modal-close');

        modalImage.src = src;
        modalImage.alt = alt;
        modalElement.classList.add('active');
        document.body.classList.add('no-scroll');

        // Close modal events
        closeBtn.addEventListener('click', closeImageModal);
        
        modalElement.addEventListener('click', function(e) {
            if (e.target === modalElement || e.target.classList.contains('image-modal__overlay')) {
                closeImageModal();
            }
        });

        // Close on Escape key
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeImageModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    function closeImageModal() {
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
