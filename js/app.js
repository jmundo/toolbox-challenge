// app.js: main javascript file for this app
"use strict";

var gameOver;
var gameTime;
var matches;
var remaining;
var missed;

var tiles = [];
var tile;

for(var i = 1; i < 33; i++){
    tiles.push({
        tileNum: i,
        src: 'img/tile' + i + '.jpg',
        flipped: false,
        matched: false
    });
}

$(document).ready(function(){
    $('#start-game').click(function() {
        gameOver = false;
        matches = 0;
        remaining = 8;
        missed = 0;

        setStats();
        endTimer();

        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0, 8);
        var tilePairs = [];

        _.forEach(selectedTiles, function (tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });

        tilePairs = _.shuffle(tilePairs);

        var gameBoard = $('#game-board');
        gameBoard.empty();
        var row = $(document.createElement('div'));
        var img;

        _.forEach(tilePairs, function (tile, elemIndex) {

            if (elemIndex > 0 && (elemIndex % 4) == 0) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }

            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'tile ' + tile.tileNum
            });

            img.data('tile', tile);
            row.append(img);
        });

        gameBoard.append(row);
        startTimer();

        var clicks = 0;
        var tile1;
        var tile2;
        var img1;
        var img2;

        gameBoard.find('img').click(function() {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');

            if (tile.flipped == false) {
                clicks++;

                if (clicks % 2 != 0 && tile.flipped == false) {
                    tile1 = tile;
                    img1 = clickedImg;
                    flipTile(tile, clickedImg);
                } else {
                    tile2 = tile;
                    img2 = clickedImg;
                    flipTile(tile, clickedImg);
                    checkPair(tile1, tile2, img1, img2);
                }
            }
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
    gameTime = window.setInterval(function(){
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        elapsedSeconds = Math.floor(elapsedSeconds);
        $('#elapsed-seconds').text(elapsedSeconds + ' seconds');

        if(gameOver){
            endTimer();
        }
    }, 1000);
}

function endTimer(){
    clearInterval(gameTime);
}

function checkPair(tile1, tile2, img1, img2){
    if(tile1.tileNum != tile2.tileNum){
        missed++;
        window.setTimeout(function(){
            flipTile(tile1, img1);
            flipTile(tile2, img2);
        }, 1000);
    } else {
        matches++;
        remaining--;
        checkGame();
    }
    setStats();
}

function checkGame(){
    if(matches == 8){
        gameOver = true;
        console.log("You Win!");
    }
}

function setStats(){
    $('#matches').text(matches);
    $('#remaining').text(remaining);
    $('#missed').text(missed);
}