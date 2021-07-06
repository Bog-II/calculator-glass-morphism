const equal = document.querySelector('#equal');
const output = <HTMLElement>document.querySelector('#output');
const backspaceDelete = document.querySelector('#backspace-span');

// CONSTANTS
const MAXIMAL_LENGTH_OUTPUT = 12;
const operatorsAndParenthesis = new Set(['(', ')', '%', '+', '-', '×', '÷']);

/**
 * Trim the ending zeros if the number is a float, and if necessary the comma (5.000 become 5)
 * @param {string} number
 * @return {string} the trimmed number
 */
const trimEndingZeros = (number: string): string => {
  let firstIndexNotZero = number.length - 1;

  while (number[firstIndexNotZero] === '0') {
    firstIndexNotZero--;
  }

  if (number[firstIndexNotZero] == '.') {
    return number.slice(0, firstIndexNotZero);
  }

  let indexPoint = 0;
  for (let i = firstIndexNotZero - 1; i > 0; i--) {
    if (number[i] === '.') {
      indexPoint = i;
    }
  }

  const isDecimal = indexPoint != 0;
  if (isDecimal) {
    return number.slice(0, firstIndexNotZero + 1);
  }

  return number;
};

/**
 * Event when the equal span span is clicked
 */
const handleClickEqual = (): void => {
  const outputValue: string = output.innerText;

  const lenOutputValue = outputValue.length;
  const lastChar = outputValue[lenOutputValue - 1];

  if (!operatorsAndParenthesis.has(lastChar)) {
    if (lenOutputValue > 1) {
      const parsedValue = outputValue.replace('×', '*').replace('÷', '/');
      const evalValue: number = eval(parsedValue).toFixed(11);
      let strOutput = evalValue.toString();

      if (strOutput.length > MAXIMAL_LENGTH_OUTPUT) {
        strOutput = strOutput.slice(0, MAXIMAL_LENGTH_OUTPUT);
      }

      strOutput = trimEndingZeros(strOutput);
      output.innerText = strOutput;
    }
  }
};
equal?.addEventListener('click', handleClickEqual);

/**
 * Event when a digit or an operator is clicked
 * @param {Event} e
 */
const handleClickDigitOrOperator = (e: Event): void => {
  const currOutput = output.innerText;
  if (currOutput.length < MAXIMAL_LENGTH_OUTPUT) {
    const target = <HTMLElement>e.target;
    const value = target.innerText;
    output.innerText += value;
  }
};

const operatorsOrDigits = document
  .querySelector('#key-layout')!
  .querySelectorAll('.oper-digi');

for (const operatorOrDigit of operatorsOrDigits) {
  operatorOrDigit.addEventListener('click', handleClickDigitOrOperator);
}

/**
 * Event when the backspace span is pressed. Remove the last char of the output.innerText
 */
const handleClickDelete = (): void => {
  const outputValue: string = output.innerText;
  const outputValueLength = outputValue.length;

  if (outputValueLength > 0) {
    const newOutput = outputValue.slice(0, -1);
    output.innerText = newOutput;
  }
};
backspaceDelete?.addEventListener('click', handleClickDelete);
