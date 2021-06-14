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

  // ### Global add new Board/Category ###

  // getting the data
  type = ""
  sender = ""
  action = ""

  $('.add-icon').on('click', function () {
    type = $(this).data('type');
    sender = $(this).data('sender');
    action = $(this).data('action');
  });

  // make the popover
  $('.add-icon').popover({
    html: true,
    sanitize: false,
    placement: "bottom",
    content: function () {
      return '<input class="card bg-dark text-light add-input" type="text" placeholder="' + $(this).data("placeholder") + '" />'
    },
    // focus the input
  }).on('shown.bs.popover', function () {
    $('.add-input').focus();

    // On pressing Enter
    $(".add-input").keypress(function (e) {
      if (e.which === 13) {

        // only if something is entered
        if ($('.add-input').val()) {
          e.preventDefault();

          entered_name = $(this).val();

          $('.add-icon').popover('hide');


          // Post the data
          $.ajax({
            type: "POST",
            url: 'http://localhost:8000/board_category/',
            data: {
              name: entered_name,
              type: type,
              csrfmiddlewaretoken: getCookie('csrftoken'),
              action: action,
            },
            datatype: 'json',

            success: function (json) {
              if (sender == 'new-task') {
                $("[name=board]").load(" [name=board] > *");
                $("[name=category]").load(" [name=category] > *");
              }

            },

            error: function (xhr, errmsg, err) {

            },

          });

        }
      }
    });

    // Close the popover when pressing ESC
    $(document).keyup(function (e) {
      if (e.which === 27) {
        $('.add-icon').popover('hide');
      }
    });


  });

  // Close the popover click outside
  $('body').on('click', function (e) {
    $('.add-icon').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });

});