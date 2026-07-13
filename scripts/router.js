// ===== Mobile Navigation =====
        function toggleMobileNav() {
            var btn = document.getElementById('navHamburger');
            var menu = document.getElementById('navMobileMenu');
            btn.classList.toggle('open');
            menu.classList.toggle('open');
        }
        function closeMobileNav() {
            var btn = document.getElementById('navHamburger');
            var menu = document.getElementById('navMobileMenu');
            btn.classList.remove('open');
            menu.classList.remove('open');
        }

        // ===== Page Switching =====
        let currentPage = 'home';
        function updateRoute(page) {
            if (window.location.protocol === 'file:') {
                const hash = page === 'news' ? '#news' : (page === 'datahub' ? '#datahub' : '');
                history.replaceState(null, '', hash || window.location.pathname);
                return;
            }
            if(page==='datahub') {
                history.replaceState(null, '', '#datahub');
            } else if(page==='news') {
                history.replaceState(null, '', '/news');
            } else {
                history.replaceState(null, '', '/');
            }
        }
        function switchPage(page) {
            currentPage = page;
            document.getElementById('pageHome').style.display = page==='home'?'block':'none';
            document.getElementById('pageDatahub').style.display = page==='datahub'?'block':'none';
            document.getElementById('pageNews').style.display = page==='news'?'block':'none';
            document.querySelectorAll('[data-page-link]').forEach(a=>{
                a.classList.toggle('nav-current', a.dataset.pageLink===page);
            });
            if(page==='datahub') {
                closeDetail();
                renderFilters();
                applyFilters();
            } else if(page==='news') {
                closeDetail();
                renderNewsPage();
                setTimeout(()=>observeFadeElements(),100);
            } else {
                closeDetail();
                setTimeout(()=>observeFadeElements(),100);
            }
            window.scrollTo({top:0,behavior:'smooth'});
            updateRoute(page);
        }

        // Hash-based routing
        function handleHash() {
            const normalizedPath = window.location.pathname.replace(/\/$/, '');
            if(normalizedPath === '/news') {
                switchPage('news');
                return;
            }
            const hash = window.location.hash.replace('#','');
            if(hash === 'news') {
                switchPage('news');
            } else if(hash === 'datahub') {
                switchPage('datahub');
            } else if(hash) {
                switchPage('home');
                setTimeout(()=>{
                    const el = document.getElementById(hash);
                    if(el) el.scrollIntoView({behavior:'smooth'});
                }, 150);
            } else {
                switchPage('home');
            }
        }
        window.addEventListener('hashchange', handleHash);
        // Handle initial hash on page load
        document.addEventListener('DOMContentLoaded', function() {
            handleHash();
        });
