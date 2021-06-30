var edittask_toggle;
var is_taskFormDisplayed;

$(document).ready(function () {

  // enable the task card's "edit" button
  edittask_toggle = true;

  is_taskFormDisplayed = false;

  // ### Posting task id for setting its "extended state" ###
  $(document).on('click', '.task-extend', function (e) {
    e.preventDefault();

    task_id = $(this).data('index')
    task_extend_state = $(this).attr('value')

    task_extend_state = 1 - task_extend_state;

    $.ajax({
      type: "POST",
      url: 'http://localhost:8000/task/set_task_extend_state/',
      data: {
        task_id: task_id,
        task_extend_state: task_extend_state,
        csrfmiddlewaretoken: getCookie('csrftoken'),
        action: 'post',
      },
      datatype: 'json',

      success: function (json) {
        //alert(json.message)

      },

      error: function (xhr, errmsg, err) {

      },

    });

  });

  // ### Edit task button ###
  $(document).on('click', '#edit-task', function (e) {
    e.preventDefault()

    if (edittask_toggle) {

      var task_id = $(this).attr('value')

      $.ajax({
        type: "GET",
        url: 'http://localhost:8000/task/edit_task/',

        data: {
          task_id: task_id,
          csrfmiddlewaretoken: getCookie('csrftoken'),
        },
        datatype: 'json',

        success: function (json) {

          // while we have the "edit task" window open,
          // we must disable the "new task icon" and the "edit" button itself
          taskForm_toggle = false;
          edittask_toggle = false;

          is_taskFormDisplayed = true;

          $(".new-task-wrapper").toggleClass("newtaskDisplayed");

          taskForm(json)

        },

        error: function (xhr, errmsg, err) {

        },
      });
    }
  });

  // ### Subtask checkbox ###
  // posting the checkbox state
  $('.custom-subtask-checkbox').change(function () {

    if ($(this).is(':checked')) {
      is_complete = true
    } else {
      is_complete = false
    }

    subtask_id = $(this).data('subtaskid')

    $.ajax({
      type: 'POST',
      url: 'http://localhost:8000/task/subtask_manager/',
      data: {
        is_complete: is_complete,
        subtask_id: subtask_id,
        csrfmiddlewaretoken: getCookie('csrftoken')
      },
      datatype: 'json',

      success: function (json) {

      },

      error: function (xhr, errmsg, err) {

      },
    });

  });

  // ### Task card's"status" selection ###
  $(document).on('click', '.taskcard-status', function (e) {
    e.preventDefault();

    task_id = $(this).data('taskid');
    new_status = $(this).html()
    current_status = $(this).data('status')

    if (new_status != current_status) {

      $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/task/status_manager/',
        data: {
          task_id: task_id,
          new_status: new_status,
          csrfmiddlewaretoken: getCookie('csrftoken')
        },
        datatype: 'json',

        success: function (json) {

          $(".reload-board").load(location.href + " .reload-board>*", "");

        },

        error: function (xhr, errmsg, err) {

        },
      });
    }
  });
});

// Close the new/edit task on pressing ESC
// this should only be possible if "new/edit" task window is open AND 
// if the "task delete popover" in NOT open
$(document).keyup(function (e) {
  if (e.which === 27) {

    if (is_taskFormDisplayed && !is_deleteTask_popover_open && !is_deleteBoardCategory_popover_open) {
      $('.new-task-wrapper').toggleClass('newtaskDisplayed');
      is_taskFormDisplayed = false;
      taskForm_toggle = true;
      edittask_toggle = true;
    }
  }
});