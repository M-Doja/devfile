$('.centeredmenu a').click(function(e) {
    e.preventDefault(); //prevent the link from being followed
    $('.centeredmenu a').removeClass('selected');
    $(this).addClass('selected');
});

$('#navlist a').click(function(e) {
    e.preventDefault(); //prevent the link from being followed
    $('#navlist a').removeClass('selected');
    $(this).addClass('selected');
});
