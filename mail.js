function init() {

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const lightIcon = document.getElementById('theme-toggle-light-icon');

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                if (lightIcon) lightIcon.classList.remove('hidden');
                if (darkIcon) darkIcon.classList.add('hidden');
            } else {
                document.documentElement.classList.remove('dark');
                if (darkIcon) darkIcon.classList.remove('hidden');
                if (lightIcon) lightIcon.classList.add('hidden');
            }
        };
        
        // Apply theme on initial load
        const savedTheme = localStorage.getItem('color-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('color-theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // --- Mobile Menu ---
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const overlay = document.getElementById("overlay");

    if (menuToggle && mobileMenu && overlay) {
        const closeMenu = () => {
            mobileMenu.classList.add("-translate-x-full");
            overlay.classList.add("hidden");
        };

        menuToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("-translate-x-full");
            overlay.classList.toggle("hidden");
        });

        overlay.addEventListener("click", closeMenu);
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- Contact Modal ---
    const contactModal = document.getElementById('contactModal');
    const openModalBtns = document.querySelectorAll('#openContactModal, .open-contact-btn');
    const closeModalBtn = document.getElementById('closeModal');

    if (contactModal && closeModalBtn) {
        const modalContent = contactModal.querySelector('div');

        function openContactModal(e) {
            if (e) e.preventDefault();
            contactModal.classList.remove('hidden');
            contactModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                if(modalContent) {
                    modalContent.classList.remove('scale-90', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }
            }, 10);
        }

        function closeContactModal() {
            if(modalContent) {
                modalContent.classList.remove('scale-100', 'opacity-100');
                modalContent.classList.add('scale-90', 'opacity-0');
            }
            setTimeout(() => {
                contactModal.classList.add('hidden');
                contactModal.classList.remove('flex');
                document.body.style.overflow = '';
            }, 300);
        }

        openModalBtns.forEach(btn => {
            btn.addEventListener('click', openContactModal);
        });
        closeModalBtn.addEventListener('click', closeContactModal);
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) closeContactModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !contactModal.classList.contains('hidden')) {
                closeContactModal();
            }
        });
    }

    // --- Success Modal ---
    const successModal = document.getElementById("successModal");
    if (successModal) {
        const closeSuccessBtn = document.getElementById("closeSuccessModal");
        const homeBtn = document.getElementById("goHomeButton");

        function closeSuccessModal() {
            successModal.classList.add("hidden");
            successModal.classList.remove("flex");
            document.body.style.overflow = '';
        }

        if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeSuccessModal);
        if (homeBtn) {
             homeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                closeSuccessModal();
            });
        }
        successModal.addEventListener("click", (e) => {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !successModal.classList.contains('hidden')) {
                closeSuccessModal();
            }
        });
    }

    // --- EmailJS Form Submission ---
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        if (typeof emailjs !== 'undefined') {
            (function(){
                emailjs.init({
                    publicKey: "YcueGlES5XY04shEy",
                });
            })();

            contactForm.addEventListener("submit", function(event){
                event.preventDefault();

                const contactModal = document.getElementById('contactModal');
                const modalContent = contactModal?.querySelector('div');

                if (contactModal && modalContent) {
                    modalContent.classList.remove('scale-100', 'opacity-100');
                    modalContent.classList.add('scale-90', 'opacity-0');
                    setTimeout(() => {
                        contactModal.classList.add('hidden');
                        contactModal.classList.remove('flex');
                        document.body.style.overflow = '';
                    }, 300);
                }

                const templateParams = {
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    message: document.getElementById("message").value,
                    time: new Date().toLocaleString(),
                    subject: "Your Portfolio",
                };

                emailjs.send("service_tnd8hid", "template_aekxfsl", templateParams)
                    .then(function(response) {
                        console.log("Email successfully sent!", response.status, response.text);
                        contactForm.reset();
                        
                        const successModal = document.getElementById("successModal");
                        if (successModal) {
                            successModal.classList.remove("hidden");
                            successModal.classList.add("flex");
                            document.body.style.overflow = 'hidden';
                        }
                    }, function(error) {
                        console.error("Failed to send email:", error);
                        alert("Oops! Something went wrong. Please try again.");
                    });
            });
        } else {
            console.warn("EmailJS not loaded, skipping initialization.");
        }
    }

    // --- Intersection Observer for animations ---
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    } else {
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            el.classList.add('animate');
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}