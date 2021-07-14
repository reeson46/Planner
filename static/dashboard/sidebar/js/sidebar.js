function deletePopover() {
  $('.delete-icon').popover({
    html: true,
    sanitize: false,
    content: function () {

      return '<div class="card shadow delete-window p-3"><div class="text-center text-warning fs-4 mb-2 mt-1">Are you sure you want to delete "' + $(this).data('name') + '"?</div><div class="text-center text-danger fs-5 mb-3" id="popover-message"></div><div class="text-center text-white fs-6 mb-1 mb-2">To confirm this action, type "DELETE" below and press Enter, or press ESC to cancel</div><input type="text" class="card bg-dark text-light" id="delete-confirm-input"></div>'
    },

  }).on('shown.bs.popover', function () {
    // focus the input
    $('#delete-confirm-input').focus();

  });
}

var is_deleteBoardCategory_popover_open;
var taskForm_toggle;
var category_limit;

$(document).ready(function () {

  // if the user is guest, init the tooltips
  if (IS_GUEST == "True"){
    var content = "To add a new Board you must Sign Up. Don't worry, it's free!";
    $('.sidebar-add-board-guest').attr('title', content).tooltip();

    if(TOTAL_CATEGORIES >= 3){
      var content = "To add more Categories you must Sign Up. Don't worry, it's free!"
      $('.category-tooltip-div').attr('title', content).tooltip();
    }

    if(TOTAL_TASKS >= 10){
      var content = "To add more Tasks you must Sign Up. Don't worry, it's free!"
      $('.sidebar-add-newtask').attr('title', content).tooltip();
    }
    
  }

  // init the delete  popover
  deletePopover();
  is_deleteBoardCategory_popover_open = false;

  // Set the newtask icon toggle, aka enable the icon
  taskForm_toggle = true;

  // ### HIGHLIGHT THE ACTIVE BOARD/CATEGORY ###

  // on page refresh, highligh the active board
  $('.board-item[value="' + HIGHLIGHTED_BOARD + '"]').addClass('item-selected');

  // keep the selected board highlighted
  $(document).on('click', '.board-name', function () {
    $('.board-name').parent().parent().removeClass('item-selected');
    $(this).parent().parent().addClass('item-selected');
  });

  // on page refresh, highligh the active category
  $('.active-category[value="' + HIGHLIGHTED_CATEGORY + '"]').addClass('item-selected');

  // keep the selected category highlighted
  $(document).on('click', '.category-item', function () {
    $('.category-item').parent().removeClass('item-selected');
    $(this).parent().addClass('item-selected');
  });

  // ### ACTIVE BOARD ###

  // POST selected board id
  $(document).on('click', ".board-name", function (e) {
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

        if (json.reload){

          // function located in "main.js"
          reconstructSidebarCategories(json);
          
          // Highlight the active category category
          $('.active-category[value="-1"]').removeClass('item-selected');
          $('.active-category[value="'+json.active_category_id+'"]').addClass('item-selected');
  
          reloadTasks();
        }

      },

      error: function (xhr, errmsg, err) {

      },

    });

  });

  // ### ACTIVE CATEGORY ###

  // POST selected category id
  $(document).on('click', ".category-link", function (e) {
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

        if (json.reload){
          reloadTasks();
        }

      },

      error: function (xhr, errmsg, err) {

      },

    });

  });

  // ### NEW TASK ICON -- DISPLAY NEW TASK WINDOW ###
  $(document).on('click', ".newtask-icon", function (e) {
    e.preventDefault();

    if (taskForm_toggle) {

      resetTaskFormFields();

      // display newtask window
      $(".new-task-wrapper").toggleClass("newtaskDisplayed");

      $.ajax({
        type: "GET",
        url: NEW_TASK,
        data: {
          csrfmiddlewaretoken: CSRF_TOKEN,
        },
        datatype: 'json',

        success: function (json) {

          taskForm(json);
          
          // disable newtask icon/ edit button
          taskForm_toggle = false;
          edittask_toggle = false;  
          
          is_taskFormDisplayed = true;

        },

        error: function (xhr, errmsg, err) {

        },

      });
    }

  });

  // Close the delete category popover on ESC
  $(document).keyup(function (e) {
    if (e.which === 27) {
      if (is_deleteBoardCategory_popover_open) {
        $('.delete-icon').popover('hide');
        is_deleteBoardCategory_popover_open = false;

      }
    }
  });

});