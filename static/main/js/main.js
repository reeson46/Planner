function guestCategoryLimit(json) {
  var add_icon = $('.global-add-category-icon');
  var tooltip = $('.category-tooltip-div');


  if (json.total_categories >= 3) {
    add_icon.popover('disable');

    add_icon.removeClass('category-add-icon')
    add_icon.removeClass('rename-add-icon')
    add_icon.addClass('add-category-guest')

    var content = "As a Guest user, you can have only 3 categories. Sign Up for free to add more."
    tooltip.attr('title', content).tooltip();

  } else {
    add_icon.popover('enable')

    add_icon.addClass('category-add-icon')
    add_icon.addClass('rename-add-icon')
    add_icon.removeClass('add-category-guest')

    tooltip.tooltip('dispose');
  }
}

function guestTaskLimit(json){
  var add_icon = $('.sidebar-add-newtask');
  var tooltip = $('.sidebar-add-newtask');

  if (json.total_tasks >= 10){
    add_icon.removeClass('newtask-icon')
    add_icon.addClass('sidebar-add-task-guest')

    var content = "As a Guest user, you can have only 10 tasks. Sign Up for free to add more."
    tooltip.attr('title', content).tooltip();
  }else{
    add_icon.addClass('newtask-icon')
    add_icon.removeClass('sidebar-add-task-guest')

    tooltip.tooltip('dispose');
  }
}

function convertDateAndTime(date) {
  var sign = Math.sign(date.getTimezoneOffset())
  var offset = Math.abs(date.getTimezoneOffset() / 60)
  var hours = date.getHours();

  if (sign == 1) {
    date.setHours(hours + offset)
  } else if (sign == -1) {
    date.setHours(hours - offset)
  }

  var date_options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  var time_options = {
    hour: 'numeric',
    minute: '2-digit'
  }
  var time = date.toLocaleTimeString('en-US', time_options).toLowerCase();
  var a = time.split(" ")[0];
  var b = time.split(" ")[1];
  var formatted_time = a + ' ' + b.split('').join('.') + '.'

  return date.toLocaleDateString(undefined, date_options) + ', ' + formatted_time;
}

class Task {
  constructor(task, statuses) {
    this.task = task;
    this.statuses = statuses;
  }

