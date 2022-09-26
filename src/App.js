import "./App.css";
import ButtonDigit from "./ButtonDigit";
import ButtonOperation from "./ButtonOperation";
import { useReducer } from "react";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  // eslint-disable-next-line
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand == null) {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          overwrite: true,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(current) || isNaN(prev)) {
    return "";
  }
  let calculation = "";
  // eslint-disable-next-line
  switch (operation) {
    case "+":
      calculation = prev + current;
      break;
    case "-":
      calculation = prev - current;
      break;
    case "*":
      calculation = prev * current;
      break;
    case "÷":
      calculation = prev / current;
      break;
  }
  return calculation.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator">
      <div className="output">
        <div className="previous">
          {previousOperand} {operation}
        </div>
        <div className="current">{currentOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <ButtonOperation operation={"÷"} dispatch={dispatch} />
      <ButtonDigit digit={"7"} dispatch={dispatch} />
      <ButtonDigit digit={"8"} dispatch={dispatch} />
      <ButtonDigit digit={"9"} dispatch={dispatch} />
      <ButtonOperation operation={"*"} dispatch={dispatch} />
      <ButtonDigit digit={"4"} dispatch={dispatch} />
      <ButtonDigit digit={"5"} dispatch={dispatch} />
      <ButtonDigit digit={"6"} dispatch={dispatch} />
      <ButtonOperation operation={"-"} dispatch={dispatch} />
      <ButtonDigit digit={"1"} dispatch={dispatch} />
      <ButtonDigit digit={"2"} dispatch={dispatch} />
      <ButtonDigit digit={"3"} dispatch={dispatch} />
      <ButtonOperation operation={"+"} dispatch={dispatch} />

      <ButtonDigit className={"span-two brl"} digit={"0"} dispatch={dispatch} />
      <ButtonDigit digit={"."} dispatch={dispatch} />
      <button
        className="brr"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
