"use strict";

{
  const gameBoard = document.querySelector("#gameBoard");
  const ctx = gameBoard.getContext("2d");
  const scoreText = document.querySelector("#scoreText");
  const resetBtn = document.querySelector("#resetBtn");
  const countFailed = document.querySelector("#failed");

  const gameWidth = gameBoard.width;
  const gameHeight = gameBoard.height;
  const boardBackground = "#64DB8F";
  const paddle1Color = "#DB7307";
  // const paddle2Color = "red";
  const paddleBorder = "#DB7303";
  const ballColor = "#F9F790";
  const ballBorderColor = "#F0810F";
  const ballRadius = 12.5;
  const paddleSpeed = 50;
  let intervalID;
  let ballSpeed = 1.3;
  // ボールの位置指定
  let ballX = gameWidth / 2;
  let ballY = gameHeight / 2;
  let ballXDirection = 0;
  let ballYDirection = 0;
  let player1Score = 0;
  // let player2Score = 0;
  let failuresNum = 0;

  let paddle1 = {
    width: 100,
    height: 5,
    x: 200,
    y: gameHeight - 25,
  };

  // いずれかのキーが押されているとき
  window.addEventListener("keydown", changeDirection);

  resetBtn.addEventListener("click", resetGame);
  gameStart();

  function gameStart() {
    createBall();
    nextTick();
  }
  function nextTick() {
    intervalID = setTimeout(() => {
      clearBoard();
      drawPaddles();
      moveBall();
      drawBall(ballX, ballY);
      checkCollision();
      nextTick();
      if (failuresNum > 4) {
        drawGameOver();
      }
    }, 10);
  }
  function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }
  // ラケットの描画
  function drawPaddles() {
    // 線・輪郭の色
    ctx.strokeStyle = paddleBorder; /*black*/
    // 塗りつぶしの色
    ctx.fillStyle = paddle1Color; /*lightblue*/
    // 位置とサイズ
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  }

  function createBall() {
    ballSpeed = 1;
    // Math.round=四捨五入 0か1のどちらかがランダムで返ってくる
    if (Math.round(Math.random()) === 1) {
      ballXDirection = 1;
    } else {
      ballXDirection = -1;
    }
    // Y軸もランダムで上か下にボールが動くように指示
    if (Math.round(Math.random()) === 1) {
      ballYDirection = 1;
    } else {
      ballYDirection = -1;
    }
    // ボールの位置は中央を指定
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    // 描画
    drawBall(ballX, ballY);
  }
  function moveBall() {
    // ボール（X、Y軸）の位置はballSpeed*進行方向（上下左右ランダム）
    // nextTick()で0.01秒ごとに繰り返し処理している
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
  }

  function drawBall(ballX, ballY) {
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
  function checkCollision() {
    // Y軸上辺
    if (ballY <= 0 + ballRadius /*半径（12.5）*/) {
      ballYDirection *= -1;
    }
    // X軸左辺
    if (ballX <= 0 + ballRadius /*半径（12.5）*/) {
      ballXDirection *= -1;
    }
    // X軸右辺
    if (ballX >= gameWidth - ballRadius /*半径（12.5）*/) {
      ballXDirection *= -1;
    }
    // ボールが下に落ちた時
    if (ballY >= gameHeight) {
      failuresNum += 1;
      updateScore();
      createBall();
      return;
    }
    if (paddle1.width === 70) {
      ballSpeed = 2;
    }

    if (
      ballY /*ボールのY軸移動*/ >=
      paddle1.y /*ラケットサイズ25*/ -
        ballRadius /*半径12.5* ==下にめり込んだ時*/
    ) {
      if (
        ballX /*ボールのX軸移動*/ >
          paddle1.x /*paddleの左辺から右に大きい　かつ*/ &&
        ballX <
          paddle1.x +
            paddle1.width /*横幅の100（＝右辺）より小さい=当たっている状態*/
      ) {
        // ballY =paddle1.y + ballRadius;/*ballのx座標は初期値＋棒の横幅＋半径*/
        ballYDirection *= -1; /*進行方向を変更*/
        ballSpeed += 0.1;
        player1Score += 1;
        updateScore();
      }
    }
  }
  function changeDirection(event) {
    // キーコードの取得
    const keyPressed = event.keyCode;
    const paddle1Right = 39;
    const paddle1Left = 37;
    // const paddle2Up = 38;
    // const paddle2Down = 40;

    switch (keyPressed) {
      case paddle1Left:
        if (paddle1.x > 0) {
          paddle1.x -= paddleSpeed;
        }
        break;

      case paddle1Right:
        if (paddle1.x < gameWidth - paddle1.width) {
          paddle1.x += paddleSpeed; /*50*/
        }
        break;
    }
  }
  function updateScore() {
    scoreText.textContent = player1Score;
    countFailed.textContent = `failed: ${failuresNum}/5`;
  }

  // ゲームオーバー  }
  function drawGameOver() {
    // clearInterval(intervalID);
    intervalID = null;
    ballSpeed = 0;
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    ctx.font = '28px "Arial Black';
    ctx.fillStyle = "tomato";
    ctx.fillText("GAME OVER", 150, 260);
    ctx.fillText("Please reload to start again", 40, 290);
  }

  // ================

  function resetGame() {
    console.log("reset");
    player1Score = 0;

    paddle1 = {
      width: 100,
      height: 2,
      x: 200,
      y: gameHeight - 25,
    };

    ballSpeed = 1;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    gameStart();
  }
  // 一時停止・再開機能============================================
  document.addEventListener("keydown", gameStop, false);
  document.addEventListener("keydown", gameRestart);
  // スクロール防止
  document.addEventListener("keypress", (e) => {
    if (e.key == " ") event.preventDefault();
  });

  // スペースキーで一時停止
  function gameStop(e) {
    if (e.keyCode === 32) {
      clearInterval(intervalID);
      intervalID = null;
      // 一時停止画面を表示
    }
  }
  // エンターキーで再開
  function gameRestart(e) {
    if (e.keyCode === 13) {
      if (!intervalID) {
        intervalID = setTimeout(() => {
          clearBoard();
          drawPaddles();
          moveBall();
          drawBall(ballX, ballY);
          checkCollision();
          nextTick();
          if (paddle1.width === 70) {
            ballSpeed = 2;
          }
        }, 10);
      }
    }
  }
  // ==========================================================
  // レベル変更機能=============================================
  const easy = document.querySelector("#levelEasy");
  const hard = document.querySelector("#levelHard");

  easy.addEventListener("click", () => {
    paddle1.width = 150;
    easy.classList.add("easy");
    hard.classList.remove("hard");
  });
  hard.addEventListener("click", () => {
    paddle1.width = 70;
    ballSpeed = 2;

    hard.classList.add("hard");
    easy.classList.remove("easy");
  });
  // ==========================================================
  // ボールが横に当たった時の判定
}
