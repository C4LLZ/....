window.timeBlocksShows = 0; //4.5sec
window.timeUntilLose = 0; //12sec
window.correctBlocksNum = 0;
window.maxIncorrectBlocksNum = 0;
window.allBlocksNum = 36;
window.activateClicking = false;

ThermiteNew = {}

$(document).ready(function(){
ThermiteNew.Start = function(data) {
    window.allBlocksNum = data.size * data.size;
    generateGrid(data.size)

    $(".container").fadeIn(500)
    $(".grid").removeClass("won");

    $(".grid").removeClass("won");
    $(".grid").removeClass("lost");
    hideAllBlocks();
    window.maxIncorrectBlocksNum = data.incorrect;
    window.correctBlocksNum = data.correct;
    window.timeBlocksShows = data.showtime; 
    window.timeUntilLose = data.losetime; 
    // console.log(window.allBlocksNum)
    window.gridCorrectBlocks = generateRandomNumberBetween(1, window.allBlocksNum, data.correct);
    window.activateClicking = false;
    showCorrectBlocks();
    setTimeout(()=>{
    hideAllBlocks();
    window.activateClicking = true;
    }, timeBlocksShows*1000);
    setTimeout(()=>{
        isGameForeited();
    }, timeUntilLose*1000);
}


window.addEventListener('message', function(event){
var action = event.data.action;
switch(action) {
    case "Start":
        ThermiteNew.Start(event.data);
        break;
    }
});
})

$(document.body).on("click", ".block", onBlockClick);

function generateRandomNumberBetween(min=1,max=window.allBlocksNum,length = window.correctBlocksNum){
  var arr = [];
  while(arr.length < length){
      var r = Math.floor(Math.random() * (max+1-min)) + min;
      if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

function generateGrid(size){
  const block = document.querySelectorAll('.block');

  block.forEach(block => {
    block.remove();
  });

  var cntr = 0
  var sizeAttr = ""
  while(cntr < size){
    sizeAttr = sizeAttr + '1fr '

    cntr = cntr + 1
  }
  $(".grid").css("grid-template-columns",sizeAttr);
  $(".grid").css("grid-template-rows",sizeAttr);
  var blockNum = size * size
  cntr = 0
  while(cntr < blockNum){
    var element = document.createElement("div");
    element.classList.add("block");
    element.classList.add("block-" + (cntr + 1));
    document.getElementById('grid').appendChild(element);
    cntr = cntr + 1
  }

}

function onBlockClick(e){
  if(!activateClicking){
    return;
  }
  
  let clickedBlock = e.target;
  
  let blockNum = clickedBlock.classList.value.match(/(?:block-)(\d+)/)[1];
  blockNum = Number(blockNum);
  let correctBlocks = window.gridCorrectBlocks;

  let correct = correctBlocks.indexOf(blockNum) !== -1;
  clickedBlock.classList.add("clicked");
  if(correct){
    clickedBlock.classList.remove("incorrect");
    clickedBlock.classList.add("correct");
  }
  else{
    clickedBlock.classList.add("incorrect");
    clickedBlock.classList.remove("correct");
  }
checkWinOrLost();
}

function showCorrectBlocks(){
  
  $(".block").each((i,ele)=>{
    let blockNum = ele.classList.value.match(/(?:block-)(\d+)/)[1];
    blockNum = Number(blockNum);
    let correctBlocks = window.gridCorrectBlocks;
    let correct = correctBlocks.indexOf(blockNum) !== -1;
    if(correct){
      ele.classList.add("show");
    }
  });
}
function hideAllBlocks(){
  $(".block").each((i,ele)=>{
    ele.classList.remove("show");
    ele.classList.remove("correct");
    ele.classList.remove("incorrect");
    ele.classList.remove("clicked");
  });
}

function checkWinOrLost(){
  if(isGameWon()){
    hideAllBlocks()
    window.activateClicking = false;
    $(".container").fadeOut(500)
    $.post('http://memorygame/ThermiteResult', JSON.stringify({
        success: true
    }));
  }
  if(isGameLost()){
    hideAllBlocks();
    $(".container").hide()
    window.activateClicking = false;
    $.post('http://memorygame/ThermiteResult', JSON.stringify({
        success: false
    }));
  }
 
}

function isGameWon(){
  return $(".correct").length >= (window.correctBlocksNum);
}
function isGameLost(){
  return $(".incorrect").length >= window.maxIncorrectBlocksNum;
};

function isGameForeited(){
    if (window.activateClicking ){
        hideAllBlocks();
        $(".container").fadeOut(500)
        window.activateClicking = false;
        $.post('http://memorygame/ThermiteResult', JSON.stringify({
            success: false
        }));
    }       
}