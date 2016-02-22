$(document).ready(function() {
    $('#submit').on('click', postTask);
    $('body').on('load', showAllTasks());
    $('#tasks').on('click', '.button-complete', completeTask);
    $('#tasks').on('click', '.button-delete', deleteTask);
    $('#completed-tasks').on('click', '.button-delete', deleteTask);
});

function postTask() {
    event.preventDefault();

    var values = {};
    $.each($('#task-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $('#task-form').find('input[type=text]').val('');

    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: values,
        success: function(data) {
            if(data) {
                console.log('from server:', data);
                displayTask();

            } else {
                console.log('error');
            }
        }
    });

}

function displayTask() {
    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: function(data) {
            var displayTask = data[data.length-1].task;
            var id = data[data.length-1].id;

            $('#tasks').prepend('<p id="' + id + '"><button class="button-complete" id="' + id + '" /></button>'
                + displayTask + '<button class="button-delete" id="' + id + '"></button></p>');

        }
    })
}

function showAllTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: function(data) {
            console.log(data);

            data.forEach(function(task, i) {
                var displayTask = task.task;
                var id = task.id;
                var completed = task.completed;

                if(completed == false) {

                    $('#tasks').prepend('<p id="' + id + '"><button class="button-complete" id="' + id + '" /></button>'
                     + displayTask + '<button class="button-delete" id="' + id + '"></button></p>');

                } else {
                    $('#completed-tasks').append('<p id="' + id + '"><button class="button-complete" id="' + id + '" /></button>'
                        + displayTask + '<button class="button-delete" id="' + id + '"></button></p>');
                    $('#completed-tasks').find('#' + id).toggleClass('strikeout');
                    $('#completed-tasks').children().find('#' + id).first().toggleClass('checked');
                }

            })

        }
    })
}

function completeTask() {

    var taskId = $(this).attr('id');

    console.log('taskId: ' + taskId);

    var taskText = $('#tasks').find('#' + taskId).text();
    console.log('task text: ' + taskText);

    $(this).parent().remove();

    $('#completed-tasks').append('<p id="' + taskId + '"><button class="button-complete" id="' + taskId + '" /></button>' + taskText + '<button class="button-delete" id="' + taskId + '"></button></p>');

    $('#completed-tasks').find('#' + taskId).toggleClass('strikeout');
    $('#completed-tasks').children().find('#' + taskId).first().toggleClass('checked');

    $.ajax({
        type: 'POST',
        url: '/completeTask',
        data: {id: taskId},
        success: function(data) {
            if(data) {
                console.log('from server:', data);
            } else {
                console.log('error');
            }
        }
    });

}

function deleteTask() {

    var taskId = $(this).attr('id');
    console.log('delete taskId: ' + taskId);

    // this is the stylized alert box - SweetAlert
    swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this task?",
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: true,
        closeOnCancel: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#ec6c62"
    }, function() {

        $.ajax({
            type: 'POST',
            url: '/deleteTask',
            data: {id: taskId},
            success: function(data) {
                if(data) {
                    console.log('id removed: ' + data);
                    $('#tasks').children().find('#' + taskId).parent().remove();
                    $('#completed-tasks').children().find('#' + taskId).parent().remove();

                } else {
                    console.log('error');
                }
            }
    });
    })
}