function taskForm(json) {

  // ### BOARD NAME ####
  $('.newtask-boardName').html(json.board_name)

  // ### CATEGORY SELECTION ####
  categories = JSON.parse(json.categories)

  $('.newtask-categorySelect').empty();

  if (categories == null) {

    $('.newtask-categorySelect').append(
      '<option value="" selected="">No Categories</option>'
    )

  } else {

    categories.forEach((category) => {

      if (json.category_id == category.pk) {
        var option = '<option value="' + category.pk + '" selected=>' + category.fields.name + '</option>'
      } else {
        var option = '<option value="' + category.pk + '">' + category.fields.name + '</option>'
      }

      $('.newtask-categorySelect').append(option)

    });

  }

  // ### DELETE, STATUS , NAME, DESCRIPTION AND SUBTASKS ###
  // only if we are editing the task
  if (json.is_edit == "True") {

    t = JSON.parse(json.task)
    task = t[0]
    subtasks = JSON.parse(json.subtasks)

    // Show Delete button and add task data to it
    $('.delete-task-button').removeClass('d-none');
    $('#delete-task').data('taskid', task.pk);
    $('#delete-task').data('taskname', task.fields.name);

    // Status selection
    $('#id_status').empty();

    $('.task-status').removeClass('d-none')

    json.statuses.forEach((status) => {

      if (task.fields.status == status) {
        var option = '<option value="' + status + '" selected=>' + status + '</option>'
      } else {
        var option = '<option value="' + status + '">' + status + '</option>'
      }

      $('#id_status').append(option)

    });

    // Task name field
    $('#id_name').val(task.fields.name)

    // Task description field
    $('#id_description').val(task.fields.description)

    // Subtasks
    $('#individual-subtask').empty();

    subtasks.forEach((sub) => {
      $('#individual-subtask').append(
        '<span class="d-flex subtask-field"><input type="text-sub" class="card existing-subtask bg-dark text-light col-10" value="' + sub.fields.name + '" disabled=""><div class="delete-existing-subtask delete-icon-task" data-index="' + sub.pk + '"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"></path></svg></div></span>'
      );
    });

    // Create/update button
    $('#create-task').data('taskID', task.pk)

    // Hide "create and continue checkbox"
    if (!$('.custom-checkbox-wrapper').hasClass('d-none')) {
      $('.custom-checkbox-wrapper').addClass('d-none');
    }

  } else {

    // Hide "delete button"
    if (!$('.delete-task-button').hasClass('d-none')) {
      $('.delete-task-button').addClass('d-none');
    }

    // Hide "status selection"
    if (!$('.task-status').hasClass('d-none')) {
      $('.task-status').addClass('d-none');
    }

    // show "create and continue checkbox"
    $('.custom-checkbox-wrapper').removeClass('d-none');

  }

  // ### CREATE/UPDATE BUTTON ###
  $('#create-task').html(json.button)
  $('#create-task').data('edit', json.is_edit)

  requiredFieldsCheck();
}

function requiredFieldsCheck() {

  if ($("#id_category option:first").html() != 'No Categories' && $('input[type="text"]').val() != ''){
    $('button[type="submit"]').attr('disabled', false);
  }
  else{
    $('button[type="submit"]').attr('disabled', true);
  }

  if ($("#id_category option:first").html() != 'No Categories'){
    $('#id_category').removeClass('required-field')
  }
  else{
    $('#id_category').addClass('required-field')
  }

  if ($('input[type="text"]').val() != ''){
    $('#id_name').removeClass('required-field')
  }else{
    $('#id_name').addClass('required-field')
  }
}

function resetTaskFormFields() {

  // hide the status field (only available when editing task)
  if (!$('.task-status').hasClass('d-none')) {
    $('.task-status').addClass('d-none');
  }

  // hide the Delete button (only available when editing task)
  if (!$('.delete-task-button').hasClass('d-none')) {
    $('.delete-task-button').addClass('d-none');
  }

  // Empty input fields
  $("#id_name").val("");
  $("#id_description").val("");
  $("#subtask-input").val("");

  // remove subtasks
  $('#individual-subtask').empty();

  // clear array
  existing_subtasks = []

}

function deleteTaskPopover() {
  $('#delete-task').popover({
    html: true,
    sanitize: false,
    content: function () {
      return '<div class="card shadow delete-window p-3"><div class="text-center text-warning fs-4 mb-2 mt-1">Are you sure you want to delete "' + $(this).data('taskname') + '"?</div><div class="text-center text-danger fs-5 mb-3">Warning, this cannot be undone!</div><div class="text-center text-white fs-6 mb-1 mb-2">To confirm this action, type "DELETE" below and press Enter, or press ESC to cancel</div><input type="text" class="card bg-dark text-light" id="delete-task-confirm-input"></div>'
    },

  }).on('shown.bs.popover', function () {
    // focus the input
    $('#delete-task-confirm-input').focus();

  });
}

var is_deleteTask_popover_open;