  taskCard() {

    if (this.task.extend_state == 1) {
      this.extend_state = ' show';
    } else {
      this.extend_state = '';
    }

    if (this.task.subtask.length) {

      this.task_subtasks = '<div class="task-subtask-text fs-5 mb-2">Subtasks:</div>'

      this.subs_completed = 0;

      this.task.subtask.forEach((sub) => {

        if (sub.is_complete) {
          this.checked = ' checked';
          this.subs_completed += 1;
        } else {
          this.checked = '';
        }

        this.task_subtasks += '<span class="d-flex justify-content-between mb-3"><li class="card-subtitle card-subtask">' + sub.name + '</li><div class="checkbox-div"><input type="checkbox" class="form-check-input custom-subtask-checkbox m-0" data-subtaskid="' + sub.id + '" data-taskid="' + sub.task + '"' + this.checked + '></div></span>'
      })

      this.progress_bar = '<div class="subtask-circular-progress sub-progress-bar' + this.task.id + '" data-taskid="' + this.task.id + '" data-totalsubs="' + this.task.subtask.length + '" data-completed="' + this.subs_completed + '"><div class="inner"></div><div class="number">100%</div><div class="circle"><div class="bar left"><div class="sub-progress"></div></div><div class="bar right"><div class="sub-progress"></div></div></div></div>';

    } else {
      this.progress_bar = '';
      this.task_subtasks = '';
      this.subs_completed = 0;
    }

    if (this.task.description != '') {
      this.task_description = '<div class="task-description-text fs-5 mb-2">Description:</div><div class="card-text">' + this.task.description + '</div><hr>';
    } else {
      this.task_description = '';
    }
    var date = new Date(this.task.date_created)
    var formatted_date = convertDateAndTime(date)

    this.status_dropdown = '';

    this.statuses.forEach((status) => {
      if (this.task.status == status) {
        this.status_dropdown += '<li class="taskcard-status current-status" data-status="' + status + '" data-taskid="' + this.task.id + '">' + status + '</li>'
      } else {
        this.status_dropdown += '<li class="taskcard-status" data-status="" data-taskid="' + this.task.id + '">' + status + '</li>'
      }
    })

    return '<div class="card text-white task shadow" id="panelsStayOpen-heading' + this.task.id + '"><div class="card-header task-card-header-wrapper task-extend p-0" data-index="' + this.task.id + '" value="' + this.task.extend_state + '" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse' + this.task.id + '" aria-expanded="true" aria-controls="panelsStayOpen-collapse' + this.task.id + '"><div class="d-flex justify-content-between task-card-header"><div class="card-subtitle fs-3 task-title-text">' + this.task.name + '</div>' + this.progress_bar + '</div></div><div id="panelsStayOpen-collapse' + this.task.id + '" class="accordion-collapse collapse' + this.extend_state + '" aria-labelledby="panelsStayOpen-heading' + this.task.id + '"><div class="card-body"><div class="task-card-description">' + this.task_description + '</div><div class="task-card-subtasks">' + this.task_subtasks + '</div></div><div class="card-footer"><h6 class="card-subtitle fw-light mt-1">Created by ' + this.task.created_by + ' , on ' + formatted_date + '</h6><hr><div class="d-flex justify-content-between"><div class=""><button class="btn btn-block fw500 w-100" value="' + this.task.id + '" id="edit-task">Edit</button></div><div class=""><div class="dropdown"><button data-display="static" class="btn dropdown-toggle task-status-button" type="button" id="dropdownMenuButton' + this.task.id + '" data-bs-toggle="dropdown" aria-expanded="false">Move to</button><ul class="dropdown-menu dropdown-menu-taskcard bg-dark" aria-labelledby="dropdownMenuButton' + this.task.id + '">' + this.status_dropdown + '</ul></div></div></div></div></div></div>'

  }

  subtasks_completed() {
    return this.subs_completed;
  }
}

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

  return '<li class="row hovered-nav-item"><span class="d-flex justify-content-between active-category" value="' + category.id + '"><div class="category-item"><span class="category-link fs-5 text-white total-tasks-number d-flex" value="' + category.id + '"><div class="category-name" value="' + category.id + '">' + category.name + '</div>' + total_tasks + '</span></div><div class="dropdown d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-three-dots-vertical dot-icon" type="button" id="dropdownMenuButton' + category.id + '" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /></svg><ul class="dropdown-menu dropdown-menu-sidebar dropdown-menu-dark" aria-labelledby="dropdownMenuButton' + category.id + '"><li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill bs-icon rename-add-icon rename-add-icon-sidebar" data-sender="category" data-sender="sidebar" data-action="rename" data-placeholder="" data-value="' + category.name + '" data-id="' + category.id + '" viewBox="0 0 16 16"><path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" /></svg></li><li class="d-flex mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg delete-icon" data-type="category" data-sender="category" data-action="delete" data-name="' + category.name + '" data-source="sidebar" data-id="' + category.id + '" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg></li></ul></div></span></li>'


}

function sidebarBoard(board, total_boards) {

  if (total_boards > 1) {
    del_icon = '<li class="d-flex mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg delete-icon" data-sender="board" data-action="delete" data-name="' + board.name + '" data-id="' + board.id + '" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg></li>'
  } else {
    del_icon = ""
  }

  return '<li class="row hovered-nav-item board-item" value="' + board.id + '"><span class="d-flex justify-content-between"><div class="fs-5 text-white board-name" value="' + board.id + '">' + board.name + '</div><div class="dropdown sidebar-dropdown d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-three-dots-vertical dot-icon"type="button" id="dropdownMenuButton' + board.id + '" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /></svg><ul class="dropdown-menu dropdown-menu-sidebar dropdown-menu-dark" aria-labelledby="dropdownMenuButton' + board.id + '"><li class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill rename-add-icon rename-add-icon-sidebar" data-sender="board" data-action="rename" data-placeholder="" data-value="' + board.name + '" data-id="' + board.id + '" viewBox="0 0 16 16"> <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" /></svg></li>' + del_icon + '</ul></div></span></li>'


}

