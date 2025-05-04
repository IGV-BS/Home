// Thumbnail gallery functionality
function changeCover(el) {
    const mainCover = document.getElementById('main-cover');
    const largeSrc = el.getAttribute('data-large');
    mainCover.src = largeSrc || el.src;
    
    document.querySelectorAll('.thumbnail').forEach(img => {
        img.classList.remove('border-accent');
    });
    el.classList.add('border-accent');
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize thumbnail gallery
    const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');
    if (thumbnails.length > 0) {
        thumbnails[0].classList.add('border-accent');
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => changeCover(thumbnail));
        });
    }

    // Tab functionality
    const tabs = document.querySelectorAll('.tab-button');
    const tabContent = document.getElementById('tab-content');
    const featuresTitle = document.getElementById('features-title');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            switch(tab.id) {
                case 'tab-details':
                    featuresTitle.textContent = 'Book Details';
                    tabContent.innerHTML = `<h3 class="tab-content-title">Details</h3>
                    <p>This book is a hardcover edition measuring 9 x 6 inches, containing 350 pages of high-quality paper. It includes a foreword by a celebrated author and an index for easy reference.</p>`;
                    break;
                case 'tab-specifications':
                    featuresTitle.textContent = 'Book Specifications';
                    tabContent.innerHTML = `<h3 class="tab-content-title">Specifications</h3>
                    <ul class="list-disc list-inside text-gray-700">
                        <li>Dimensions: 9 x 6 inches</li>
                        <li>Weight: 1.2 lbs</li>
                        <li>Pages: 350</li>
                        <li>Cover: Genuine leather with gold foil embossing</li>
                        <li>Illustrations: 50+ full-color</li>
                        <li>ISBN: 978-1-23456-789-0</li>
                    </ul>`;
                    break;
                case 'tab-shipping':
                    featuresTitle.textContent = 'Order Shipping';
                    tabContent.innerHTML = `<h3 class="tab-content-title">Shipping</h3>
                    <p>We offer worldwide shipping with estimated delivery times:</p>
                    <ul class="list-disc list-inside text-gray-700">
                        <li>USA: 3-5 business days</li>
                        <li>Europe: 5-7 business days</li>
                        <li>Asia: 7-10 business days</li>
                        <li>Other regions: 10-15 business days</li>
                    </ul>
                    <p class="mt-2">Free shipping on orders over $75.</p>`;
                    break;
                case 'tab-returns':
                    featuresTitle.textContent = 'Order Returns';
                    tabContent.innerHTML = `<h3 class="tab-content-title">Returns</h3>
                    <p>We accept returns within 30 days of purchase. The book must be in original condition and packaging. To initiate a return, please contact our support team with your order details.</p>`;
                    break;
                default:
                    featuresTitle.textContent = 'Book Details';
                    tabContent.innerHTML = `<h3 class="tab-content-title">Details</h3>
                    <p>This book is a hardcover edition measuring 9 x 6 inches, containing 350 pages of high-quality paper. It includes a foreword by a celebrated author and an index for easy reference.</p>`;
            }
        });
    });

    // PDF viewer functionality
    const mainD = document.getElementById('main-d');
    const fullscreenBtn = document.getElementById('pdf-fullscreen-btn');
    const pageInfo = document.getElementById('pdf-page-info');
    const pdfScroll = mainD.querySelector('.pdf-scroll');
    const pdfPagesContainer = document.getElementById('pdf-pages-container');
    const firstPage = document.querySelector('#pdf-pages-container img.pdf-page:first-child');
    const lockedPages = document.querySelectorAll('.locked-page');
    const scrollUpBtn = document.getElementById('scroll-up');
    const scrollDownBtn = document.getElementById('scroll-down');

    if (firstPage) {
        firstPage.classList.add('first-pdf-page');
        firstPage.style.setProperty('filter', 'none', 'important');
        firstPage.style.setProperty('pointer-events', 'auto', 'important');

        const observer = new MutationObserver(() => {
            firstPage.style.setProperty('filter', 'none', 'important');
            firstPage.style.setProperty('pointer-events', 'auto', 'important');
        });
        observer.observe(firstPage, { attributes: true, attributeFilter: ['style'] });
    }

    // Page tracking
    const pages = Array.from(pdfPagesContainer.querySelectorAll('img.pdf-page'));
    const totalPages = pages.length;
    let currentPage = 1;

    const updatePageInfo = (page) => {
        pageInfo.textContent = `Page ${page} of ${totalPages}`;
    };

    const onScroll = () => {
        const scrollTop = pdfScroll.scrollTop;
        const scrollPosition = scrollTop + pdfScroll.clientHeight / 2;
        const pageOffsets = pages.map(page => page.offsetTop - pdfPagesContainer.offsetTop);

        let pageFound = 1;
        for (let i = 0; i < pageOffsets.length; i++) {
            if (scrollPosition >= pageOffsets[i] && (i === pageOffsets.length - 1 || scrollPosition < pageOffsets[i + 1])) {
                pageFound = i + 1;
                break;
            }
        }

        if (pageFound !== currentPage) {
            currentPage = pageFound;
            updatePageInfo(currentPage);
        }
    };

    pdfScroll.addEventListener('scroll', onScroll);
    updatePageInfo(1);

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            mainD.requestFullscreen().catch(err => {
                console.error(`Error enabling fullscreen: ${err.message}`);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });

    // Locked pages interaction
    lockedPages.forEach(page => {
        page.addEventListener('click', (e) => {
            e.preventDefault();
            alert('This page is locked. Please purchase the book to unlock all pages.');
        });
    });

    // Scroll buttons
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    // Contact popup functionality
    const contactLink = document.querySelector('.contact-link');
    const contactPopup = document.getElementById('contact-popup');
    const closePopup = document.getElementById('close-popup');
    const openPopupBtn = document.getElementById('open-popup');

    const togglePopup = (show) => {
        contactPopup.classList.toggle('active', show);
    };

    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        togglePopup(true);
    });

    openPopupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        togglePopup(true);
    });

    closePopup.addEventListener('click', () => {
        togglePopup(false);
    });

    contactPopup.addEventListener('click', (e) => {
        if (e.target === contactPopup) {
            togglePopup(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactPopup.classList.contains('active')) {
            togglePopup(false);
        }
    });

    // Prevent screenshot tools
    document.addEventListener('keyup', (e) => {
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText('Screenshots are disabled.');
            alert('Screenshots are disabled on this page.');
        }
    });

    // Disable print functionality
    window.onbeforeprint = () => false;
});

// Prevent zoom on input focus
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('focus', function() {
        window.scrollTo(0, 0);
        document.body.style.transform = 'scale(1)';
      });
    });
  });

  // Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const nav = document.querySelector('.nav');

if (mobileMenuButton && nav) {
  mobileMenuButton.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}