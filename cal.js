const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const leaveBtn = document.getElementById('leave');

let currentInput = '';
let resultDisplayed = false;

function updateDisplay() {
  display.textContent = currentInput || '0';
}

function appendNumber(num) {
  if (resultDisplayed) {
    currentInput = num;
    resultDisplayed = false;
  } else {
    currentInput += num;
  }
}

function appendOperator(op) {
  if (!currentInput) return; // Prevent starting with operator
  const lastChar = currentInput.slice(-1);
  if ('+-/*'.includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  resultDisplayed = false;
}

function appendDecimal() {
  if (resultDisplayed) {
    currentInput = '0.';
    resultDisplayed = false;
    return;
  }
  const parts = currentInput.split(/[\+\-\*\/]/);
  const lastNumber = parts[parts.length - 1];
  if (!lastNumber.includes('.')) {
    currentInput += '.';
  }
}

function clearAll() {
  currentInput = '';
  resultDisplayed = false;
}

function deleteLast() {
  if (resultDisplayed) {
    clearAll();
  } else {
    currentInput = currentInput.slice(0, -1);
  }
}

function calculate() {
  if (!currentInput) return;
  try {
    let expression = currentInput;
    if ('+-/*'.includes(expression.slice(-1))) {
      expression = expression.slice(0, -1);
    }
    let evalResult = eval(expression);
    if (evalResult === Infinity || evalResult === -Infinity) {
      currentInput = 'Error';
    } else {
      currentInput = String(evalResult);
    }
    resultDisplayed = true;
  } catch {
    currentInput = 'Error';
    resultDisplayed = true;
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.disabled) return;
    if (button.classList.contains('number')) {
      appendNumber(button.dataset.num);
      updateDisplay();
    } else if (button.classList.contains('operator')) {
      appendOperator(button.dataset.op);
      updateDisplay();
    } else if (button.id === 'decimal') {
      appendDecimal();
      updateDisplay();
    } else if (button.id === 'clear') {
      clearAll();
      updateDisplay();
    } else if (button.id === 'delete') {
      deleteLast();
      updateDisplay();
    } else if (button.id === 'equals') {
      calculate();
      updateDisplay();
    }
  });
});

// Popup creator utility
function createPopup(message, buttonsConfig) {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  const popup = document.createElement('div');
  popup.className = 'popup';

  const msg = document.createElement('p');
  msg.textContent = message;
  popup.appendChild(msg);

  buttonsConfig.forEach(btnCfg => {
    const btn = document.createElement('button');
    btn.textContent = btnCfg.text;
    btn.onclick = () => {
      btnCfg.callback();
      document.body.removeChild(overlay);
    };
    popup.appendChild(btn);
  });

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  return overlay;
}

// Leave button functionality
leaveBtn.addEventListener('click', () => {
  createPopup('Are you sure you want to leave?', [
    {
      text: 'Yes',
      callback: () => {
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);
        leaveBtn.disabled = true;

        // Show goodbye popup
        createPopup('Thank you for using the calculator! 👋', [
          {
            text: 'Close',
            callback: () => {
              // Optionally reload page or just keep disabled
              // location.reload();
            }
          }
        ]);
      }
    },
    {
      text: 'No',
      callback: () => {
        // Close popup and continue
      }
    }
  ]);
});
