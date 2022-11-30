$(() => {

   $("#inputForm").validate({
    submitHandler: (form) =>{
        $("#multTable").text("").append("<thead><tr><th></th></tr></thead>");
        let rBegin = parseInt($("#rBegin").val());
        let rEnd = parseInt($("#rEnd").val());
        let cBegin = parseInt($("#cBegin").val());
        let cEnd = parseInt($("#cEnd").val());
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
    },
    rules: {
        
        rBegin: {
            required: true,
            range: [-100,100]
        },
        rEnd: {
            required:true,
            range: (element) => {return [($("#rBegin").valid() ? $("#rBegin").val() : -100),100]}
            }
        }
    
   })
});