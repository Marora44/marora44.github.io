/* 
Author: Mundeep Arora
Email: mundeep_arora@student.uml.edu 
*/

$(() => {
    let g = new Game($("#lengthCheck").hide(), null, $("#spaceCheck").hide(),$("#submit"), $("#gameArea").html(""));
    g.start();
    $("#recallButton").on("click", () => {
        g.currentTurn.recall();
    })
    $("#submit").on("click", ()=>{
        g.nextTurn();
        $("#score").text(g.totalScore);
    })
    $("#newGame").on("click", ()=>{
        g = new Game($("#lengthCheck").hide(), null, $("#spaceCheck").hide(),$("#submit"), $("#gameArea").html(""));
        $("#score").text(g.totalScore);
        g.start();
    })

});