$(document).ready(function () {

  // init the popover
  deleteTaskPopover();

  is_deleteTask_popover_open = false;

  // init an empty array to track which existing subtasks were removed
  existing_subtasks = [];

  // checking if "new/edit task" required fields are valid
  $('input[type="text"]').on('keyup', function () {

    requiredFieldsCheck();

  });

  // ### Add Subtask ###
  $("#subtask-div").keypress(function (e) {
    if (e.which === 13) {

      if ($('#subtask-input').val()) {
        e.preventDefault();

        $('#individual-subtask').append(
          '<span class="d-flex subtask-field"><input type="text-sub" class="card subtask bg-dark text-light col-10" value="' + $('#subtask-input').val() + '" disabled=""><div class="delete-subtask delete-icon-task"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"></path></svg></div></span>'
        )

        $('#subtask-input').val("");
        $('#subtask-input').focus();

      }
      e.preventDefault();

    }

  });

  // ### Remove Subtask ###
  $(document).on('click', ".delete-subtask", function (e) {

    e.preventDefault();

    $(this).parent('span').remove();

  });


  // ### Create/update task button ###
  $(document).on('click', "#create-task", function (e) {
    e.preventDefault();

    // Grab is_edit
    is_edit = $(this).data('edit')

    // Grab Category
    cat = $("select[name='category'").children("option:selected").val();

    // Grab Status
    stat = $("select[name='status'").children("option:selected").val();

    // Grab Name
    n = $("#id_name").val()

    // Grab Description
    d = $("#id_description").val()

    // Grab all subtask
    subtasks = [];
    $("#individual-subtask :input.subtask").each(function () {
      value = $(this).val()
      subtasks.push(value)
    })

    // Grab task id
    task_id = $('#create-task').data('taskID')

    // Post all the data
    $.ajax({
      type: "POST",
      url: CREATE_TASK_URL,
      data: {
        is_edit: is_edit,
        task_id: task_id,
        category: cat,
        status: stat,
        name: n,
        description: d,
        subtasks: subtasks,
        deleted_subtasks: existing_subtasks,
        csrfmiddlewaretoken: CSRF_TOKEN,
        action: 'post',
      },
      datatype: 'json',

      success: function (json) {

        //$(".reload-board").load(location.href + " .reload-board>*", "");
        reloadTasks();

        resetTaskFormFields();

        if (is_edit == "False") {

          reconstructSidebarCategories(json);

          // Highlight the created task's category
          $('.active-category[value="-1"]').removeClass('item-selected');
          $('.active-category[value="' + json.active_category_id + '"]').addClass('item-selected');

          // if Create and continue is checked
          if ($('#create-and-continue').is(':checked')) {

            requiredFieldsCheck();

          } else {
            // close the newtask window
            $(".new-task-wrapper").toggleClass("newtaskDisplayed");
            // and enable back the newtask icon/edit button
            taskForm_toggle = true;
            edittask_toggle = true;
          }
        }

        if (is_edit == "True") {
          // close the newtask window
          $(".new-task-wrapper").toggleClass("newtaskDisplayed");
          // and enable back the newtask icon and edit button
          taskForm_toggle = true;
          edittask_toggle = true;

          // only if the task's category has been changed
          if (json.category_change == "True") {
            reconstructSidebarCategories(json);
            // Highlight the active category
            $('.active-category[value="' + json.active_category_id + '"]').addClass('item-selected');
          }
        }
      },

      error: function (xhr, errmsg, err) {

      },
    });
  });


  // On "deleting" existing task, add its id to array
  $(document).on('click', ".delete-existing-subtask", function (e) {
    e.preventDefault()

    $(this).parent('span').remove()

    existing_subtasks.push($(this).data('index'))

  });

  // ### Cancel button ###
  $(document).on('click', '#cancel-task', function (e) {
    e.preventDefault();

    // close the newtask window
    $(".new-task-wrapper").toggleClass("newtaskDisplayed");

    // reset all fields
    resetTaskFormFields();

    // and enable back the newtask icon/edit button
    taskForm_toggle = true;
    edittask_toggle = true;

    is_taskFormDisplayed = false;
    

    // close the "delete task popover" if it was open
    if (is_deleteTask_popover_open) {
      $('#delete-task').popover('hide');
      delete_task_button_toggle = 1
    }

  });

  // ### DELETE TASK CONFIRMATION ###
  // On pressing Enter
  $(document).keypress('#delete-task-confirm-input', function (e) {
    if (e.which === 13) {
      // only if something is entered and if it was "DELETE"
      if ($('#delete-task-confirm-input').val() && $('#delete-task-confirm-input').val() == "DELETE") {
        e.preventDefault();

        delete_popover = $('#delete-task');

        task_id = delete_popover.data('taskid');
        delete_popover.popover('hide');


        $.ajax({
          type: 'POST',
          url: 'http://localhost:8000/task/delete_task/',
          data: {
            task_id: task_id,
            csrfmiddlewaretoken: getCookie('csrftoken')
          },
          datatype: 'json',

          success: function (json) {

            //$(".reload-board").load(location.href + " .reload-board>*", "");
            reloadTasks();

            resetTaskFormFields();

            // close the newtask window
            $(".new-task-wrapper").toggleClass("newtaskDisplayed");
            // and enable back the newtask icon/edit button
            taskForm_toggle = true;
            edittask_toggle = true;

            is_deleteTask_popover_open = false;
            is_taskFormDisplayed = false;

            reconstructSidebarCategories(json);

            // re-highlight the active category
            $('.active-category[value="' + json.active_category_id + '"]').addClass('item-selected');

          },

          error: function (xhr, errmsg, err) {

          },
        });
      }
    }
  });

  // ### On clicking the "delete" task button ###
  var delete_task_button_toggle = 1;
  $(document).on('click', '#delete-task', function () {

    // setting the "is delete popover open" state
    if (delete_task_button_toggle == 1) {
      is_deleteTask_popover_open = true;
    } else {
      is_deleteTask_popover_open = false;
    }

    delete_task_button_toggle = 1 - delete_task_button_toggle;

  })

  // Close the delete task popover on ESC
  $(document).keyup(function (e) {
    if (e.which === 27) {
      if (is_deleteTask_popover_open) {
        $('#delete-task').popover('hide');
        is_deleteTask_popover_open = false;
        delete_task_button_toggle = 1
      }
    }
  });

});