function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

$(document).ready(function () {

  // ### Global add/rename Board/Category ###

  // getting the data
  type = ""
  sender = ""
  action = ""
  id = 0
  element = ""

  // Any add/rename icon
  $('.bs-icon').on('click', function () {
    type = $(this).data('type');
    sender = $(this).data('sender');
    action = $(this).data('action');
    id = $(this).data('id');
    element = $(this)
  });

  // make the popover
  $('.bs-icon').popover({
    html: true,
    sanitize: false,
    placement: "bottom",
    content: function () {
      return '<input class="card bg-dark text-light add-input" type="text" placeholder="' + $(this).data("placeholder") + '" value="'+$(this).data("value")+'" />'
    },
    // focus the input and put the prompt at the end of text
  }).on('shown.bs.popover', function () {

    var input = $('.add-input');
    var strLength = input.val().length;
    input.focus();
    input[0].setSelectionRange(strLength, strLength);

    // On pressing Enter
    $(".add-input").keypress(function (e) {
      if (e.which === 13) {

        // only if something is entered
        if ($('.add-input').val()) {
          e.preventDefault();

          entered_name = $(this).val();

          // Grab Board
          board = $("select[name='board'").children("option:selected").val();
          console.log(board)

          $('.bs-icon').popover('hide');


          // Post the data
          $.ajax({
            type: "POST",
            url: 'http://localhost:8000/board_category/',
            data: {
              name: entered_name,
              type: type,
              board: board,
              id: id,
              action: action,
              csrfmiddlewaretoken: getCookie('csrftoken'),
            },
            datatype: 'json',

            success: function (json) {
              if (sender == 'new-task' && action == 'add') {

                if (type == 'category'){
                  $("[name=category]").load(" [name=category] > *");
                }
                
                if (type == 'board'){
                  $("[name=board]").load(" [name=board] > *");
                }

              }

              if (sender == 'sidebar' && action == 'rename'){
                element.parent().prev().html(json.name)
              }

            },

            error: function (xhr, errmsg, err) {

            },

          });

        }
      }
    });

  });

  // Close the popover on pressing ESC
  $(document).keyup(function (e) {
    if (e.which === 27) {
      $('.bs-icon').popover('hide');
    }
  });

  // Close the popover on click outside
  $(document).on('click', function (e) {
    $('.bs-icon').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });


  // ### Global deleting Board/Category ###

  // Any delete icon
  $('.del-icon').on('click', function () {
    type = $(this).data('type');
    sender = $(this).data('sender');
    action = $(this).data('action');
    id = $(this).data('id');
    element = $(this);

    console.log(type+sender+action+id)

    // Post the data
    $.ajax({
      type: "POST",
      url: 'http://localhost:8000/board_category/',
      data: {
        type: type,
        id: id,
        action: action,
        csrfmiddlewaretoken: getCookie('csrftoken'),
      },
      datatype: 'json',

      success: function (json) {
        if (sender == 'sidebar' && action == 'delete'){
          $(".reload-board").load(" .reload-board > *");
          element.parent().parent().parent().remove()
          $('.active-board[value="' + json.active_board_id + '"]').addClass('item-selected');
        }

      },

      error: function (xhr, errmsg, err) {

      },

    });

  });

});