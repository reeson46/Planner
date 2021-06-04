// function getCookie(name) {
//   var cookieValue = null;
//   if (document.cookie && document.cookie != "") {
//     var cookies = document.cookie.split(";");
//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = jQuery.trim(cookies[i]);
//       // Does this cookie string begin with the name we want?
//       if (cookie.substring(0, name.length + 1) == name + "=") {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }

$(document).ready(function () {

  // Add Subtask
  $("#subtask-div").keypress(function (e) {
    if (e.which === 13) {

      if ($('#subtask-input').val()) {
        e.preventDefault();

        $('#subtask-div').append(
          '<div class="row"><input type="text" class="card subtask col-sm" value="' + $('#subtask-input').val() + '" disabled><button type="button" class="btn btn-sm col-sm" id="delete-subtask">Delete</button></div>'
        )

        $('#subtask-input').val("");
        $('#subtask-input').focus();

      }
      e.preventDefault();

    }

  });

  // Remove Subtask
  $("#subtask-div").on('click', "#delete-subtask", function (e) {

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
    n = $("#name").val()

    // Store Description
    d = $("#description").val()

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
        task_id : TASK_ID,
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
  $("#subtask-div").on('click', "#delete-existing-subtask", function (e){
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