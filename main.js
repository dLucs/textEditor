let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");
let saveButton = document.getElementById("saveButton");

let fontList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "Cursive",
];

const intializer = () => {
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  fontSizeRef.value = 3;
};

const modifyText = (command, defaultUi, value) => {
  document.execCommand(command, defaultUi, value);
};

optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

linkButton.addEventListener("click", () => {
  let userLink = prompt("Enter a URL?");
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
  } else {
    userLink = "http://" + userLink;
    modifyText(linkButton.id, false, userLink);
  }
});

const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      if (needsRemoval) {
        let alreadyActive = false;
        if (button.classList.contains("active")) {
          alreadyActive = true;
        }
        highlighterRemover(className);
        if (!alreadyActive) {
          button.classList.add("active");
        }
      } else {
        button.classList.toggle("active");
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

saveButton.addEventListener("click", async () => {
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: "formatted_text.txt",
      types: [
        {
          description: "Text Files",
          accept: {
            "text/plain": [".txt"],
          },
        },
      ],
    });

    const textContent = convertHtmlToPlainText(writingArea);

    const writableStream = await fileHandle.createWritable();
    await writableStream.write(textContent);
    await writableStream.close();

    console.log("Text successfully saved.");
  } catch (error) {
    console.error("Error saving text:", error);
  }
});

function convertHtmlToPlainText(element) {
  const result = [];

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      result.push(node.textContent.replace(/\n/g, "\r\n")); // Preserve line breaks
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === "BR") {
        result.push("\r\n"); // Preserve line breaks
      } else {
        for (const childNode of node.childNodes) {
          processNode(childNode);
        }
      }
    }
  }

  processNode(element);
  return result.join("");
}

window.onload = intializer();