function reconstructSidebarBoards(json) {
  // get the data
  boards = json.boards
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

function reconstructSidebarCategories(json) {

  // get all the data
  total_tasks = json.total_tasks;
  total_tasks_per_category = json.total_tasks_per_category;
  categories = json.categories;

  if (total_tasks > 0) {
    $("#sidebar-all-tasks").html(
      '<div class="all-tasks-text">All</div><div class="total-number"><div class="number">' + total_tasks + '</div></div>'
    )
  } else {
    $("#sidebar-all-tasks").html('<div class="all-tasks-text">All</div>')
  }

  $('#categories-loop').empty();

  // loop over active board categories and append the data
  categories.forEach((category, i) => {

    $("#categories-loop").append(
      sidebarCategory(category, total_tasks_per_category, i)
    )
  });
}

function reconstructTaskFormCategories(json) {

  categories = json.categories

  $('.newtask-categorySelect').empty();

  categories.forEach((category) => {

    if (json.added_category_id == category.id) {
      var option = '<option value="' + category.id + '" selected=>' + category.name + '</option>'
    } else {
      var option = '<option value="' + category.id + '">' + category.name + '</option>'
    }

    $('.newtask-categorySelect').append(option)

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
        $('.board-name[value="' + id + '"]').html(entered_name)

        // Update the rename-add-icon's data-value attribute, so when clicking on rename again
        // the input field gets pre-populated with this new name
        $('.rename-add-icon[data-id="' + id + '"][data-sender="board"]').data('value', entered_name)
      }

      if (action == 'delete') {

        reconstructSidebarBoards(json);
        reconstructSidebarCategories(json);

        // Highlight the active board
        $('.board-item[value="' + json.active_board_id + '"]').addClass('item-selected');

        // Highlight the active category
        $('.active-category[value="' + json.active_category_id + '"]').addClass('item-selected');


        reloadTasks();
      }

      if (action == 'add') {

        reconstructSidebarBoards(json);

        // Empty sidebar categories and just add "All"
        $('#categories-loop').empty();
        $("#sidebar-all-tasks").html('<div class="all-tasks-text">All</div>')

        // Highlight the "All" category
        $('.active-category[value="-1"]').addClass('item-selected');

        // Highlight the active board
        $('.board-item[value="' + json.active_board_id + '"]').addClass('item-selected');

        reloadTasks();
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

      if (source == 'sidebar') {

        if (action == 'delete') {

          reconstructSidebarCategories(json)

          if (json.is_guest) {
            guestCategoryLimit(json);
          }

          // re-highlight the "All" category
          $('.active-category[value="-1"]').addClass('item-selected');

        }

        if (action == 'add') {

          reconstructSidebarCategories(json)
          
          // re-highlight the active category
          $('.active-category[value="' + json.active_category_id + '"]').addClass('item-selected');
          
          if (json.is_guest) {
            guestCategoryLimit(json);
          }
        }
      }

      if (action == 'add' && source == 'new-task') {

        reconstructTaskFormCategories(json);

        reconstructSidebarCategories(json)

        requiredFieldsCheck();

        // re-highlight the active category
        $('.active-category[value="' + json.active_category_id + '"]').addClass('item-selected');

        if (json.is_guest) {
          guestCategoryLimit(json);
        }
      }

    },

    error: function (xhr, errmsg, err) {

    },

  });

}

