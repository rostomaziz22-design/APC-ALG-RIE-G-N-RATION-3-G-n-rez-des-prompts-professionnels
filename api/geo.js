module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    if (req.method === 'OPTIONS') return res.status(200).end();

    console.log('[geo] ENTRY');
    console.log('[geo] headers:', JSON.stringify(req.headers, null, 2));

    var ip = (
        req.headers['x-vercel-forwarded-for'] ||
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        (req.socket && req.socket.remoteAddress) ||
        ''
    ).split(',')[0].trim();

    function _d(s) { try { return decodeURIComponent(s); } catch(e) { return s; } }
    var country = _d(req.headers['x-vercel-ip-country'] || '');
    var region = _d(req.headers['x-vercel-ip-country-region'] || '');
    var city = _d(req.headers['x-vercel-ip-city'] || '');

    console.log('[geo] parsed — ip:', ip, '| country:', country, '| region:', region, '| city:', city);

    var parts = [country, region, city].filter(Boolean);
    var location = parts.join(', ') || 'Inconnue';
    var result = { ip: ip || 'Non disponible', region: location };

    console.log('[geo] response:', JSON.stringify(result));
    res.json(result);
};
