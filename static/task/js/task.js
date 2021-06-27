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

function taskForm(json){
  // ### BOARD NAME ####
  $('newtask-boardName').html(json.board_name)

  // ### CATEGORY SELECTION ####
  categories = JSON.parse(json.categories)
  
  $('.newtask-categorySelect').empty();

  if (categories == null){

    $('.newtask-categorySelect').append(
      '<option value="" selected="">No Categories</option>'
    )

  }else{
    
    categories.forEach((category) => {
      
      if (json.category_id == category.pk){
        var option = '<option value="'+category.pk+'" selected=>'+category.fields.name+'</option>'
      }else{
        var option = '<option value="'+category.pk+'">'+category.fields.name+'</option>'
      }
  
      $('.newtask-categorySelect').append(option)
  
    });

  }

  // ### STATUS , NAME, DESCRIPTION AND SUBTASKS ###
  if (json.is_edit == "True"){

    t = JSON.parse(json.task)
    task = t[0]
    subtasks = JSON.parse(json.subtasks)

    // Status selection
    $('#id_status').empty();

    $('.task-status').removeClass('d-none')

    json.statuses.forEach((status) => {
      
      if (task.fields.status == status){
        var option = '<option value="'+status+'" selected=>'+status+'</option>'
      }else{
        var option = '<option value="'+status+'">'+status+'</option>'
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
        '<span class="d-flex subtask-field"><input type="text-sub" class="card existing-subtask bg-dark text-light col-10" value="'+sub.fields.name+'" disabled=""><div class="delete-existing-subtask delete-icon-task" data-index="'+sub.pk+'"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"></path></svg></div></span>'
      );
    });

    // Create/update button
    $('#create-task').data('taskID', task.pk)

    // Hide "create and continue checkbox"
    if (!$('.custom-checkbox-wrapper').hasClass('d-none')){
      $('.custom-checkbox-wrapper').addClass('d-none');
    }

  }else{
    // show "create and continue checkbox"
    $('.custom-checkbox-wrapper').removeClass('d-none');
  }


  

  // ### CREATE BUTTON ###
  $('#create-task').html(json.button)
  $('#create-task').data('edit', json.is_edit)

  requiredFieldsCheck();
}

// ### Posting task id for setting its "extended state" ###
$(document).ready(function () {

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

  // Edit task button
  $(document).on('click', '#edit-task', function(e){
    e.preventDefault()
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

        toggle = 0;

        $(".new-task-wrapper").toggleClass("newtaskDisplayed");

        taskForm(json)


  
      },
  
      error: function (xhr, errmsg, err) {
  
      },

    });

  });
});