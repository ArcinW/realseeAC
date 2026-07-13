(function () {
        var SHARE = {
            title: '如视空间数据平台',
            desc: '如视正在建设AI时代领先的真实空间数据基础设施。',
            imgUrl: 'https://vr-image-4.realsee-cdn.cn/release/web/%E5%BE%AE%E4%BF%A1%E5%B0%81%E9%9D%A2.3b62d4a5.jpg'
        };
        var SIGN_API = '/api/wechat/getWechatGZHsignature';

        function isWxBrowser() {
            var ua = navigator.userAgent.toLowerCase();
            return /micromessenger/.test(ua) &&
                !/wxwork/.test(ua) &&
                !/miniprogram/.test(ua) &&
                window.__wxjs_environment !== 'miniprogram';
        }

        function nonceStr() {
            return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
        }

        function sha1(str) {
            var buf = new TextEncoder().encode(str);
            return crypto.subtle.digest('SHA-1', buf).then(function (digest) {
                return Array.prototype.map.call(new Uint8Array(digest), function (b) {
                    return b.toString(16).padStart(2, '0');
                }).join('');
            });
        }

        function initWxShare() {
            if (!isWxBrowser() || !window.wx || !window.crypto || !crypto.subtle) return;

            fetch(SIGN_API, { credentials: 'include' })
                .then(function (r) { return r.json(); })
                .then(function (resp) {
                    var data = resp && resp.data;
                    if (!data || !data.ticket || !data.appid) return;

                    // timestamp 用毫秒，与签名串保持一致即可（与项目现有实现一致）
                    var timestamp = Date.now();
                    var noncestr = nonceStr();
                    var url = location.href.split('#')[0];
                    // 键名按字典序排列：jsapi_ticket < noncestr < timestamp < url
                    var raw = 'jsapi_ticket=' + data.ticket +
                              '&noncestr=' + noncestr +
                              '&timestamp=' + timestamp +
                              '&url=' + url;

                    return sha1(raw).then(function (signature) {
                        var wx = window.wx;
                        wx.config({
                            debug: false,
                            appId: data.appid,
                            timestamp: timestamp,
                            nonceStr: noncestr,
                            signature: signature,
                            jsApiList: [
                                'updateAppMessageShareData',
                                'updateTimelineShareData',
                                'onMenuShareAppMessage',
                                'onMenuShareTimeline',
                                'showOptionMenu'
                            ]
                        });

                        wx.ready(function () {
                            var msgCfg = {
                                title: SHARE.title,
                                desc: SHARE.desc,
                                link: location.href,
                                imgUrl: SHARE.imgUrl
                            };
                            var timelineCfg = {
                                title: SHARE.title,
                                link: location.href,
                                imgUrl: SHARE.imgUrl
                            };
                            if (wx.showOptionMenu) wx.showOptionMenu();
                            // 新版 API（微信 6.7.2+）
                            if (wx.updateAppMessageShareData) wx.updateAppMessageShareData(msgCfg);
                            if (wx.updateTimelineShareData) wx.updateTimelineShareData(timelineCfg);
                            // 旧版 API 兼容
                            if (wx.onMenuShareAppMessage) wx.onMenuShareAppMessage(msgCfg);
                            if (wx.onMenuShareTimeline) wx.onMenuShareTimeline(timelineCfg);
                        });

                        wx.error(function () { /* 签名失败时静默，不影响页面 */ });
                    });
                })
                .catch(function () { /* 网络或解析失败时静默 */ });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWxShare);
        } else {
            initWxShare();
        }
    })();
