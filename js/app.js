// app.js: main javascript file for this app
"use strict";

var tiles = [];
var tile;

for(var i = 0; i < 32; i++){
    tiles.push({
        tileNum: i,
        src: 'img/tile' + i + '.jpg',
        flipped: false,
        matched: false
    });
}

//When document is ready
$(document).ready(function(){
    //Catch click event of start game button
    $('#start-game').click(function(){
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0,8);
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile){
           tilePairs.push(tile);
           tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);

        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex){
            if(elemIndex > 0 && (elemIndex % 4) == 0){
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }

            img = $(document.createElement('img'));
            img.attr({
               src: 'img/tile-back.png',
               alt: 'tile ' + tile.tileNum
            });

            img.data('tile', tile)
            row.append(img);
        });
        gameBoard.append(row);
        startTimer();

        $('#game-board img').click(function(){
           console.log(this.alt);
           var clickedImg = $(this);
           var tile = clickedImg.data('tile');
           flipTile(tile,clickedImg);
        });
    });


});

function flipTile(tile, img){
    img.fadeOut(100, function(){
        if(tile.flipped){
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });

}

function startTimer(){
    var startTime = Date.now();
    window.setInterval(function(){
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        elapsedSeconds = Math.floor(elapsedSeconds);
        $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
    }, 1000);
}