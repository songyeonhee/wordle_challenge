let index = 0;
let attempts = 0;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료되었습니다.";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    div.style.position = "absolute";
    div.style.top = "40vh";
    div.style.left = "38vw";
    div.style.backgroundColor = "white";
    div.style.width = "200px";
    div.style.height = "100px";
    document.body.appendChild(div);
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts += 1;
    index = 0;
  };

  const handleEnterKey = async () => {
    let 정답_개수 = 0;
    const 응답 = await fetch("answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      const 입력_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      if (입력_글자 === 정답_글자) {
        정답_개수 += 1;
        block.style.background = "#6aaa64";
        block.classList.add("flipped");
      } else if (정답.includes(입력_글자)) block.style.background = "#c9b458";
      else block.style.background = "#787c7e";

      block.style.color = "white";
    }
    if (정답_개수 === 5) gameover();
    else nextLine();
  };
  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    console.log(event.key, event.keyCode);
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index++;
    }
  };

  const handleClick = (event) => {
    const key = event.target.getAttribute("data-key");
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    if (key === "BACKSPACE") handleBackspace();
    else if (index === 5) {
      if (key === "ENTER") handleEnterKey();
      else return;
    } else if (key && key.length === 1 && /^[A-Z]$/.test(key)) {
      thisBlock.innerText = key;
      index++;
    }
  };

  document
    .querySelectorAll(".keyboard-column, .enter, .backspace")
    .forEach((element) => {
      element.addEventListener("click", handleClick);
    });

  const 시작_시간 = new Date();
  function setTime() {
    const 현재_시간 = new Date();
    const 경과_시간 = new Date(현재_시간 - 시작_시간);
    const 분 = 경과_시간.getMinutes().toString().padStart(2, "0");
    const 초 = 경과_시간.getSeconds().toString().padStart(2, "0");
    const time = document.querySelector(".time");
    time.innerText = `${분}:${초}`;
  }

  timer = setInterval(setTime, 1000);
  window.addEventListener("keydown", handleKeydown);
}

appStart();
