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

function sidebarCategory(category, total_tasks_per_category, i) {

  if (total_tasks_per_category[i] != 0) {
    var total_tasks = '<div class="total-number"><div class="number">' + total_tasks_per_category[i] + '</div></div>'
  } else {
    var total_tasks = ""
  }

  return '<li class="row hovered-nav-item"><span class="d-flex justify-content-between active-category" value="'+category.pk+'"><div class="category-item"><span class="category-link fs-5 text-white total-tasks-number d-flex" value="'+category.pk+'"><div class="category-name" value="'+category.pk+'">'+category.fields.name+'</div>'+total_tasks+'</span></div><div class="dropdown d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-three-dots-vertical dot-icon" type="button" id="dropdownMenuButton'+category.pk+'" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /></svg><ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton'+category.pk+'"><li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill bs-icon rename-add-icon rename-add-icon-sidebar" data-bs-placement="top" data-sender="category" data-sender="sidebar" data-action="rename" data-placeholder="" data-value="'+category.fields.name+'" data-id="'+category.pk+'" viewBox="0 0 16 16"><path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" /></svg></li><li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg delete-icon" data-type="category" data-sender="category" data-action="delete" data-id="'+category.pk+'" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg></li></ul></div></span></li>'


}

function sidebarBoard(board, total_boards) {

  if (total_boards > 1) {
    del_icon = '<li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg delete-icon" data-sender="board" data-action="delete" data-id="' + board.pk + '" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg></li>'
  } else {
    del_icon = ""
  }

  return '<li class="row hovered-nav-item board-item" value="' + board.pk + '"><span class="d-flex justify-content-between"><div class="fs-5 text-white board-name" value="' + board.pk + '">' + board.fields.name + '</div><div class="dropdown sidebar-dropdown d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-three-dots-vertical dot-icon"type="button" id="dropdownMenuButton' + board.pk + '" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /></svg><ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton' + board.pk + '"><li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill rename-add-icon rename-add-icon-sidebar" data-bs-placement="top" data-sender="board" data-action="rename" data-placeholder="" data-value="' + board.fields.name + '" data-id="' + board.pk + '" viewBox="0 0 16 16"> <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" /></svg></li>' + del_icon + '</ul></div></span></li>'


}

function reconstructSidebarBoards(json){
  // get the data
  boards = JSON.parse(json.boards)
  total_boards = json.total_boards

  // empty the board's div
  $('#sidebar-boards').empty();

  // loop over json response boards and reconstruct them
  boards.forEach((board) => {
    $('#sidebar-boards').append(

      sidebarBoard(board, total_boards)

    );
  });
}

function reconstructSidebarCategories(json){

  // get all the data
  total_tasks = json.total_tasks;
  total_tasks_per_category = json.total_tasks_per_category;
  categories = JSON.parse(json.categories);
  
  $(".reload-board").load(location.href+" .reload-board>*","");
  
  if (total_tasks > 0){
    $("#sidebar-all-tasks").html(
      'All <div class="total-number"><div class="number">'+total_tasks+'</div></div>'
    )
  }else{
    $("#sidebar-all-tasks").html('All')
  }

  // re-highlight the "All" category
  $('.active-category[value="-1"]').addClass('item-selected');

  $('#sidebar-categories').empty();

  // loop over active board categories and append the data
  categories.forEach((category, i) => {

    $("#sidebar-categories").append(
      sidebarCategory(category, total_tasks_per_category, i)
    )
  });
}

function renameAddPopover() {
  $('.rename-add-icon').popover({
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

  });
}

