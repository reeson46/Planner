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

function sidebarCategory(name, category_ids, total_tasks_per_category, i) {

  if (total_tasks_per_category[i] != 0) {
    var total_tasks = '<div class="total-number"><div class="number">' + total_tasks_per_category[i] + '</div></div>'
  } else {
    var total_tasks = ""
  }

  var category = '<li class="row hovered-nav-item active-category mb-1" value="' + category_ids[i] + '"><span class="d-flex justify-content-between"><div class="category-item"><span class="category-link fs-5 text-white total-tasks-number d-flex" value="' + category_ids[i] + '"><div class="category-name">' + name + '</div>' + total_tasks + '</span></div><div class="dropdown d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-three-dots-vertical dot-icon" type="button" id="dropdownMenuButton' + category_ids[i] + '" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /></svg><ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton' + category_ids[i] + '"><li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill bs-icon rename-icon-sidebar" data-bs-placement="top" data-type="category" data-sender="sidebar" data-action="rename" data-placeholder="" data-value="' + name + '" data-id="' + category_ids[i] + '" viewBox="0 0 16 16"><path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" /></svg></li><li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg delete-icon-sidebar del-icon" data-type="category" data-sender="sidebar" data-action="delete" data-id="' + category_ids[i] + '" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg></li></ul></div></span></li>'

  return category
}

function sidebarBoard(total_boards, name, board_ids, i) {

  if (total_boards > 1) {
    del_icon = '<li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg delete-icon-sidebar del-icon" data-type="board" data-sender="sidebar" data-action="delete" data-id="' + board_ids[i] + '" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg></li>'
  } else {
    del_icon = ""
  }

  var board = '<li class="row hovered-nav-item active-board mb-1" value="' + board_ids[i] + '"><span class="d-flex justify-content-between"><div class="fs-5 text-white board-item" value="' + board_ids[i] + '">' + name + '</div><div class="dropdown d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-three-dots-vertical dot-icon"type="button" id="dropdownMenuButton' + board_ids[i] + '" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /></svg><ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton' + board_ids[i] + '"><li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill bs-icon rename-icon-sidebar" data-bs-placement="top" data-type="board" data-sender="sidebar" data-action="rename" data-placeholder="" data-value="' + name + '" data-id="' + board_ids[i] + '" viewBox="0 0 16 16"> <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" /></svg></li>' + del_icon + '</ul></div></span></li>'

  return board
}

function popoverAjax(){
  $('.bs-icon').popover({
    html: true,
    sanitize: false,
    content: function () {
      return '<input class="card bg-dark text-light add-input" type="text" placeholder="' + $(this).data("placeholder") + '" value="' + $(this).data("value") + '" />'
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

          $('.bs-icon').popover('hide');


          // Post the data
          $.ajax({
            type: "POST",
            url: 'http://localhost:8000/board_category/',
            data: {
              name: entered_name,
              type: type,
              id: id,
              action: action,
              csrfmiddlewaretoken: getCookie('csrftoken'),
            },
            datatype: 'json',

            success: function (json) {

              

              if (sender == 'new-task' && action == 'add') {

                if (type == 'category') {
                  $("[name=category]").load(" [name=category] > *");
                }

              }

              if (sender == 'sidebar' && action == 'rename') {

                if (type == 'board') {

                  total_boards = json.total_boards;
                  board_names = json.board_names;
                  board_ids = json.board_ids;
                  active_board_id = json.active_board_id;

                  $('#sidebar-boards').empty();

                  board_names.forEach((name, i) => {
                    $('#sidebar-boards').append(
                      sidebarBoard(
                        total_boards = total_boards,
                        name = name,
                        board_ids = board_ids,
                        i = i
                      )
                    )
                  });


                }

                if (type == 'category') {
                  $('.category-link[value=' + id + ']').html(json.name)
                }

              }

            },

            error: function (xhr, errmsg, err) {

            },

          });

        }
      }
    });

  });
}

// ### Global add/rename Board/Category ###
$(document).ready(function () {

  popoverAjax();


  $(document).on('click', '.bs-icon', function () {

    type = $(this).data('type');
    sender = $(this).data('sender');
    action = $(this).data('action');
    id = $(this).data('id');
    element = $(this)

    popoverAjax();
  });
  
  
})

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
$(document).on('click', 'del-icon', function () {
  type = $(this).data('type');
  sender = $(this).data('sender');
  action = $(this).data('action');
  id = $(this).data('id');
  element = $(this);

  console.log(type + sender + action + id)

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

      // get all the data
      total_tasks = json.total_tasks;
      category_names = json.category_names;
      category_ids = json.category_ids;
      total_tasks_per_category = json.total_tasks_per_category;
      active_board_id = json.active_board_id;

      if (sender == 'sidebar' && action == 'delete') {

        $(".reload-board").load(" .reload-board > *");

        element.parent().parent().parent().remove()
        $('.active-board[value="' + active_board_id + '"]').addClass('item-selected');

        $('#sidebar-categories').empty();

        category_names.forEach((name, i) => {

          // if (total_tasks_per_category[i] != 0){
          //   $("#sidebar-categories").append(
          //     sidebarCategory(
          //       name=name, 
          //       category_ids=category_ids,
          //       total_tasks_per_category=total_tasks_per_category,
          //       i=i
          //       )
          //   )
          // }else{
          //   $("#sidebar-categories").append(

          //   )
          // }
        });

      }

    },

    error: function (xhr, errmsg, err) {

    },

  });
});

// after ajax request, this function initializes popovers
$(document).ajaxComplete(function() {
  popoverAjax();
});
