import '../style/style.scss';
import { sum, substraction } from './calculatorFunctions';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>sum12 : ${sum(1, 2)}, substraction12 : ${substraction(1, 2)}</h1>
`;
