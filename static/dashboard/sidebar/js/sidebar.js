$(document).ready(function () {
  // HIGHLIGHT THE ACTIVE BOARD/CATEGORY

  // on page refresh, highligh the active board
  $('.active-board[value="' + HIGHLIGHTED_BOARD + '"]').addClass('item-selected');

  // keep the selected board highlighted
  $(document).on('click', '.board-item', function () {
    $('.board-item').parent().parent().removeClass('item-selected');
    $(this).parent().parent().addClass('item-selected');
  });

  // on page refresh, highligh the active category
  $('.active-category[value="' + HIGHLIGHTED_CATEGORY + '"]').addClass('item-selected');

  // keep the selected category highlighted
  $(document).on('click', '.category-item', function() {
    $('.category-item').parent().removeClass('item-selected');
    $(this).parent().addClass('item-selected');
  });

  // SET TOTAL TASK NUMBER FOR EACH CATEGORY
  var tasks = JSON.parse(TOTAL_TASKS_PER_CATEGORY)
  $('.total-tasks-number').each(function (i) {
    if (tasks[i] != 0) {
      $(this).append('<div class="total-number"><div class="number">'+tasks[i]+'</div></div>');
    }
  });


  // ALL ABOUT ACTIVE BOARD

  // POST selected board id
  $(document).on('click', ".board-item", function (e) {
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
        
        // get all the data
        total_tasks = json.total_tasks;
        category_names = json.category_names;
        category_ids = json.category_ids;
        total_tasks_per_category = json.total_tasks_per_category;
        
        $(".reload-board").load(location.href+" .reload-board>*","");
        
        if (total_tasks > 0){
          $("#sidebar-all-tasks").html(
            'All <div class="total-number"><div class="number">'+total_tasks+'</div></div>'
          )
        }else{
          $("#sidebar-all-tasks").html('All')
        }

        // highlight the "All" category
        $('.active-category[value="-1"]').addClass('item-selected');

        $('#sidebar-categories').empty();

        category_names.forEach((name, i) => {

          $("#sidebar-categories").append(
            sidebarCategory(
              name,
              category_ids,
              total_tasks_per_category,
              i,
            )
          )
        });
      },

      error: function (xhr, errmsg, err) {

      },

    });

  });

  // ALL ABOUT ACTIVE CATEGORY

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
        $(".reload-board").load(" .reload-board > *");

      },

      error: function (xhr, errmsg, err) {

      },

    });

  });


});