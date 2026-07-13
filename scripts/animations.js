// 添加视频状态监听器，自动更新按钮图标
                    document.addEventListener('DOMContentLoaded', function() {
                        var modelBanner = document.querySelector('.model-banner');
                        if (modelBanner) {
                            var video = modelBanner.querySelector('video');
                            var button = modelBanner.querySelector('button');
                            if (video && button) {
                                // 更新按钮图标函数
                                var updateButtonIcon = function() {
                                    var use = button.querySelector('svg use');
                                    if (use) {
                                        use.setAttribute('href', video.paused ? '#icon-play' : '#icon-pause');
                                    }
                                };
                                
                                // 按钮点击事件 - 使用最简单直接的方式
                                button.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    try {
                                        if (video.paused) {
                                            // 如果视频是暂停状态，尝试播放
                                            video.play().then(function() {
                                                updateButtonIcon();
                                            }).catch(function(err) {
                                                console.log('播放失败:', err);
                                                // 如果播放失败，仍然更新图标为播放按钮
                                                updateButtonIcon();
                                            });
                                        } else {
                                            // 如果视频在播放，暂停它
                                            video.pause();
                                            updateButtonIcon();
                                        }
                                    } catch (error) {
                                        console.log('按钮点击错误:', error);
                                    }
                                });
                                
                                // 监听视频状态变化
                                video.addEventListener('play', updateButtonIcon);
                                video.addEventListener('pause', updateButtonIcon);
                                video.addEventListener('ended', updateButtonIcon);
                                video.addEventListener('error', updateButtonIcon);
                                
                                // 修复：视频可能已经自动播放，所以初始化图标
                                setTimeout(updateButtonIcon, 300);
                                
                                // 修复：额外检查，如果3秒后视频在播放，确保按钮状态正确
                                setTimeout(function() {
                                    updateButtonIcon();
                                }, 3000);
                            }
                        }
                    });

// ===== Particle Animation =====
        (function() {
            const canvas = document.getElementById('particleCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let particles = [];
            const PARTICLE_COUNT = 60;
            function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
            resize(); window.addEventListener('resize', resize);
            class Particle {
                constructor() { this.reset(); }
                reset() { this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height; this.size = Math.random()*1.5+0.5; this.speedX = (Math.random()-0.5)*0.3; this.speedY = (Math.random()-0.5)*0.3; this.opacity = Math.random()*0.4+0.1; this.hue = 250+Math.random()*30; }
                update() { this.x += this.speedX; this.y += this.speedY; if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset(); }
                draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle='hsla('+this.hue+',70%,70%,'+this.opacity+')'; ctx.fill(); }
            }
            for(let i=0;i<PARTICLE_COUNT;i++) particles.push(new Particle());
            function animate() {
                ctx.clearRect(0,0,canvas.width,canvas.height);
                particles.forEach(p=>{p.update();p.draw();});
                for(let i=0;i<particles.length;i++){for(let j=i+1;j<particles.length;j++){const dx=particles[i].x-particles[j].x;const dy=particles[i].y-particles[j].y;const dist=Math.sqrt(dx*dx+dy*dy);if(dist<120){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle='rgba(113,61,255,'+(0.06*(1-dist/120))+')';ctx.lineWidth=0.5;ctx.stroke();}}}
                requestAnimationFrame(animate);
            }
            animate();
        })();

