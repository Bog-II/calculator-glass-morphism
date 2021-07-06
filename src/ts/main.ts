const equal = document.querySelector('#equal');
const output = <HTMLElement>document.querySelector('#output');
const backspaceDelete = document.querySelector('#backspace-span');
const reset = document.querySelector('#reset-output');

// CONSTANTS
const MAXIMAL_LENGTH_OUTPUT = 13;
const operatorsAndOpenParenthese = new Set(['(', '%', '+', '-', '×', '÷']);
const operators = new Set(['%', '+', '-', '×', '÷']);
const notStartingSymbols = new Set(['%', '+', '-', '×', '÷', ')', '.']);

// BOOLEANS
let openedParenthesis = 0;
let isDecimal = false;

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

  const valid =
    !operatorsAndOpenParenthese.has(lastChar) && openedParenthesis === 0;

  console.log(`valid : ${valid}`);

  if (valid) {
    if (lenOutputValue > 1) {
      const parsedValue = outputValue
        .replaceAll('×', '*')
        .replaceAll('÷', '/')
        .replaceAll(')(', ')*(')
        .replaceAll('()', '1');

      const evalValue: number = eval(parsedValue);
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
  const outputLength = currOutput.length;

  if (outputLength < MAXIMAL_LENGTH_OUTPUT) {
    const target = <HTMLElement>e.target;
    const value = target.innerText;
    let lastChar: string;

    let valid = true;

    if (outputLength === 0) {
      valid = !notStartingSymbols.has(value);
      if (value === '(') {
        openedParenthesis++;
      }
    } else {
      lastChar = currOutput[outputLength - 1];
      switch (value) {
        case '.':
          valid = !isDecimal && outputLength != 0;
          if (valid) {
            isDecimal = true;
          }
          break;
        case '(':
          valid = operatorsAndOpenParenthese.has(lastChar) || lastChar === ')';
          if (valid) {
            openedParenthesis++;
          }
          break;
        case ')':
          valid = openedParenthesis > 0;
          if (valid) {
            openedParenthesis--;
          }
          break;
        default:
          if (operators.has(value)) {
            valid = !operators.has(lastChar) && lastChar != '(';
          }
          break;
      }

      // if (value === '.') {
      //   valid = !isDecimal && outputLength != 0;
      //   if (valid) {
      //     isDecimal = true;
      //   }
      // } else {
      //   if (value === '(') {
      //     valid = operatorsAndOpenParenthese.has(lastChar) || lastChar === ')';
      //     if (valid) {
      //       openedParenthesis++;
      //     }
      //   } else {
      //     const currValueIsCloseParenthesis = value === ')';
      //     if (operators.has(value) || currValueIsCloseParenthesis) {
      //       valid = !operators.has(lastChar);
      //       if (valid) {
      //         if (currValueIsCloseParenthesis) {
      //           valid = openedParenthesis > 0;
      //           if (valid) {
      //             openedParenthesis--;
      //           }
      //         } else {
      //           valid = lastChar != '(';
      //         }
      //       }
      //     }
      //   }
      // }
    }

    if (valid) {
      output.innerText += value;
    }
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

  const removeChar = outputValue[outputValueLength - 1];

  if (outputValueLength > 0) {
    if (removeChar === ')') {
      openedParenthesis++;
    }
    if (removeChar === '(') {
      openedParenthesis--;
    }
    if (removeChar === '.') {
      isDecimal = false;
    }
    const newOutput = outputValue.slice(0, -1);
    output.innerText = newOutput;
  }
};
backspaceDelete?.addEventListener('click', handleClickDelete);

const handleClickReset = () => {
  output.innerText = '';
};
reset?.addEventListener('click', handleClickReset);