function reloadTasks() {

  $.ajax({
    type: "GET",
    url: 'http://localhost:8000/reload_tasks/',
    data: {
      csrfmiddlewaretoken: getCookie('csrftoken'),
    },
    datatype: 'json',

    success: function (json) {

      tasks = json.tasks

      statuses = ["Planned", "In Progress", "Testing", "Completed"]

      planned = 0;
      in_progress = 0;
      testing = 0;
      completed = 0;

      $('#tasks-planned').empty();
      $('#tasks-in-progress').empty();
      $('#tasks-testing').empty();
      $('#tasks-completed').empty();

      tasks.forEach((task) => {

        let myTask = new Task(task, statuses)

        if (task.status == 'Planned') {

          $('#tasks-planned').append(
            myTask.taskCard()
          )
          planned += 1;

        }

        if (task.status == 'In Progress') {

          $('#tasks-in-progress').append(
            myTask.taskCard()
          );
          in_progress += 1;
        }

        if (task.status == 'Testing') {

          $('#tasks-testing').append(
            myTask.taskCard()
          );
          testing += 1;
        }

        if (task.status == 'Completed') {

          $('#tasks-completed').append(
            myTask.taskCard()
          );
          completed += 1;
        }

        subtasks_completed = myTask.subtasks_completed()

        sub_progress = $('.sub-progress-bar' + task.id)
        sub_progress.data('completed', subtasks_completed)

        total_subs = sub_progress.data('totalsubs')
        current_progress = subtasks_completed / total_subs * 360

        percent_progress = parseInt(subtasks_completed / total_subs * 100)

        number = $('.sub-progress-bar' + task.id + ' .number')
        number.html(percent_progress + '%')

        setSubtaskProgressBar(current_progress, task.id)

        modulo = total_subs % 2
        sub_progress.data('modulo', modulo)

        if (current_progress > 180) {
          sub_progress.data('toggle', 0)
        } else {
          sub_progress.data('toggle', 1)
        }
      })

      progress_bar = $('.circle .bar .sub-progress');

      $('#planned-total').html('Planned ' + planned)
      $('#in-progress-total').html('In Progress ' + in_progress)
      $('#testing-total').html('Testing ' + testing)
      $('#completed-total').html('Completed ' + completed)

    },

    error: function (xhr, errmsg, err) {

    },

  })

}


$(document).ready(function () {

  // initialize the popover
  renameAddPopover();

  sender = ""
  action = ""
  id = 0

  // ### RENAME OR ADD ICON ###
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
        if (sender == 'category') {
          ajaxCategoryManager(action, id, entered_name, source)
        }

      }
    }
  });

  // ### DELETE ICON ###
  $(document).on('click', '.delete-icon', function () {

    sender = $(this).data('sender');
    action = $(this).data('action');
    id = $(this).data('id');
    source = $(this).data('source');

    // ### AJAX FOR BOARD ###
    if (sender == 'board') {

      deletePopover();
      $("#popover-message").html(
        'Warning, this action will also delete every CATEGORY and TASK associated with this board!'
      )

      is_deleteBoardCategory_popover_open = true;

      $(document).keypress('#delete-confirm-input', function (e) {
        if (e.which === 13) {
          // only if something is entered and if it was "DELETE"
          if ($('#delete-confirm-input').val() && $('#delete-confirm-input').val() == "DELETE") {
            e.preventDefault();

            ajaxBoardManager(action, id)

            // close the delete popover
            $('.delete-icon').popover('hide');
            is_deleteBoardCategory_popover_open = false;
          }
        }
      });

    }

    // ### AJAX FOR CATEGORY ###
    if (sender == 'category') {

      deletePopover();
      $("#popover-message").html(
        'Warning, this action will also delete every TASK associated with this category!'
      )

      is_deleteBoardCategory_popover_open = true;

      $(document).keypress('#delete-confirm-input', function (e) {
        if (e.which === 13) {
          // only if something is entered and if it was "DELETE"
          if ($('#delete-confirm-input').val() && $('#delete-confirm-input').val() == "DELETE") {
            e.preventDefault();

            ajaxCategoryManager(action, id, entered_name = null, source)

            // close the delete popover
            $('.delete-icon').popover('hide');
            is_deleteBoardCategory_popover_open = false;
          }
        }
      });
    }

  });

  // Close the rename/add popover on pressing ESC
  $(document).keyup(function (e) {
    if (e.which === 27) {
      $('.rename-add-icon').popover('hide');
    }
  });

  // Close the rename/add  popover on click outside
  $(document).on('click', function (e) {
    $('.rename-add-icon').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });

  $(document).ajaxComplete(function () {
    // initialize the popovers
    renameAddPopover();
    deletePopover();

  });

});