function categoryCheck() {

  if ($("#id_category option:first").html() != 'No Categories') {
    $('button[type="submit"]').attr('disabled', false);
    $('#id_category').removeClass('required-field')
  } else {
    $('button[type="submit"]').attr('disabled', true);
    $('#id_category').addClass('required-field')
  }
}

function requiredFieldsCheck(){
  categoryCheck();

  if ($('input[type="text"]').val() != '') {
    $('button[type="submit"]').attr('disabled', false);
    $('#id_name').removeClass('required-field')

  } else {
    $('button[type="submit"]').attr('disabled', true);
    $('#id_name').addClass('required-field')

  }
}


$(document).ready(function () {

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

        $('#subtask-div').append(
          '<div class="d-flex"><input type="text-sub" class="card subtask bg-dark text-light col-10" value="' + $('#subtask-input').val() + '" disabled><span class="delete-subtask delete-icon-task"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg></span></div>'
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

    $(this).parent('div').remove();


  });


  // Create task button
  $(document).on('click', "#create-task", function (e) {
    e.preventDefault();

    // Grab is_update
    update = $(this).attr('value')

    // Grab Category
    cat = $("select[name='category'").children("option:selected").val();

    // Grab Status
    stat = $("select[name='status'").children("option:selected").val();

    // Grab Name
    n = $("#id_name").val()

    // Grab Description
    d = $("#id_description").val()

    // Grab all subtask
    subs = [];
    $(".subtask").each(function () {
      value = $(this).val()
      subs.push(value)
    })

    // Post all the data
    $.ajax({
      type: "POST",
      url: CREATE_TASK_URL,
      data: {
        update: update,
        //task_id: TASK_ID,
        category: cat,
        status: stat,
        name: n,
        description: d,
        subtasks: subs,
        csrfmiddlewaretoken: CSRF_TOKEN,
        action: 'post',
      },
      datatype: 'json',

      success: function (json) {
        $(".reload-board").load(" .reload-board > *");

        reconstructSidebarCategories(json);

        // Highlight the created task's category
        $('.active-category[value="-1"]').removeClass('item-selected');
        $('.active-category[value="' + json.active_category_id + '"]').addClass('item-selected');

        // if Create and continue is checked
        // if ($('#create-and-continue').is(':checked')){
        //   console.log('checked')
        // }
        // else{
        //   console.log('not checked')
        // }

        // close the newtask window
        $(".new-task-wrapper").toggleClass("newtaskDisplayed");

        // Empty input fields
        $("#id_name").val("");

        // and enable back the newtask icon
        toggle = 1;
      },

      error: function (xhr, errmsg, err) {

      },

    });

  });

  // Delete existing Subtask
  $(document).on('click', ".delete-existing-subtask", function (e) {
    e.preventDefault()

    sub_id = $(this).data('index')

    $(this).parent('div').remove();

    $.ajax({
      type: "POST",
      url: DELETE_EXISTING_TASK,
      data: {
        subtask_id: sub_id,
        csrfmiddlewaretoken: CSRF_TOKEN,
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

  // Cancel button
  $(document).on('click', '#cancel-task', function (e) {
    e.preventDefault();

    // close the newtask window
    $(".new-task-wrapper").toggleClass("newtaskDisplayed");

    // and enable back the newtask icon
    toggle = 1;

  });

});