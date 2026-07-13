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
        function switchPage(page) {
            currentPage = page;
            document.getElementById('pageHome').style.display = page==='home'?'block':'none';
            document.getElementById('pageDatahub').style.display = page==='datahub'?'block':'none';
            document.querySelectorAll('.nav-home-link').forEach(a=>{a.style.opacity=page==='home'?'1':'0.5';});
            const dhl = document.querySelector('.nav-datahub-link');
            if(dhl) dhl.style.opacity = page==='datahub'?'1':'0.7';
            // nav-cta (联系我们) always stays full opacity
            const cta = document.querySelector('.nav-cta');
            if(cta) cta.style.opacity = '1';
            // Reset detail view when switching pages
            if(page==='datahub') {
                closeDetail();
                renderFilters();
                applyFilters();
            } else {
                setTimeout(()=>observeFadeElements(),100);
            }
            window.scrollTo({top:0,behavior:'smooth'});
            // Update URL hash
            if(page==='datahub') {
                history.replaceState(null, '', '#datahub');
            } else {
                history.replaceState(null, '', window.location.pathname);
            }
        }

        // Hash-based routing
        function handleHash() {
            const hash = window.location.hash.replace('#','');
            if(hash === 'datahub') {
                switchPage('datahub');
            } else if(hash) {
                // Home page sections - switch to home and scroll to section
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
