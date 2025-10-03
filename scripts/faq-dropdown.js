document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-dropdown-item');
    
    faqItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');
            
            faqItems.forEach(function(otherItem) {
                otherItem.classList.remove('open');
            });
            
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
});
