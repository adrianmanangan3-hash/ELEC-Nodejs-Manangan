const os = require("node:os");
const operations = require("./operations");
const formatResult = require("./formatter");

const [operation, ...rawNumbers] = process.argv.slice(2);
const supportedOperations = ["add", "subtract", "multiply", "divide", "average"];

if (!supportedOperations.includes(operation)) {
  console.error(
    `Unknown operation: ${operation || "(missing)"}. Use add, subtract, multiply, divide, or average.`,
  );
  process.exitCode = 1;
} else {
  const numbers = rawNumbers.map(Number);
  const correctCount =
    operation === "average" ? numbers.length >= 1 : numbers.length === 2;

  if (!correctCount || numbers.some((number, index) => rawNumbers[index].trim() === "" || !Number.isFinite(number))) {
    console.error(
      operation === "average"
        ? "Provide one or more valid numbers."
        : "Provide exactly two valid numbers.",
    );
    process.exitCode = 1;
  } else {
    try {
      const result = operations[operation](...numbers);
      console.log(formatResult(operation, numbers, result));
      console.log(`Running on ${os.platform()}.`);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
