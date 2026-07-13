// ===== Navbar scroll =====
        const navbar = document.getElementById('navbar');

        // ===== Contact logic =====
        function handleContact(e) {
            e.preventDefault();
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                window.location.href = 'tel:15510062312';
            } else {
                // PC/Tablet: scroll to contact section on home page
                const currentPage = document.getElementById('pageHome').style.display;
                if (currentPage === 'none') {
                    switchPage('home');
                }
                setTimeout(() => {
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }

        function handlePhoneClick(e) {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) {
                // PC/Tablet: already on contact section, phone click does nothing
                e.preventDefault();
            }
            // Mobile: let the tel: link work naturally
        }
        window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

// ===== Tab switching =====
        document.querySelectorAll('.tab-btn').forEach(btn=>{
            btn.addEventListener('click',()=>{
                document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
                setTimeout(()=>observeFadeElements(),100);
            });
        });

        // ===== VR Banner - now directly embedded, no click-to-load needed =====

// ===== Resize: recalc pagination =====
        let lastPageSize = getItemsPerPage();
        window.addEventListener('resize', () => {
            const newSize = getItemsPerPage();
            if (newSize !== lastPageSize) {
                lastPageSize = newSize;
                currentDhPage = 1;
                renderDataHub();
            }
        });

// ===== Smooth scroll =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
            anchor.addEventListener('click',function(e){
                var href=this.getAttribute('href');
                if(!href||href==='#') return;
                e.preventDefault();
                var target=document.querySelector(href);
                if(target){var top=target.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top,behavior:'smooth'});}
            });
        });

// ===== ESC to close detail =====
        document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.getElementById('detailView').classList.contains('active'))closeDetail();});
