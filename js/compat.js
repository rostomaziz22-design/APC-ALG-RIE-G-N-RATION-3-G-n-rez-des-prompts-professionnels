'use strict';
(function() {
    var COMPAT_KEY = 'apc_compat_mode';var COMPAT_BANNER_KEY = 'apc_banner_v2';
    var emojiMap = {
        '\u2705': '<i class="fas fa-check-circle"></i>',
        '\u274C': '<i class="fas fa-times-circle"></i>',
        '\u2714': '<i class="fas fa-check"></i>',
        '\u2713': '<i class="fas fa-check"></i>',
        '\u2715': '<i class="fas fa-times"></i>',
        '\u2611': '<i class="fas fa-check-square"></i>',
        '\u2610': '<i class="far fa-square"></i>',
        '\u2795': '<i class="fas fa-plus"></i>',
        '\u25B6': '<i class="fas fa-play"></i>',
        '\u25C0': '<i class="fas fa-play" style="transform:scaleX(-1);display:inline-block"></i>',
        '\u23F0': '<i class="fas fa-clock"></i>',
        '\u23F3': '<i class="fas fa-hourglass-half"></i>',
        '\u23F9': '<i class="fas fa-stop"></i>',
        '\u26A1': '<i class="fas fa-bolt"></i>',
        '\u26A0': '<i class="fas fa-exclamation-triangle"></i>',
        '\u2B50': '<i class="fas fa-star"></i>',
        '\u2726': '<i class="fas fa-star"></i>',
        '\u2139': '<i class="fas fa-info-circle"></i>',
        '\u2753': '<i class="fas fa-question-circle"></i>',
        '\u2699': '<i class="fas fa-cog"></i>',
        '\u2630': '<i class="fas fa-bars"></i>',
        '\u270F': '<i class="fas fa-pencil-alt"></i>',
        '\u270D': '<i class="fas fa-pen"></i>',
        '\u27A4': '<i class="fas fa-arrow-right"></i>',
        '\u26D4': '<i class="fas fa-ban"></i>',
        '\u2600': '<i class="fas fa-sun"></i>',
        '\u2747': '<i class="fas fa-sparkles"></i>',
        '\u203C': '<i class="fas fa-exclamation"></i>',
        '\u2049': '<i class="fas fa-question"></i>',
        '\u2934': '<i class="fas fa-arrow-up"></i>',
        '\u2935': '<i class="fas fa-arrow-down"></i>',
        '\u25AA': '<i class="fas fa-circle" style="font-size:8px;vertical-align:middle"></i>',
        '\u25AB': '<i class="far fa-circle" style="font-size:8px;vertical-align:middle"></i>',
        '\u25FB': '<i class="far fa-square"></i>',
        '\u25FC': '<i class="fas fa-square"></i>',
        '\u25FE': '<i class="fas fa-square"></i>',
        '\u25FD': '<i class="far fa-square"></i>',
        '\u2B06': '<i class="fas fa-arrow-up"></i>',
        '\u2B07': '<i class="fas fa-arrow-down"></i>',
        '\u2B05': '<i class="fas fa-arrow-left"></i>',
        '\u27A1': '<i class="fas fa-arrow-right"></i>',
        '\u2194': '<i class="fas fa-arrows-alt-h"></i>',
        '\u2195': '<i class="fas fa-arrows-alt-v"></i>',
        '\u2196': '<i class="fas fa-arrow-up"></i>',
        '\u2197': '<i class="fas fa-arrow-up"></i>',
        '\u2198': '<i class="fas fa-arrow-down"></i>',
        '\u2199': '<i class="fas fa-arrow-down"></i>',
        '\u21A9': '<i class="fas fa-reply"></i>',
        '\u21AA': '<i class="fas fa-share"></i>',
        '\u231A': '<i class="fas fa-clock"></i>',
        '\u231B': '<i class="far fa-clock"></i>',
        '\u2328': '<i class="fas fa-keyboard"></i>',
        '\u23CE': '<i class="fas fa-sign-in-alt"></i>',
        '\u23CF': '<i class="fas fa-eject"></i>',
        '\u23ED': '<i class="fas fa-forward"></i>',
        '\u23EF': '<i class="fas fa-play"></i>',
        '\u23F8': '<i class="fas fa-pause"></i>',
        '\u23FA': '<i class="fas fa-record-vinyl"></i>',
        '\u3297': '<i class="fas fa-trophy"></i>',
        '\u3299': '<i class="fas fa-heart"></i>',
        '\u2122': '<sup>TM</sup>',
        '\u2615': '<i class="fas fa-mug-hot"></i>',
        '\u26F3': '<i class="fas fa-golf-ball"></i>',
        '\u26F5': '<i class="fas fa-sailboat"></i>',
        '\u2702': '<i class="fas fa-cut"></i>',
        '\u2708': '<i class="fas fa-plane"></i>',
        '\u2709': '<i class="fas fa-envelope"></i>',
        '\u270A': '<i class="fas fa-hand-paper"></i>',
        '\u270B': '<i class="fas fa-hand-peace"></i>',
        '\u270C': '<i class="fas fa-hand-peace"></i>',
        '\u1F30D': '<i class="fas fa-globe-africa"></i>',
        '\u1F310': '<i class="fas fa-globe"></i>',
        '\u1F319': '<i class="fas fa-moon"></i>',
        '\u1F31F': '<i class="fas fa-star"></i>',
        '\u1F373': '<i class="fas fa-utensils"></i>',
        '\u1F389': '<i class="fas fa-glass-cheers"></i>',
        '\u1F3A4': '<i class="fas fa-microphone"></i>',
        '\u1F3A8': '<i class="fas fa-paint-brush"></i>',
        '\u1F3AE': '<i class="fas fa-gamepad"></i>',
        '\u1F3AF': '<i class="fas fa-bullseye"></i>',
        '\u1F3C5': '<i class="fas fa-medal"></i>',
        '\u1F3C6': '<i class="fas fa-trophy"></i>',
        '\u1F3E0': '<i class="fas fa-home"></i>',
        '\u1F446': '<i class="fas fa-hand-point-up"></i>',
        '\u1F44B': '<i class="fas fa-wave"></i>',
        '\u1F464': '<i class="fas fa-user"></i>',
        '\u1F465': '<i class="fas fa-users"></i>',
        '\u1F4A1': '<i class="fas fa-lightbulb"></i>',
        '\u1F4AA': '<i class="fas fa-dumbbell"></i>',
        '\u1F4AC': '<i class="fas fa-comment"></i>',
        '\u1F4BB': '<i class="fas fa-laptop"></i>',
        '\u1F4BE': '<i class="fas fa-save"></i>',
        '\u1F4C1': '<i class="fas fa-folder"></i>',
        '\u1F4C2': '<i class="fas fa-folder-open"></i>',
        '\u1F4C4': '<i class="fas fa-file-alt"></i>',
        '\u1F4C8': '<i class="fas fa-chart-line"></i>',
        '\u1F4CA': '<i class="fas fa-chart-bar"></i>',
        '\u1F4CB': '<i class="fas fa-clipboard-list"></i>',
        '\u1F4CC': '<i class="fas fa-thumbtack"></i>',
        '\u1F4D0': '<i class="fas fa-ruler-triangle"></i>',
        '\u1F4D6': '<i class="fas fa-book-open"></i>',
        '\u1F4DA': '<i class="fas fa-book"></i>',
        '\u1F4DD': '<i class="fas fa-pen"></i>',
        '\u1F4E4': '<i class="fas fa-inbox"></i>',
        '\u1F4E5': '<i class="fas fa-inbox"></i>',
        '\u1F4E6': '<i class="fas fa-cube"></i>',
        '\u1F4E7': '<i class="fas fa-envelope"></i>',
        '\u1F4E8': '<i class="fas fa-envelope-open"></i>',
        '\u1F4ED': '<i class="far fa-envelope"></i>',
        '\u1F500': '<i class="fas fa-random"></i>',
        '\u1F501': '<i class="fas fa-redo"></i>',
        '\u1F504': '<i class="fas fa-sync-alt"></i>',
        '\u1F507': '<i class="fas fa-volume-mute"></i>',
        '\u1F50A': '<i class="fas fa-volume-up"></i>',
        '\u1F50D': '<i class="fas fa-search"></i>',
        '\u1F510': '<i class="fas fa-lock"></i>',
        '\u1F511': '<i class="fas fa-key"></i>',
        '\u1F512': '<i class="fas fa-lock"></i>',
        '\u1F517': '<i class="fas fa-link"></i>',
        '\u1F518': '<i class="fas fa-circle"></i>',
        '\u1F51A': '<i class="fas fa-end"></i>',
        '\u1F537': '<i class="fas fa-square" style="color:#4A90D9"></i>',
        '\u1F5BC': '<i class="fas fa-image"></i>',
        '\u1F5D1': '<i class="fas fa-trash"></i>',
        '\u1F680': '<i class="fas fa-rocket"></i>',
        '\u1F6AA': '<i class="fas fa-door-open"></i>',
        '\u1F6AB': '<i class="fas fa-ban"></i>',
        '\u1F6E1': '<i class="fas fa-shield-alt"></i>',
        '\u1F916': '<i class="fas fa-robot"></i>',
        '\u1F9D8': '<i class="fas fa-spa"></i>',
        '\u1F9E0': '<i class="fas fa-brain"></i>'
    };

    function getSetting() {
        return localStorage.getItem(COMPAT_KEY) || 'auto';
    }

    function setSetting(v) {
        localStorage.setItem(COMPAT_KEY, v);
        window.__compat.isEnabled = isCompatNeeded();
        if (window.setLang) window.setLang(currentLang || 'fr');
    }

    function fontExists(font) {
        try {
            var c = document.createElement('canvas'), ctx = c.getContext('2d');
            ctx.font = '50px ' + font;
            var w1 = ctx.measureText('M').width;
            ctx.font = '50px ' + font + ',serif';
            var w2 = ctx.measureText('M').width;
            ctx.font = '50px ' + font + ',monospace';
            var w3 = ctx.measureText('M').width;
            return w1 === w2 && w1 === w3;
        } catch(e) { return false; }
    }

    function isCompatNeeded() {
        var setting = getSetting();
        if (setting === 'modern') return false;
        if (setting === 'compat') return true;
        try {
            var hasEmoji = fontExists('"Segoe UI Emoji"') || fontExists('"Apple Color Emoji"') || fontExists('"Noto Color Emoji"');
            return !hasEmoji;
        } catch (e) { return true; }
    }

    function replaceEmoji(text) {
        if (!text || typeof text !== 'string') return text;
        var result = text.replace(/\uFE0F/g, '').replace(/\u200D/g, '');
        var emojis = Object.keys(emojiMap);
        for (var i = 0; i < emojis.length; i++) {
            var e = emojis[i];
            var idx = result.indexOf(e);
            while (idx !== -1) {
                result = result.substring(0, idx) + emojiMap[e] + result.substring(idx + e.length);
                idx = result.indexOf(e, idx + emojiMap[e].length);
            }
        }
        return result;
    }

    window.__compat = {
        isEnabled: false,
        replaceEmoji: replaceEmoji,
        getSetting: getSetting,
        setSetting: setSetting,
        emojiMap: emojiMap,
        init: function() {
            this.isEnabled = isCompatNeeded();
            if (this.isEnabled) {
                document.body.classList.add('apc-compat-active');
                var banner = document.getElementById('apcCompatBanner');
                if (banner && !localStorage.getItem(COMPAT_BANNER_KEY)) {
                    banner.style.display = 'flex';
                    localStorage.setItem(COMPAT_BANNER_KEY, '1');
                }
            }
        }
    };
})();
