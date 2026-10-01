(function () {
    const storageKey = 'kf-cookie-consent';
    const analyticsToken = '1743340428fa495fb44424cf19ec12a4';

    function loadAnalytics() {
        if (document.querySelector('script[data-kf-cloudflare-analytics]')) return;

        const script = document.createElement('script');
        script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
        script.defer = true;
        script.dataset.kfCloudflareAnalytics = 'true';
        script.setAttribute('data-cf-beacon', JSON.stringify({ token: analyticsToken }));
        document.body.appendChild(script);
    }

    window.kfCookieConsent = {
        getChoice: function () {
            const choice = localStorage.getItem(storageKey);
            if (choice === 'accepted') loadAnalytics();
            return choice;
        },
        choose: function (choice) {
            localStorage.setItem(storageKey, choice);
            if (choice === 'accepted') loadAnalytics();
        }
    };
})();
