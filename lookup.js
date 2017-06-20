const got = require('got');

exports.handler = function(context, event, callback) {
    let message = "";
    let twiml = new Twilio.twiml.MessagingResponse();
    got(`https://api.coinmarketcap.com/v1/ticker/${event.Body.trim()}/`)
    .then(response => {
        let result = JSON.parse(response.body)[0];
        let price_change = parseInt(result.percent_change_24h);
        let message_params = [
            result.symbol, result.price_usd,
            (price_change > 0 ? '\u2191' : '\u2193'),
            Math.abs(result.percent_change_24h)];
        message = message_params.join(" ");
    })
    .catch(error => {
        console.log(error);
        message = "Unable to determine price.";
    })
    .then(function() {
        twiml.message(message);
        callback(null, twiml);
    });
};
