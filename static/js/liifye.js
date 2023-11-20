var body = $('html, body'),
    shop = $('#featured');


$('#scroll').click(function() {

body.animate({
    scrollTop: shop.offset().top - body.offset().top + body.scrollTop()
}, 1000);

});

