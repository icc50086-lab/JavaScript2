const displayEl = document.getElementById("display");

let current = "0";
let previous = null;
let operator = null;
let waitingNext = false;

function setActive(btn) {
  document.querySelectorAll(".key").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
}

function format(n) {
  if (!Number.isFinite(n)) return "Error";
  const s = String(n);
  if (s.length <= 16) return s;
  return String(Number(n.toPrecision(12)));
}

function render() {
  // 演算子を押した直後は「5*」のように表示したい
  if (operator !== null && waitingNext && previous !== null) {
    displayEl.textContent = `${format(previous)}${operator}`;
  } else {
    displayEl.textContent = current;
  }
}

function inputNumber(str) {
  if (waitingNext) {
    current = (str === "00") ? "0" : str;
    waitingNext = false;
    return;
  }

  if (current === "0") {
    current = (str === "00") ? "0" : str;
    return;
  }

  if (current.length >= 16) return;
  current += str;
}

function inputDot() {
  if (waitingNext) {
    current = "0.";
    waitingNext = false;
    return;
  }
  if (current.includes(".")) return;
  current += ".";
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  waitingNext = false;
}

function compute(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? NaN : a / b;
  return b;
}

function setOperator(nextOp) {
  const curNum = Number(current);

  if (previous === null) {
    previous = curNum;
    operator = nextOp;
    waitingNext = true;
    return;
  }

  // すでに演算子押した直後なら、演算子だけ変更（例: 5+ → 5*）
  if (waitingNext) {
    operator = nextOp;
    return;
  }

  // 連続計算（例: 2 + 3 + 4）
  const result = compute(previous, curNum, operator);
  previous = result;
  current = format(result);

  operator = nextOp;
  waitingNext = true;
}

function equal() {
  if (operator === null || previous === null) return;
  if (waitingNext) return; // 「5*」状態で = は何もしない

  const a = Number(previous);
  const b = Number(current);
  const result = compute(a, b, operator);

  current = format(result);
  previous = null;
  operator = null;
  waitingNext = false;
}

document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  setActive(btn);

  const type = btn.dataset.type;
  const value = btn.dataset.value;

  if (type === "number") {
    inputNumber(value);
    render();
    return;
  }

  if (type === "dot") {
    inputDot();
    render();
    return;
  }

  if (type === "operator") {
    setOperator(value);
    render();
    return;
  }

  if (type === "equal") {
    equal();
    render();
    return;
  }

  if (type === "ac") {
    clearAll();
    render();
    return;
  }
});

render();
