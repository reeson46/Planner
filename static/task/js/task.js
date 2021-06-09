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
// Posting task id for setting its "extended state"
$(document).ready(function () {

  $(document).on('click', '.task-extend', function (e) {
    e.preventDefault();

    task_id = $(this).data('index')
    task_extend_state = $(this).attr('value')
    console.log('task id ' + task_id)
    console.log('task state ' + task_extend_state)

    task_extend_state = 1 - task_extend_state;

    console.log('current state' + task_extend_state)

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
});