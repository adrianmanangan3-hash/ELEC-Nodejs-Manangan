const symbols = {
  add: "+",
  subtract: "-",
  multiply: "*",
  divide: "/",
  average: "avg",
};

function formatResult(operation, numbers, result) {
  if (operation === "average") {
    return `average(${numbers.join(", ")}) = ${result}`;
  }

  return `${numbers[0]} ${symbols[operation]} ${numbers[1]} = ${result}`;
}

module.exports = formatResult;
