$(() => {
    function makeTable() {
        $("#multTable").text("").append("<thead><tr><th></th></tr></thead>");
        let rBegin = parseInt($("#rBegin").val());
        let rEnd = parseInt($("#rEnd").val());
        let cBegin = parseInt($("#cBegin").val());
        let cEnd = parseInt($("#cEnd").val());
        for (let i = rBegin; i < rEnd + 1; i++) {
            $("#multTable thead tr").append(`<th>${i}</th>`);
        }
        for (let i = cBegin; i < cEnd + 1; i++) {
            $("#multTable").append(`<tr><td>${i}</td></tr>`);
            for (let j = rBegin; j < rEnd + 1; j++) {
                $("#multTable tr").last().append(`<td>${i * j}</td>`);
            }
        }

        $("#table").css("width", "fit-content").css("height", "fit-content").show();
    }

    //makeTable();

    formValidator = $("#inputForm").validate({
        submitHandler: (form) => {
            $("#multTable").text("").append("<thead><tr><th></th></tr></thead>");
            let rBegin = parseInt($("#rBegin").val());
            let rEnd = parseInt($("#rEnd").val());
            let cBegin = parseInt($("#cBegin").val());
            let cEnd = parseInt($("#cEnd").val());
            for (let i = rBegin; i < rEnd + 1; i++) {
                $("#multTable thead tr").append(`<th>${i}</th>`);
            }
            for (let i = cBegin; i < cEnd + 1; i++) {
                $("#multTable").append(`<tr><td>${i}</td></tr>`);
                for (let j = rBegin; j < rEnd + 1; j++) {
                    $("#multTable tr").last().append(`<td>${i * j}</td>`);
                }
            }

            $("#table").css("width", "fit-content").css("height", "fit-content").show();
        },
        rules: {
            rBegin: {
                required: true,
                range: [-100, 100]
            },
            rEnd: {
                required: true,
                range: (element) => { return [($("#rBegin").valid() ? $("#rBegin").val() : -100), 100] }
            },
            cBegin: {
                required: true,
                range: [-100, 100]
            },
            cEnd: {
                required: true,
                range: (element) => { return [($("#cBegin").valid() ? $("#cBegin").val() : -100), 100] }
            }
        }
    });

    $("#rBeginSlider").slider({
        min: -100,
        max: 100,
        slide: (e, ui) => { $("#rBegin").val(parseInt(ui.value)) },
        change: () => { formValidator.form(); makeTable() }
    });
    $("#rEndSlider").slider({
        min: -100,
        max: 100,
        slide: (e, ui) => { $("#rEnd").val(parseInt(ui.value)) },
        change: () => { formValidator.form(); makeTable() }
    });
    $("#cBeginSlider").slider({
        min: -100,
        max: 100,
        slide: (e, ui) => { $("#cBegin").val(parseInt(ui.value)) },
        change: () => { formValidator.form(); makeTable() }
    });
    $("#cEndSlider").slider({
        min: -100,
        max: 100,
        value: $("#rBegin").val(),
        slide: (e, ui) => { $("#cEnd").val(parseInt(ui.value)) },
        change: () => { formValidator.form(); makeTable() }
    });




});