$(document).ready(function () {

  // Prevent clicking on CREATE/UPDATE button if the "name" field is empty
    
  if($('input[type="text"]').val() != ''){
    $('button[type="submit"]').attr('disabled', false);
    $('#id_name').removeClass('required-field')
  }
  else{
    $('button[type="submit"]').attr('disabled', true);
    $('#id_name').addClass('required-field')
  }

  $('input[type="text"]').on('keyup', function () {
    if ($(this).val() != '') {
      $('button[type="submit"]').attr('disabled', false);
      $('#id_name').removeClass('required-field')
    } 
    else {
      $('button[type="submit"]').attr('disabled', true);
      $('#id_name').addClass('required-field')
      
    }
  });
  
  
  // Add Subtask

  $("#subtask-div").keypress(function (e) {
    if (e.which === 13) {

      if ($('#subtask-input').val()) {
        e.preventDefault();

        $('#subtask-div').append(
          '<div class="row"><input type="text-sub" class="card subtask col-10 bg-dark text-light" value="' + $('#subtask-input').val() + '" disabled><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-x-lg delete-icon delete-subtask col-2" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" /></svg></div>'
        )

        $('#subtask-input').val("");
        $('#subtask-input').focus();

      }
      e.preventDefault();

    }

  });

  // Remove Subtask
  $("#subtask-div").on('click', ".delete-subtask", function (e) {

    e.preventDefault();

    $(this).parent('div').remove();


  });

  // Create task
  $("#create-button").on('click', "#create-task", function (e) {
    e.preventDefault();

    // Store Category
    cat = $("select[name='category'").children("option:selected").val();

    // Store Status
    stat = $("select[name='status'").children("option:selected").val();

    // Store Name
    n = $("#id_name").val()

    // Store Description
    d = $("#id_description").val()

    // Store all subtask
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
        update: UPDATE,
        task_id: TASK_ID,
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
        //alert(json.message)
        window.location = DASHBOARD_HOME_URL
      },

      error: function (xhr, errmsg, err) {

      },

    });

  });

  // Delete existing Subtask
  $("#subtask-div").on('click', ".delete-existing-subtask", function (e) {
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

});