function ajaxBoardManager(action, id, entered_name) {
  // Post the data
  $.ajax({
    type: "POST",
    url: 'http://localhost:8000/board_manager/',
    data: {
      name: entered_name,
      id: id,
      action: action,
      csrfmiddlewaretoken: getCookie('csrftoken'),
    },
    datatype: 'json',

    success: function (json) {

 
      if (action == 'rename') {
        // Update the name
        $('.board-item[value="' + id + '"]').html(entered_name)

        // Update the rename-add-icon's data-value attribute, so when clicking on rename again
        // the input field gets pre-populated with this new name
        $('.rename-add-icon[data-id="' + id + '"][data-sender="board"]').data('value', entered_name)
      }

      if (action == 'delete') {

        reconstructSidebarBoards(json);
        reconstructSidebarCategories(json);

        // Highlight the active board
        $('.board-item[value="' + json.active_board_id + '"]').addClass('item-selected');
        
        // Reload the board
        $(".reload-board").load(" .reload-board > *");

      }

      if (action == 'add'){

        reconstructSidebarBoards(json);
        
        // Empty sidebar categories and just add "All"
        $('#sidebar-categories').empty();
        $("#sidebar-all-tasks").html('All')

        // Highlight the active board
        $('.board-item[value="' + json.active_board_id + '"]').addClass('item-selected');

        // Reload the board
        $(".reload-board").load(" .reload-board > *");
      }


    },

    error: function (xhr, errmsg, err) {

    },

  });

}

function ajaxCategoryManager(action, id, entered_name, source) {
  // Post the data
  $.ajax({
    type: "POST",
    url: 'http://localhost:8000/category_manager/',
    data: {
      name: entered_name,
      id: id,
      action: action,
      source: source,
      csrfmiddlewaretoken: getCookie('csrftoken'),
    },
    datatype: 'json',

    success: function (json) {

 
      if (action == 'rename') {
        // Update the name
        $('.category-name[value="' + id + '"]').html(entered_name)

        // Update the rename-add-icon's data-value attribute, so when clicking on rename again
        // the input field gets pre-populated with this new name
        $('.rename-add-icon[data-id="' + id + '"][data-sender="category"]').data('value', entered_name)
      }
      
      if (action == 'delete' || action == 'add'){
        
        reconstructSidebarCategories(json)

      }

      if (action == 'add' && source == 'new-task'){
        // refresh category dropdown
        $("[name=category]").load(" [name=category] > *");
      }



    },

    error: function (xhr, errmsg, err) {

    },

  });

}

$(document).ready(function () {

  // initialize the popover
  renameAddPopover();

  sender = ""
  action = ""
  id = 0


  // RENAME OR ADD ICON
  $(document).on('click', '.rename-add-icon', function () {

    sender = $(this).data('sender');
    action = $(this).data('action');
    id = $(this).data('id');
    source = $(this).data('source');
    
    renameAddPopover();

  });

  // On pressing Enter
  $(document).keypress('.add-input', function (e) {
    if (e.which === 13) {
      // only if something is entered
      if ($('.add-input').val()) {
        e.preventDefault();

        entered_name = $('.add-input').val();
        

        $('.rename-add-icon').popover('hide');

        // ### AJAX FOR BOARD ###
        if (sender == 'board') {
          ajaxBoardManager(action, id, entered_name)
        }

        // ### AJAX FOR CATEGORY ###
        if (sender == 'category'){
          ajaxCategoryManager(action, id, entered_name, source)
        }

      }
    }
  });

  // DELETE ICON
  $(document).on('click', '.delete-icon', function () {

    sender = $(this).data('sender');
    action = $(this).data('action');
    id = $(this).data('id');

    // ### AJAX FOR BOARD ###
    if (sender == 'board'){
      ajaxBoardManager(action, id)
    }

    // ### AJAX FOR CATEGORY ###
    if (sender == 'category'){
      ajaxCategoryManager(action, id)
    }
  });

});


// Close the popover on pressing ESC
$(document).keyup(function (e) {
  if (e.which === 27) {
    $('.rename-add-icon').popover('hide');
  }
});

// Close the popover on click outside
$(document).on('click', function (e) {
  $('.rename-add-icon').each(function () {
    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
      $(this).popover('hide');
    }
  });
});


$(document).ajaxComplete(function() {
  // initialize popover on ajax complete
  renameAddPopover();
});