// ===== Dataset Scroll =====
        function scrollDataset(dir) {
            const s = document.getElementById('datasetScroll');
            const cardWidth = 304; // .dataset-card 宽度 + gap
            const scrollAmount = dir * cardWidth;
            const currentScroll = s.scrollLeft;
            const maxScroll = s.scrollWidth - s.clientWidth;
            
            // 边界检查：不能滚动超出范围
            if (dir === -1 && currentScroll <= 0) {
                return; // 已经在最左侧，不能向左滚动
            }
            if (dir === 1 && currentScroll >= maxScroll - 1) {
                return; // 已经在最右侧，不能向右滚动
            }
            
            s.scrollBy({left: scrollAmount, behavior: 'smooth'});
            
            // 更新导航按钮状态
            updateDatasetNavButtons();
        }
        
        function updateDatasetNavButtons() {
            const s = document.getElementById('datasetScroll');
            const currentScroll = s.scrollLeft;
            const maxScroll = s.scrollWidth - s.clientWidth;
            const prevBtn = document.querySelector('.dataset-nav-btn.prev');
            const nextBtn = document.querySelector('.dataset-nav-btn.next');
            
            // 移动端和PC端都显示导航按钮，但移动端有不同样式
            const isMobile = window.innerWidth <= 768;
            
            if (prevBtn) {
                // 根据滚动位置调整按钮状态
                const atStart = currentScroll <= 1;
                prevBtn.style.opacity = atStart ? '0.3' : (isMobile ? '0.8' : '1');
                prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
                prevBtn.style.cursor = atStart ? 'default' : 'pointer';
            }
            if (nextBtn) {
                // 根据滚动位置调整按钮状态
                const atEnd = currentScroll >= maxScroll - 1;
                nextBtn.style.opacity = atEnd ? '0.3' : (isMobile ? '0.8' : '1');
                nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
                nextBtn.style.cursor = atEnd ? 'default' : 'pointer';
            }
        }
        
        // 初始化时检查按钮状态
        document.addEventListener('DOMContentLoaded', function() {
            const scrollEl = document.getElementById('datasetScroll');
            if (scrollEl) {
                // 添加触摸滚动事件监听器，滚动后更新按钮状态
                let scrollTimeout;
                scrollEl.addEventListener('scroll', function() {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(function() {
                        updateDatasetNavButtons();
                    }, 100);
                });
                // 监听滚动事件
                scrollEl.addEventListener('scroll', updateDatasetNavButtons);
                // 初始检查
                setTimeout(updateDatasetNavButtons, 100);
                // 窗口大小变化时重新检查
                window.addEventListener('resize', updateDatasetNavButtons);
            }
        });

