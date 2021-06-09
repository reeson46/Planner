$(document).ready(function () {
  // HIGHLIGHT THE ACTIVE BOARD/CATEGORY

  // on page refresh, highligh the active board
  $('.active-board[value="' + HIGHLIGHTED_BOARD + '"]').addClass('item-selected');

  // keep the selected board highlighted
  $('.board-link').click(function () {
    $('.board-link').parent().removeClass('item-selected');
    $(this).parent().addClass('item-selected');
  });

  // on page refresh, highligh the active category
  $('.active-category[value="' + HIGHLIGHTED_CATEGORY + '"]').addClass('item-selected');

  // keep the selected category highlighted
  $('.category-link').click(function () {
    $('.category-link').parent().removeClass('item-selected');
    $(this).parent().addClass('item-selected');
  });

  
  // ALL ABOUT ACTIVE BOARD

  // POST selected board id
  $(".board-link").click(function (e) {
    e.preventDefault();
    board_id = $(this).attr('value');

    $.ajax({
      type: "POST",
      url: SET_ACTIVE_BOARD_URL,
      data: {
        board_id: board_id,
        csrfmiddlewaretoken: CSRF_TOKEN,
        action: 'post',
      },
      datatype: 'json',

      success: function (json) {
        $(".reload-board").load(" .reload-board > *");
        
      },

      error: function (xhr, errmsg, err) {

      },

    });

  });

  // ALL ABOUT ACTIVE CATEGORY

  // POST selected category id
  $(".category-link").click(function (e) {
    e.preventDefault();
    category_id = $(this).attr('value');

    $.ajax({
      type: "POST",
      url: SET_ACTIVE_CATEGORY_URL,
      data: {
        category_id: category_id,
        csrfmiddlewaretoken: CSRF_TOKEN,
        action: 'post',
      },
      datatype: 'json',

      success: function (json) {
        $(".reload-board").load(" .reload-board > *");
        
      },

      error: function (xhr, errmsg, err) {

      },

    });

  });
  

});