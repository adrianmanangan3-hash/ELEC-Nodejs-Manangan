const fs = require("node:fs");
const path = require("node:path");

const filesDirectory = path.join(__dirname, "files");

function getFilePath(fileName) {
  if (!fileName || path.basename(fileName) !== fileName || fileName === "." || fileName === "..") {
    throw new Error("Provide a file name without a directory path.");
  }

  return path.join(filesDirectory, fileName);
}

function printUsage() {
  console.log(
    'Usage: node index.js create <file> "<content>" | read <file> | update <file> "<text>" | delete <file> | list',
  );
}

const [command, fileName, ...textParts] = process.argv.slice(2);
const text = textParts.join(" ");

try {
  fs.mkdirSync(filesDirectory, { recursive: true });

  switch (command) {
    case "create": {
      if (!fileName || textParts.length === 0) {
        printUsage();
        process.exitCode = 1;
        break;
      }

      const filePath = getFilePath(fileName);
      fs.writeFileSync(filePath, text, { flag: "wx" });
      console.log(`Created ${filePath}`);
      break;
    }
    case "read": {
      if (!fileName) {
        printUsage();
        process.exitCode = 1;
        break;
      }

      const filePath = getFilePath(fileName);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${fileName}`);
        process.exitCode = 1;
        break;
      }

      console.log(fs.readFileSync(filePath, "utf8"));
      break;
    }
    case "update": {
      if (!fileName || textParts.length === 0) {
        printUsage();
        process.exitCode = 1;
        break;
      }

      const filePath = getFilePath(fileName);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${fileName}`);
        process.exitCode = 1;
        break;
      }

      fs.appendFileSync(filePath, text);
      console.log(`Updated ${filePath}`);
      break;
    }
    case "delete": {
      if (!fileName) {
        printUsage();
        process.exitCode = 1;
        break;
      }

      const filePath = getFilePath(fileName);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${fileName}`);
        process.exitCode = 1;
        break;
      }

      fs.unlinkSync(filePath);
      console.log(`Deleted ${filePath}`);
      break;
    }
    case "list": {
      const fileNames = fs
        .readdirSync(filesDirectory)
        .filter((name) => fs.statSync(path.join(filesDirectory, name)).isFile());

      if (fileNames.length === 0) {
        console.log("The files folder is empty.");
        break;
      }

      for (const name of fileNames) {
        const filePath = path.join(filesDirectory, name);
        console.log(
          `Path: ${filePath}\nName: ${path.basename(filePath)}\nExtension: ${path.extname(filePath)}\nContents:\n${fs.readFileSync(filePath, "utf8")}\n`,
        );
      }
      break;
    }
    default:
      printUsage();
      process.exitCode = 1;
  }
} catch (error) {
  if (error.code === "EEXIST") {
    console.error(`File already exists: ${fileName}`);
  } else if (error.code === "ENOENT") {
    console.error(`File not found: ${fileName}`);
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
}