// ===== Scroll fade-up =====
        function observeFadeElements() {
            const observer=new IntersectionObserver((entries)=>{
                entries.forEach((entry)=>{
                    if(entry.isIntersecting){
                        const siblings=Array.from(entry.target.parentElement.children).filter(c=>c.classList.contains('fade-up'));
                        const delay=siblings.indexOf(entry.target)*80;
                        setTimeout(()=>entry.target.classList.add('visible'),delay);
                        observer.unobserve(entry.target);
                    }
                });
            },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
            document.querySelectorAll('.fade-up:not(.visible)').forEach(el=>observer.observe(el));
        }
        observeFadeElements();

// ===== Counter Animation =====
        function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

        function animateCounter(el) {
            const target = parseInt(el.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutExpo(progress);
                const current = Math.floor(easedProgress * target);

                // Format: show as X万
                if (target >= 10000) {
                    el.textContent = Math.round(current / 10000);
                } else {
                    el.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    // Final value
                    if (target >= 10000) {
                        el.textContent = target / 10000;
                    } else {
                        el.textContent = target;
                    }
                }
            }
            requestAnimationFrame(update);
        }

        function observeCounters() {
            const statsSection = document.querySelector('.hero-stats');
            if (!statsSection) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counters = entry.target.querySelectorAll('.counter');
                        counters.forEach((counter, index) => {
                            setTimeout(() => animateCounter(counter), index * 200);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(statsSection);
        }
        observeCounters();

// ===== WeChat Video Autoplay Helper (videoPanorama 真实模式) =====
        (function() {
            function isWeChatBrowser() {
                var ua = navigator.userAgent.toLowerCase();
                return /micromessenger/.test(ua) &&
                    !/wxwork/.test(ua) &&
                    !/miniprogram/.test(ua) &&
                    window.__wxjs_environment !== 'miniprogram';
            }

            function isIOS() {
                return /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
            }

            // 获取视频封面图（首帧或默认）
            function getVideoCover(video) {
                // 如果有 poster 属性，使用它
                if (video.getAttribute('poster')) {
                    return video.getAttribute('poster');
                }
                
                // 否则使用视频缩略图（首帧）
                var canvas = document.createElement('canvas');
                canvas.width = video.videoWidth || 300;
                canvas.height = video.videoHeight || 200;
                var ctx = canvas.getContext('2d');
                
                // 尝试捕获首帧
                if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    return canvas.toDataURL('image/jpeg', 0.8);
                }
                
                // 回退到默认封面
                return 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#130525"/><path d="M110 80 L190 130 L110 130 Z" fill="rgba(113,61,255,0.3)" stroke="rgba(113,61,255,0.6)" stroke-width="2"/></svg>');
            }

            // videoPanorama 真实自动播放逻辑
            function initVideoPanoramaAutoPlay(video) {
                // 1. 设置 videoPanorama 相同的属性
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('x5-playsinline', '');
                video.setAttribute('x5-video-player-type', 'h5-page');
                video.playsInline = true;
                video.muted = true;
                
                // 2. 添加封面图兜底
                var container = video.parentElement;
                if (container && !container.querySelector('.video-cover-fallback')) {
                    var cover = document.createElement('div');
                    cover.className = 'video-cover-fallback';
                    cover.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background-size:cover;background-position:center;z-index:1;transition:opacity 0.3s;';
                    
                    // 设置封面图
                    var coverUrl = getVideoCover(video);
                    cover.style.backgroundImage = 'url(\"' + coverUrl + '\")';
                    
                    container.style.position = 'relative';
                    container.appendChild(cover);
                    
                    // 视频开始播放时隐藏封面
                    video.addEventListener('play', function() {
                        cover.style.opacity = '0';
                    });
                    
                    video.addEventListener('pause', function() {
                        if (video.ended || video.currentTime === 0) {
                            cover.style.opacity = '1';
                        }
                    });
                    
                    video.addEventListener('ended', function() {
                        cover.style.opacity = '1';
                    });
                }
                
                // 3. iOS + 微信：使用 videoPanorama 的真实自动播放逻辑
                if (isIOS() && isWeChatBrowser()) {
                    // videoPanorama 模式：直接自动播放（通过 WeixinJSBridge）
                    if (window.WeixinJSBridge) {
                        window.WeixinJSBridge.invoke('getNetworkType', {}, function() {
                            video.play().catch(function(err) {
                                console.log('iOS 微信自动播放失败:', err);
                                // 如果自动播放失败，显示播放按钮
                                showVideoPlayButton(video);
                            });
                        });
                    } else {
                        document.addEventListener("WeixinJSBridgeReady", function() {
                            window.WeixinJSBridge.invoke('getNetworkType', {}, function() {
                                video.play().catch(function(err) {
                                    console.log('iOS 微信自动播放失败:', err);
                                    showVideoPlayButton(video);
                                });
                            });
                        }, false);
                    }
                } 
                // 4. 非 iOS 微信：直接尝试自动播放
                else {
                    video.play().catch(function(err) {
                        console.log('非 iOS 微信自动播放失败:', err);
                        showVideoPlayButton(video);
                    });
                }
            }

            // 显示播放按钮（仅在自动播放失败时）
            function showVideoPlayButton(video) {
                var container = video.parentElement;
                if (!container || container.querySelector('.video-play-overlay')) return;
                
                // 只在第一个视频（物品模型数据tab下的首个卡片）不显示按钮
                var isFirstModelVideo = container.closest('.data-card') && 
                                       container.closest('.data-card').querySelector('h4').textContent === '视频' &&
                                       document.querySelector('.tab-btn.active[data-tab="model"]');
                
                if (isFirstModelVideo) {
                    // 物品模型数据tab下的首个视频已经有暂停按钮，不额外添加
                    return;
                }
                
                var overlay = document.createElement('div');
                overlay.className = 'video-play-overlay';
                overlay.innerHTML = '<button class="video-play-btn"><svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(113,61,255,0.9)"/><path d="M32 24L20 30.9282V17.0718L32 24Z" fill="white"/></svg><span>播放视频</span></button>';
                
                overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);z-index:12;border-radius:inherit;';
                
                var btn = overlay.querySelector('.video-play-btn');
                btn.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:transparent;border:none;cursor:pointer;';
                
                btn.querySelector('span').style.cssText = 'color:white;font-size:13px;font-weight:600;letter-spacing:0.5px;margin-top:4px;';
                
                btn.onclick = function() {
                    video.play().then(function() {
                        overlay.style.display = 'none';
                    }).catch(function(err) {
                        console.log('手动播放失败:', err);
                    });
                };
                
                container.appendChild(overlay);
            }

            // 初始化所有视频
            function initAllVideos() {
                document.querySelectorAll('video[autoplay]').forEach(function(video, index) {
                    // 先设置封面图
                    setTimeout(function() {
                        initVideoPanoramaAutoPlay(video);
                    }, index * 500); // 错开初始化时间，避免同时发起请求
                });
            }

            // 执行初始化
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initAllVideos, 1000); // 页面加载后延迟执行
            });
            
            // 页面可见性变化时重试播放（页面切回时）
            document.addEventListener('visibilitychange', function() {
                if (!document.hidden) {
                    setTimeout(function() {
                        document.querySelectorAll('video[autoplay]').forEach(function(video) {
                            if (video.paused) {
                                video.play().catch(function() {});
                            }
                        });
                    }, 300);
                }
            });
        })();
