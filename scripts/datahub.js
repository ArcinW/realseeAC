// ===== Data Hub - All Data =====
        const DEVICES = ['伽罗华P4','伽罗华M2'];
        let currentSearchType = 'real';
        let filteredData = [];
        let currentDhPage = 1;
        function getItemsPerPage() { return window.innerWidth <= 768 ? 6 : 12; }
        let currentFilters = {};

        // ===== Search Type Switching =====
        function switchSearchType(type) {
            currentSearchType = type;
            document.querySelectorAll('.dh-search-type-btn').forEach(b=>{b.classList.toggle('active',b.dataset.type===type);});
            currentFilters = {};
            currentDhPage = 1;
            renderFilters();
            applyFilters();
        }

        // ===== Filter Rendering =====
        function renderFilters() {
            closeAllDropdowns();
            const bar = document.getElementById('dhFilterBar');
            let html = '';
            if(currentSearchType==='real') {
                                html += filterGroup('点位数','filterPoints',['全部','0-15','16-30','30以上']);
                html += filterGroup('面积','filterArea',['全部','0-50㎡','51-100㎡','101-200㎡','200㎡以上']);
                html += filterGroup('层数','filterFloor',['全部','1','2','3','4']);
                html += filterGroup('空间类型','filterSpaceType',['全部','精装修','清水房','毛坯房']);
            } else if(currentSearchType==='virtual') {
                                html += filterGroup('点位数','filterPoints',['全部','0-15','16-30','30以上']);
                html += filterGroup('面积','filterArea',['全部','0-50㎡','51-100㎡','100㎡以上']);
                html += filterGroup('风格','filterStyle',['全部','日式极简','法式复古','奶油风','新当代','混搭风','原木和风','现代轻奢','东方美学']);
            } else {
                html += filterGroup('交互能力','filterInteractive',['全部','可交互','不可交互']);
                html += filterGroup('家具类型','filterFurnitureType',['全部','儿童家具','卫浴','厨房用品','厨房电器','墙面装饰','屏风','布艺软装','床','数码产品','桌子','椅子','橱柜','沙发','灯具','电器','绿植','镜子','餐具']);
                html += filterGroup('风格','filterStyle',['全部','现代简约','新中式','田园','法式','北欧','其他','轻奢','传统中式']);
            }
            html += '<button class="dh-filter-reset" onclick="resetFilters()" title="重置筛选">重置</button>';
            bar.innerHTML = html;
        }

        function filterGroup(label, filterKey, options) {
            let opts = options.map((o,i)=>'<div class="custom-select-option'+(i===0?' active':'')+'" data-value="'+(i===0?'':o)+'" onclick="selectFilterOption(this,\''+filterKey+'\')">'+o+'</div>').join('');
            return '<div class="dh-filter-group"><span class="dh-filter-label">'+label+'</span><div class="custom-select" data-filter="'+filterKey+'" data-value=""><div class="custom-select-trigger" onclick="toggleDropdown(this)"><span>'+options[0]+'</span><svg class="custom-select-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div><div class="custom-select-options">'+opts+'</div></div></div>';
        }

        // ===== Custom Dropdown Logic =====
        function toggleDropdown(trigger) {
            const select = trigger.parentElement;
            const isOpen = select.classList.contains('open');
            closeAllDropdowns();
            if (!isOpen) {
                select.classList.add('open');
                // On mobile, position the dropdown with fixed to avoid clipping
                if (window.innerWidth <= 768) {
                    mountMobileDropdown(select);
                    positionMobileDropdown(select);
                }
            }
        }

        function closeAllDropdowns() {
            document.querySelectorAll('.custom-select.open').forEach(closeDropdown);
        }

        function closeDropdown(select) {
            restoreMobileDropdown(select);
            select.classList.remove('open');
        }

        function mountMobileDropdown(select) {
            const options = select.querySelector('.custom-select-options');
            if (!options || select._floatingOptions === options) return;
            const placeholder = document.createComment('mobile-filter-options');
            select.insertBefore(placeholder, options);
            select._optionsPlaceholder = placeholder;
            select._floatingOptions = options;
            document.body.appendChild(options);
            options.classList.add('mobile-floating');
        }

        function restoreMobileDropdown(select) {
            const options = select._floatingOptions;
            const placeholder = select._optionsPlaceholder;
            if (!options) return;
            options.classList.remove('mobile-floating');
            options.style.top = '';
            options.style.left = '';
            options.style.right = '';
            options.style.minWidth = '';
            options.style.maxWidth = '';
            options.style.maxHeight = '';
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.replaceChild(options, placeholder);
            } else if (!select.contains(options)) {
                select.appendChild(options);
            }
            select._floatingOptions = null;
            select._optionsPlaceholder = null;
        }

        function positionMobileDropdown(select) {
            const options = select._floatingOptions || select.querySelector('.custom-select-options');
            const trigger = select.querySelector('.custom-select-trigger');
            if (!options || !trigger) return;
            
            // Use a more robust method for Xiaomi 14 and other modern phones with notches
            const rect = trigger.getBoundingClientRect();
            
            // Account for safe area insets (notches, curved edges)
            const safeTop = window.visualViewport ? window.visualViewport.offsetTop : 0;
            const safeLeft = window.visualViewport ? window.visualViewport.offsetLeft : 0;
            const safeBottom = window.visualViewport ? 
                (window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop) : 0;
            const safeRight = window.visualViewport ? 
                (window.innerWidth - window.visualViewport.width - window.visualViewport.offsetLeft) : 0;
            
            // Use visual viewport if available (more accurate on mobile)
            const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
            const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            
            const gap = Math.max(8, safeTop, safeBottom, safeLeft, safeRight);
            const effectiveGap = gap + 4; // Add a little extra padding
            
            // Adjust rect for visual viewport offset
            const adjustedTop = rect.top - safeTop;
            const adjustedBottom = rect.bottom - safeTop;
            const adjustedLeft = rect.left - safeLeft;
            const adjustedRight = rect.right - safeLeft;
            
            const belowTop = adjustedBottom + 6;
            const spaceBelow = vh - belowTop - effectiveGap;
            const spaceAbove = adjustedTop - effectiveGap;
            const openAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
            const maxHeight = Math.max(120, Math.min(280, openAbove ? spaceAbove : spaceBelow));
            
            // Position relative to visual viewport
            const topPos = (openAbove ? 
                Math.max(effectiveGap, adjustedTop - maxHeight - 6) : 
                belowTop) + safeTop + 'px';
            const leftPos = Math.max(effectiveGap, adjustedLeft) + safeLeft + 'px';
            
            options.style.top = topPos;
            options.style.left = leftPos;
            options.style.right = 'auto';
            options.style.minWidth = Math.max(rect.width, 140) + 'px';
            options.style.maxWidth = (vw - effectiveGap * 2) + 'px';
            options.style.maxHeight = maxHeight + 'px';
            
            // Ensure it doesn't go off screen right
            const optWidth = Math.max(rect.width, 140);
            if (adjustedLeft + optWidth > vw - effectiveGap) {
                options.style.left = 'auto';
                options.style.right = (effectiveGap + safeRight) + 'px';
            }
            
            // Force reflow to ensure proper positioning
            options.offsetHeight;
        }

        // Reposition on scroll/resize for mobile
        window.addEventListener('scroll', function() {
            if (window.innerWidth <= 768) {
                document.querySelectorAll('.custom-select.open').forEach(s => {
                    positionMobileDropdown(s);
                });
            }
        }, true);
        window.addEventListener('resize', function() {
            document.querySelectorAll('.custom-select.open').forEach(s => {
                if (window.innerWidth <= 768) {
                    mountMobileDropdown(s);
                    positionMobileDropdown(s);
                } else {
                    closeDropdown(s);
                }
            });
        });
        function selectFilterOption(option, filterKey) {
            const select = option.closest('.custom-select') || document.querySelector('.custom-select[data-filter="'+filterKey+'"]');
            if (!select) return;
            const value = option.dataset.value;
            const text = option.textContent;
            select.dataset.value = value;
            select.querySelector('.custom-select-trigger span').textContent = text;
            const options = option.parentElement || select.querySelector('.custom-select-options');
            options.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            closeDropdown(select);
            currentFilters[filterKey] = value;
            applyFilters();
        }
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.custom-select')) {
                closeAllDropdowns();
            }
        });

        function applyFilters() {
            let sourceData = currentSearchType==='real' ? realData : currentSearchType==='virtual' ? virtualData : modelData;
            filteredData = sourceData.filter(item => {
                for(let key in currentFilters) {
                    const val = currentFilters[key];
                    if(!val) continue;
                                        if(key==='filterPoints') {
                        const p=item.points||0;
                        if(val==='0-15'&&p>15) return false;
                        if(val==='16-30'&&(p<16||p>30)) return false;
                        if(val==='30以上'&&p<=30) return false;
                    }
                    if(key==='filterArea') {
                        const a=item.area||0;
                        if(val==='0-50㎡'&&a>50) return false;
                        if(val==='51-100㎡'&&(a<51||a>100)) return false;
                        if(val==='101-200㎡'&&(a<101||a>200)) return false;
                        if(val==='200㎡以上'&&a<=200) return false;
                        if(val==='100㎡以上'&&a<=100) return false;
                    }
                    if(key==='filterFloor' && item.floor && item.floor!==parseInt(val)) return false;
                    if(key==='filterSpaceType' && item.spaceType!==val) return false;
                    if(key==='filterInteractive') {
                        const isInt = val==='可交互';
                        if(item.interactive!==isInt) return false;
                    }
                    if(key==='filterFurnitureType' && item.furnitureType!==val) return false;
                    if(key==='filterStyle' && item.style!==val) return false;
                }
                return true;
            });
            currentDhPage = 1;
            renderDataHub();
        }

        function resetFilters() {
            currentFilters = {};
            currentDhPage = 1;
            renderFilters();
            applyFilters();
        }

        function renderDataHub() {
            if(filteredData.length===0 && Object.keys(currentFilters).length===0) {
                let sourceData = currentSearchType==='real' ? realData : currentSearchType==='virtual' ? virtualData : modelData;
                filteredData = [...sourceData];
            }
            const grid=document.getElementById('dhGrid');
            const empty=document.getElementById('dhEmpty');
            const pagination=document.getElementById('dhPagination');
            if(filteredData.length===0){
                grid.innerHTML='';
                empty.style.display='block';
                pagination.innerHTML='';
                // 渲染推荐数据
                const allData=[...realData,...virtualData,...modelData];
                const catLabels2={real:'真实空间数据',virtual:'合成空间数据',model:'物品模型数据'};
                const catClasses2={real:'cat-real',virtual:'cat-virtual',model:'cat-model'};
                const recommended=allData.sort(()=>0.5-Math.random()).slice(0,4);
                const recEl=document.getElementById('dhEmptyRecommend');
                recEl.innerHTML='<div class="dh-empty-recommend-title">这些数据你可能感兴趣</div><div class="dh-empty-recommend-grid">'+recommended.map(r=>{
                    const rClass=catClasses2[r.cat]||'';
                    let rBadgeText=r.cat==='model'?r.furnitureType:(r.dataType||'');
                    let rInfo='';
                    if(r.cat==='model') {
                        rInfo=(r.interactive?'<span class="dh-card-tag interactive-tag" style="font-size:10px">可交互</span>':'')+'<span class="dh-card-tag" style="font-size:10px">'+r.furnitureType+'</span>';
                    } else {
                        rInfo='<span class="dh-card-tag" style="font-size:10px">'+(r.dataType||'')+'</span><span class="dh-card-tag" style="font-size:10px">'+(r.area?r.area+'㎡':'')+'</span>';
                    }
                    return '<div class="dh-card" onclick="openDetail('+r.id+',\''+r.cat+'\')"><div class="dh-card-img"><img src="'+r.img+'" alt="'+r.name+'" loading="lazy"><span class="dh-card-cat-badge '+rClass+'">'+rBadgeText+'</span></div><div class="dh-card-body"><h4 class="dh-card-name">'+r.name+'</h4><div class="dh-card-tags">'+rInfo+'</div></div></div>';
                }).join('')+'</div>';
                return;
            }
            empty.style.display='none';
            const totalPages=Math.ceil(filteredData.length/getItemsPerPage());
            const start=(currentDhPage-1)*getItemsPerPage();
            const pageItems=filteredData.slice(start,start+getItemsPerPage());
            const catLabels = {real:'真实空间数据',virtual:'合成空间数据',model:'物品模型数据'};
            const catClasses = {real:'cat-real',virtual:'cat-virtual',model:'cat-model'};
            grid.innerHTML=pageItems.map(item=>{
                const catLabel = catLabels[item.cat]||'';
                const catClass = catClasses[item.cat]||'';
                let badgeText = '';
                if(item.cat==='model') {
                    badgeText = item.furnitureType;
                } else {
                    badgeText = item.dataType||'';
                }
                let subInfo = '';
                if(item.cat==='model') {
                    // 模型卡片不显示subInfo，只显示标签
                } else {
                    subInfo = '<div class="dh-card-sub-info"><span>'+formatLayout(item.layout)+'</span><span>'+(item.area?item.area+'㎡':'')+'</span></div>';
                }
                let infoItems = '';
                if(item.cat!=='model') {
                    infoItems = '<div class="dh-card-info"><div class="dh-card-info-item"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 3v18" fill="none" stroke="currentColor" stroke-width="2"/></svg>'+catLabel+'</div></div>';
                }
                let tags = '';
                if(item.cat==='model') {
                    tags = '<div class="dh-card-tags">'+(item.interactive?'<span class="dh-card-tag interactive-tag">可交互</span>':'')+'<span class="dh-card-tag">'+item.furnitureType+'</span>'+(item.style?'<span class="dh-card-tag">'+item.style+'</span>':'')+'</div>';
                }
                let displayName = item.name;
                let logoOv=item.cat!=='model'?'<div class="dh-card-logo-overlay"><img src="https://vr-image-4.realsee-cdn.cn/release/web/如视_Loading_225x225_0000.ed1a05af.png" alt=""></div>':'';return '<div class="dh-card" onclick="openDetail('+item.id+',\''+item.cat+'\')"><div class="dh-card-img"><img src="'+item.img+'" alt="'+displayName+'" loading="lazy">'+logoOv+'</div><div class="dh-card-body"><h4 class="dh-card-name">'+displayName+'</h4>'+subInfo+infoItems+tags+'</div></div>';
            }).join('');
            let pHTML='<button class="dh-page-btn" onclick="goDhPage('+(currentDhPage-1)+')" '+(currentDhPage<=1?'disabled':'')+'>‹</button>';
            // Smart pagination: show first few, ellipsis, last few
            if(totalPages<=7) {
                for(let i=1;i<=totalPages;i++){pHTML+='<button class="dh-page-btn '+(i===currentDhPage?'active':'')+'" onclick="goDhPage('+i+')">'+i+'</button>';}
            } else {
                // Always show page 1
                pHTML+='<button class="dh-page-btn '+(1===currentDhPage?'active':'')+'" onclick="goDhPage(1)">1</button>';
                // Determine range around current page
                let rangeStart = Math.max(2, currentDhPage-1);
                let rangeEnd = Math.min(totalPages-1, currentDhPage+1);
                // Show ellipsis after page 1 if needed
                if(rangeStart>2) pHTML+='<span class="dh-page-ellipsis">…</span>';
                // Show pages around current
                for(let i=rangeStart;i<=rangeEnd;i++){pHTML+='<button class="dh-page-btn '+(i===currentDhPage?'active':'')+'" onclick="goDhPage('+i+')">'+i+'</button>';}
                // Show ellipsis before last page if needed
                if(rangeEnd<totalPages-1) pHTML+='<span class="dh-page-ellipsis">…</span>';
                // Always show last page
                pHTML+='<button class="dh-page-btn '+(totalPages===currentDhPage?'active':'')+'" onclick="goDhPage('+totalPages+')">'+totalPages+'</button>';
            }
            pHTML+='<button class="dh-page-btn" onclick="goDhPage('+(currentDhPage+1)+')" '+(currentDhPage>=totalPages?'disabled':'')+'>›</button>';
            pagination.innerHTML=pHTML;
        }
        function goDhPage(page) {
            const totalPages=Math.ceil(filteredData.length/getItemsPerPage());
            if(page<1||page>totalPages) return;
            currentDhPage=page;
            renderDataHub();
            
            // 三端兼容的滚动到顶部方案
            setTimeout(function() {
                // 方案1: 尝试滚动到 dh-hero（DataHub 页面顶部）
                const dhHero = document.querySelector('.dh-hero');
                const dhResults = document.querySelector('.dh-results');
                const pageDatahub = document.getElementById('pageDatahub');
                
                if (dhHero) {
                    dhHero.scrollIntoView({behavior: 'smooth', block: 'start'});
                } 
                // 方案2: 如果 dh-hero 不存在，滚动到 dh-results
                else if (dhResults) {
                    dhResults.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
                // 方案3: 回退到整个页面顶部
                else if (pageDatahub) {
                    pageDatahub.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
                // 方案4: 最后的回退方案
                else {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            }, 100); // 等待页面渲染完成
        }

        // ===== Detail Page View =====
        let currentDetailItem = null;
        function openDetail(id, cat) {
            let ds = {real:realData,virtual:virtualData,model:modelData};
            let item = (ds[cat]||realData).find(d=>d.id===id);
            if(!item) return;
            currentDetailItem = item;
            document.getElementById('detailImg').src = item.img;
            document.getElementById('detailTitle').textContent = item.name;
            const catLabels = {real:'真实空间数据',virtual:'合成空间数据',model:'物品模型数据'};
            const catClasses = {real:'cat-real',virtual:'cat-virtual',model:'cat-model'};
            document.getElementById('detailCat').textContent = catLabels[item.cat]||'';
            document.getElementById('detailCat').className = 'detail-cat '+catClasses[item.cat];
            // Props
            let propsHTML = '';
            if(item.cat==='model') {
                propsHTML += detailPropItem('家具类型', item.furnitureType);
                if(item.interactive) propsHTML += detailPropItem('交互能力', '可交互');
                propsHTML += detailPropItem('风格', item.style||'-');
            } else {
                if(item.cat==='real') {
                    // 真实数据：两两一行排列
                    let layoutText = '';
                    if(item.layout) {
                        let layoutParts = item.layout.split('-');
                        let layoutLabels = ['室','厅','厨','卫'];
                        layoutParts.forEach((v,idx)=>{ if(v!=='0' && idx<layoutLabels.length) layoutText += v+layoutLabels[idx]; });
                    }
                    propsHTML += '<div class="detail-prop-pair">' + detailPropItem('面积', item.area?item.area+'㎡':'') + detailPropItem('户型', layoutText) + '</div>';
                    propsHTML += '<div class="detail-prop-pair">' + detailPropItem('点位数', item.points||'') + detailPropItem('层数', item.floor||'') + '</div>';
                    propsHTML += '<div class="detail-prop-pair">' + detailPropItem('空间类型', item.spaceType||'') + detailPropItem('采集设备', (item.device&&item.device.startsWith('伽罗华'))?item.device:'伽罗华'+(item.device||'')) + '</div>';
                } else {
                    // 合成数据：面积+户型、点位数+风格
                    let layoutText = '';
                    if(item.layout) {
                        let layoutParts = item.layout.split('-');
                        let layoutLabels = ['室','厅','厨','卫'];
                        layoutParts.forEach((v,idx)=>{ if(v!=='0' && idx<layoutLabels.length) layoutText += v+layoutLabels[idx]; });
                    }
                    propsHTML += '<div class="detail-prop-pair">' + detailPropItem('面积', item.area?item.area+'㎡':'') + detailPropItem('户型', layoutText) + '</div>';
                    propsHTML += '<div class="detail-prop-pair">' + detailPropItem('点位数', item.points||'') + detailPropItem('风格', item.style||'') + '</div>';
                }
            }
            document.getElementById('detailProps').innerHTML = propsHTML;
            // VR按钮 - 真实和合成数据才显示
            const vrBtn = document.getElementById('detailVrBtn');
            if((item.cat==='real'||item.cat==='virtual') && item.vrLink) {
                vrBtn.href = item.vrLink;
                vrBtn.onclick = function(e){ window.open(item.vrLink,'_blank'); e.preventDefault(); };
                vrBtn.style.display = '';
            } else {
                vrBtn.style.display = 'none';
            }
            // 采集设备仅真实数据显示
            const deviceSection = document.querySelector('.detail-device');
            deviceSection.style.display = 'none';
            // Related
            let allData = [...realData,...virtualData,...modelData];
            let related = allData.filter(d=>d.id!==item.id && (d.cat===item.cat || d.furnitureType===item.furnitureType)).slice(0,3);
            if(related.length<3) related = allData.filter(d=>d.id!==item.id).slice(0,3);
            document.getElementById('detailRelated').innerHTML = related.map(r=>{
                const rCatLabel = catLabels[r.cat]||'';
                return '<div class="detail-related-card" onclick="openDetail('+r.id+',\''+r.cat+'\')"><img src="'+r.img+'" alt="'+r.name+'"><div class="detail-related-card-body"><p>'+r.name+'</p><span>'+rCatLabel+'</span></div></div>';
            }).join('');
            // Show detail, hide list
            document.querySelector('.dh-hero').style.display = 'none';
            document.querySelector('.dh-filters').style.display = 'none';
            document.querySelector('.dh-results').style.display = 'none';
            document.getElementById('detailView').classList.add('active');
            window.scrollTo({top:0,behavior:'smooth'});
        }
        function detailPropItem(label, value) {
            return '<div class="detail-prop"><span class="detail-prop-label">'+label+'</span><span class="detail-prop-value">'+value+'</span></div>';
        }
        function closeDetail() {
            document.querySelector('.dh-hero').style.display = '';
            document.querySelector('.dh-filters').style.display = '';
            document.querySelector('.dh-results').style.display = '';
            document.getElementById('detailView').classList.remove('active');
            document.querySelector('.dh-results').scrollIntoView({behavior:'smooth',block:'start'});
        }
