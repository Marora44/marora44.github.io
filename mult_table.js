$(function () {
    let inputForm = $("#inputForm");
    inputForm.on("submit", (event) => {
        event.preventDefault();
        $("#multTable").text("").append("<thead><tr><th></th></tr></thead>");
        let rBegin = parseInt($("#rBegin").val());
        let rEnd = parseInt($("#rEnd").val());
        let cBegin = parseInt($("#cBegin").val());
        let cEnd = parseInt($("#cEnd").val());
        let valid = false;
        if (rBegin > rEnd) {
            $("#rErr").css("visibility", "visible");
            valid = false;
        }
        else {
            $("#rErr").css("visibility", "hidden");
            valid = true;
        }
        if (cBegin > cEnd) {
            $("#cErr").css("visibility", "visible");
            valid = valid && false;
        }
        else {
            $("#cErr").css("visibility", "hidden");
            valid = valid && true;
        }
        if(valid){
            console.log("v");
            for (let i = rBegin; i < rEnd + 1; i++) {
                $("#multTable thead tr").append(`<th>${i}</th>`);
            }
            for(let i = cBegin; i < cEnd + 1; i++){ 
                $("#multTable").append(`<tr><td>${i}</td></tr>`);
                for(let j = rBegin; j < rEnd + 1; j++){
                    $("#multTable tr").last().append(`<td>${i*j}</td>`);
                }
            }
            
            $("#table").css("width","fit-content").css("height","fit-content").show();
        }
    })
});