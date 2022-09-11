$(() => {
    let colorText;
    $('#tableButton').on('click', () => {
        color = $('#tableButton').hasClass('btnRed') ? 'red' : 'green';
        $('#tableButton').text(`click me to change the table borders to ${color}`);
        $('#firstTable').toggleClass('tableRed');
        $('#firstTable').toggleClass('tableGreen');
        $('#tableButton').toggleClass('btnRed');
        $('#tableButton').toggleClass('btnGreen');
        
    })
});