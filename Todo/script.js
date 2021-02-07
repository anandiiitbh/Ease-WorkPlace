var inputBox;

function addItem(item) {

    $('#input').before('<div class="me-want to-do panel-body"><span class="glyphicon glyphicon-minus" aria-hidden="true" /> ' + item + '</div>');

    var it = $('.me-want');
    it.fadeOut(0);
    it.fadeIn(1000);
    it.removeClass('me-want');
    it.hover(addRemoveIcon, addRemoveIcon);

}

function saveList() {

    var list = [];

    $('#list .to-do').each(function() { list.push($(this).text()) });
    var cookie = list.join(', ');
    cookie = cookie.substring(1, cookie.length);

    console.log('Saving cookie as "' + cookie + '"');
    $.cookie('list', cookie, { expires: 90 });
    console.log('Cookie: ' + $.cookie('list'));

}

function loadList() {

    var items = $.cookie('list');

    console.log("Loaded cookie as " + items);

    if (items === undefined || items == '')
        return;

    items = items.split(', ');

    for (i in items) {
        addItem(items[i]);
    }

}

function add() {

    if (inputBox.val() == '') {
        console.log("Nothing in form!");
        return;
    }


    addItem(inputBox.val());
    inputBox.val('');

    saveList();

}

async function remove(element) {

    var item = $(this);

    await Swal.fire({
        title: 'Are you sure ?',
        html: item,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {

            item.find('span').removeClass("glyphicon-trash");
            item.find('span').removeClass("text-warning");
            item.find('span').addClass("glyphicon-ok");
            item.fadeOut(2000, function() {
                item.remove();
                saveList();
            });
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.' + item.innerHtml,
                'success'
            )
        }
    })


}

function clear() {

    var items = $('.to-do');
    var glyph = items.find('span');

    glyph.removeClass('glyphicon-minus');
    glyph.addClass('glyphicon-ok');
    items.fadeOut(1000, function() {
        items.remove();
        saveList();
    });

}

function addRemoveIcon() {

    var glyph = $(this).find('span');

    if (glyph.hasClass('glyphicon-ok'))
        return;

    glyph.toggleClass('glyphicon-minus');
    glyph.toggleClass('glyphicon-trash');
    glyph.toggleClass('text-warning');

}

function onKeyPress(event) {

    if (event.keyCode == 13)
        add();

}

$(document).ready(function() {

    inputBox = $('input[name="add-to-list"]');

    $('#add').click(add);
    $('#clear').click(clear);
    inputBox.keypress(onKeyPress);
    $('#list').on('click', '.to-do', remove);

    loadList();
    $('#script-error').remove();

});