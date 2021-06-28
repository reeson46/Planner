function categoryCheck() {

  if ($("#id_category option:first").html() != 'No Categories') {
    $('button[type="submit"]').attr('disabled', false);
    $('#id_category').removeClass('required-field')
  } else {
    $('button[type="submit"]').attr('disabled', true);
    $('#id_category').addClass('required-field')
  }
}

function requiredFieldsCheck() {
  categoryCheck();

  if ($('input[type="text"]').val() != '') {
    $('button[type="submit"]').attr('disabled', false);
    $('#id_name').removeClass('required-field')

  } else {
    $('button[type="submit"]').attr('disabled', true);
    $('#id_name').addClass('required-field')

  }
}

function resetNewTaskFields() {

  // hide the status field (only available when editing task)
  if (!$('.task-status').hasClass('d-none')) {
    $('.task-status').addClass('d-none');
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


$(document).ready(function () {

  // init an empty array to track which existing subtask was removed
  existing_subtasks = [];

  $('input[type="text"]').on('keyup', function () {

    categoryCheck();

    if ($('input[type="text"]').val() != '') {
      $('button[type="submit"]').attr('disabled', false);
      $('#id_name').removeClass('required-field')


    } else {
      $('button[type="submit"]').attr('disabled', true);
      $('#id_name').addClass('required-field')

    }

  })



  // Add Subtask

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

  // Remove Subtask
  $(document).on('click', ".delete-subtask", function (e) {

    e.preventDefault();

    $(this).parent('span').remove();

  });


  // Create/update task button
  $(document).on('click', "#create-task", function (e) {
    e.preventDefault();

    // Grab is_update
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
        $(".reload-board").load(" .reload-board > *");



        resetNewTaskFields();

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
            newtask_toggle = 1;
            edittask_toggle = 1;
          }
        }

        if (is_edit == "True") {
          // close the newtask window
          $(".new-task-wrapper").toggleClass("newtaskDisplayed");
          // and enable back the newtask icon/edit button
            newtask_toggle = 1;
            edittask_toggle = 1;

          if (json.category_change == "True"){
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

  // Cancel button
  $(document).on('click', '#cancel-task', function (e) {
    e.preventDefault();

    // close the newtask window
    $(".new-task-wrapper").toggleClass("newtaskDisplayed");

    // reset all fields
    resetNewTaskFields();

    // and enable back the newtask icon/edit button
    newtask_toggle = 1;
    edittask_toggle = 1;
    is_newtaskDisplayed = false;

  });

});