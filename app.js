const CONFIG = {
  "url": "https://api.recursionist.io/builder/computers?type=",
  "root": document.getElementById("root"),
  STEPS: {
    CPU: ["Brand", "Model"],
    GPU: ["Brand", "Model"],
    RAM: ["How many?", "Brand", "Model"],
    STORAGE: ["HDD or SSD?" ,"Storage", "Brand", "Model"],
  },
  GAMING_INDEX: {
    CPU: .25, 
    GPU: .6, 
    RAM: .125, 
    HDD: .025,
    SSD: .1,
  },
  WORKING_INDEX: {
    CPU: .6,
    GPU: .25,
    RAM: .1,
    HDD: .05,
    SSD: .05,
  },
  SELECTED_PC: {},
  SCORES: {},
  CPU_CACHE: {},
  GPU_CACHE: {},
  RAM_CACHE: {},
  STORAGE_CACHE: {},
}

// class SelectBx {
//   constructor(type, name, id) {
//     this.type = type;
//     this.name = name;
//     this.id = id;
//     this.value = document.getElementById(`${this.name}Of${this.type}`).value;
//     this.options = [];
//   };

//   initializeOption() {
//     const firstOption = `<option value = "" hidden>Choose one</option>`
//     this.options.push(firstOption);
//   }

//   getSelectedValue() {
//     return this.value;
//   }

//   setOptions(valueArr) {
//     valueArr.forEach(value => {
//       this.options.push(`<option value="${value}">${value}</option>`);
//     });
//   }
// }

render(); // render() generate HTML based on CONFIG.STEPS. When generating a select box, give it an id and a change event listener.
setOptionsToFirstSelectBx(); // setOptionsToFirstSelectBx() sets the options in the select box at the beginning of each step. It also creates a CACHE with those options as keys.
// setOptionsToNextSelectBx(STEP, i); // An event function that sets the option in the right next select box after each select box is selected.
// buildComputer(); // An event function that calculates a benchmark score and displays the result when the "Add PC" button is clicked.

// <--------Main Functions-------->
function render(){
  const header = document.createElement("p");
  header.innerHTML = "Build Your Own PC";
  header.classList.add("text-center","text-black","bg-blue-300","p-3","w-full","font-bold","text-2xl");

  const formBx = document.createElement("div");
  formBx.classList.add("flex","flex-col","items-start","bg-blue-200");

  let stepNum = 1;
  for(let STEP of Object.keys(CONFIG.STEPS)) {
    const title = document.createElement("p");
    title.innerHTML = `step${stepNum}: Select your ${STEP}`;
    title.classList.add("font-bold","text-lg");
    stepNum++;

    const form = createForm(STEP, CONFIG.STEPS[STEP]); // return <div> ~~ </div>
    formBx.append(title, form)
  }

  const submitBtn = document.createElement("button");
  submitBtn.innerHTML = "Add PC";
  submitBtn.classList.add("submitBtn","p-2","m-2","bg-blue-500","rounded-sm","font-bold","text-gray-100","focus:outline-none","hover:shadow-outline");
  submitBtn.addEventListener("click", async () => {
    await buildComputer();
    CONFIG.root.append(createResult());
  });


  const main = document.createElement("div");
  main.classList.add("w-full", "bg-blue-200","p-2", "mb-2");
  main.append(formBx, submitBtn);
  CONFIG.root.append(header, main);


  function createForm(STEP, selectBxs){
    const form = document.createElement("div");
    form.classList.add("flex","justify-center","items-center","test", "font-bold");

    for(let i = 0; i < selectBxs.length; i++) {
      const placeholder = document.createElement("p");
      placeholder.innerHTML = selectBxs[i];
      placeholder.classList.add("ml-4", "mr-2","mb-3");

      const select = document.createElement("select");
      select.id = `${selectBxs[i]}Of${STEP}`
      select.classList.add("mt-3","mb-5","px-4");
      select.addEventListener("change", () => setOptionsToNextSelectBx(STEP, i));

      form.append(placeholder, select);
    }
    return form;
  };

  function createResult() {
    const result = document.createElement("div");
    result.classList.add("w-full", "flex", "justify-around", "bg-blue-300","p-5", "my-2");

    const container1 = document.createElement("div");
    container1.classList.add("flex", "flex-col", "justify-center");
    
    for(let name of Object.keys(CONFIG.SELECTED_PC)) {
      const titleTxt = document.createElement("p");
      titleTxt.classList.add("font-bold");
      titleTxt.innerHTML = `${name}: ${CONFIG.SELECTED_PC[name].name}`;

      const scoreTxt = document.createElement("p");
      scoreTxt.classList.add("mb-2")
      scoreTxt.innerHTML = `Benchmark: ${CONFIG.SELECTED_PC[name].score}`;

      container1.append(titleTxt, scoreTxt);
    }
    
    const container2 = document.createElement("div");
    container2.classList.add("flex", "flex-col", "justify-center");

    for(let score of Object.keys(CONFIG.SCORES)) {
      const scoreTxt = document.createElement("p");
      scoreTxt.innerHTML = `${score}: ${CONFIG.SCORES[score]}%`;
      scoreTxt.classList.add("text-xl", "font-bold");
      container2.append(scoreTxt);
    }

    const img = document.createElement("img");
    img.classList.add("w-1/5", "m-4");
    img.src = "assets/pc.png";
    result.append(img, container1, container2);
    return result;
  }
};

async function setOptionsToFirstSelectBx() {
  for(let STEP of Object.keys(CONFIG.STEPS)) {
    let valueArr;
    switch(STEP) {
      case "CPU": {
        let datas = await fetchData(STEP);
        valueArr = Object.keys(createAttrList(datas, "Brand")); // valueArr = ["Intel", "AMD"]
        CONFIG["CPU_CACHE"] = createCache(valueArr, datas, "Brand");break; // CPU_CACHE = { Intel: [{ },{ },{ }], AMD: [{ },{ },{ }]}
      };
      case "GPU": {
        let datas = await fetchData(STEP);
        valueArr = Object.keys(createAttrList(datas, "Brand"));
        CONFIG["GPU_CACHE"] = createCache(valueArr, datas, "Brand");break;
      } 
      case "RAM": {
        let datas = await fetchData(STEP);
        valueArr = Object.keys(createStickNumList(datas, "Model")); // valueArr = [1,2,4,8]
        CONFIG["RAM_CACHE"] = createStickNumCache(valueArr, datas, "Model");break; // RAM_CACHE = { 1: [{ },{ },{ },], 2: [{ },{ },{ },]...}
      }
      case "STORAGE": {
        valueArr = ["HDD", "SSD"];
        for(let value of valueArr) {
          CONFIG["STORAGE_CACHE"][value] = await fetchData(value); // STORAGE_CACHE = { HDD: [{ },{ },{ }], SSD: [{ },{ },{ }]}
        }
        break;
      }
      default: break;
    }
    const target = `${CONFIG.STEPS[STEP][0]}Of${STEP}`; // (example) target = "HDD or SSD?OfSTORAGE"
    setOptions(target, valueArr);
  }
};

async function setOptionsToNextSelectBx(STEP, i) {
  if(i >= CONFIG.STEPS[STEP].length - 1) return;
  const inputValues = getInputValueFromSelectBxs(STEP, i); // (when STEP = "STORAGE") inputValues = ["HDD", "5TB", "Toshiba"]
  const nextSelectBx = CONFIG.STEPS[STEP][i+1]; // (when STEP = "RAM", i = 1) nextSelectBx = "Model"
  const datas = CONFIG[`${STEP}_CACHE`][inputValues[0]]; // (when STEP = "STORAGE") datas = CONFIG.STORAGE_CACHE["HDD"]

  let valueArr = Object.keys(createAttrList(datas, nextSelectBx));
  switch(STEP) {
    case "RAM": {
      switch(nextSelectBx) {
        case "Model": {
          const filteredData = datas.filter(data => data.Brand === inputValues[1]);
          valueArr = Object.keys(createAttrList(filteredData, "Model"));break;
          // (example) valueArr = ["Ballistix Elite DDR4 3600 C16 4x8GB", "Ballistix Sport DDR4 2400 C16 4x4GB", "Ballistix Sport LT DDR4 2400 C16 4x8GB"]
        }
        default: break;
      }
    }break;
    case "STORAGE": {
      switch(nextSelectBx) {
        case "Storage": {
          valueArr = Object.keys(createStorageVolumeList(datas, "Model"));break; // (example) valueArr = ["12TB", "10TB", "8TB", "6TB"...]
        }
        case "Brand": {
          let filteredData = datas.filter(data => getStorageVolume(data.Model) === inputValues[1]); // (example) filteredData = datas.filter(data => "5TB" === "5TB")
          valueArr = Object.keys(createAttrList(filteredData, "Brand"));break;
        }
        case "Model": {
          let filteredData = datas
          .filter(data => getStorageVolume(data.Model) === inputValues[1])
          .filter(data => data.Brand === inputValues[2]);
          valueArr = Object.keys(createAttrList(filteredData, "Model"));break;
        }
        default: break;
      }
    }
  }
  const target = `${nextSelectBx}Of${STEP}`;
  setOptions(target, valueArr);
};

async function buildComputer() {
  CONFIG.SELECTED_PC = {};
  CONFIG.SCORES = {};
  for(let STEP of Object.keys(CONFIG.STEPS)) {
    let component = {}; // component is meant to be { name: ***, score: ***}
    let value = getInputValueFromLastSelectBx(STEP);　// (example) value = "Trident Z DDR4 3200 C14 4x16GB" 
    if(value === "") return alert("Select Model!");
    component["name"] = value;

    let datas;
    if(STEP === "STORAGE") {
      let storageType = document.getElementById("HDD or SSD?OfSTORAGE").value;
      datas = await fetchData(storageType);
      component["score"] = getBenchmarkScore(datas,value);
      CONFIG.SELECTED_PC[storageType] = component;
    }
    else {
      datas = await fetchData(STEP);
      component["score"] = getBenchmarkScore(datas,value);
      CONFIG.SELECTED_PC[STEP] = component;
    }
  }

  const gamingScore = calculateGamingScore();
  const workingScore = calculateWorkingScore();
  CONFIG.SCORES["Gaming Score"] = gamingScore;
  CONFIG.SCORES["Working Score"] = workingScore;
};
// <--------Main Functions-------->

function fetchData(key) {
  const url = CONFIG.url + key.toLowerCase()
  return fetch(url).then(res=>res.json()).then(datas=>datas);
}

function setOptions(id, optionArr) {
  let htmlStr = "<option value='' hidden >Choose one</option>";
  for(let value of optionArr) {
    htmlStr += `<option value="${value}">${value}</option>`;
    document.getElementById(id).innerHTML = htmlStr; 
  }
}

function createAttrList(datas, attr) {
  let res = {};
  for(let data of datas) {
    if(res[data[attr]] === undefined) res[data[attr]] = data[attr];
  }
  return res;
}

function createStickNumList(datas, attr) {
  let res = {};
  for(let data of datas) {
    const value = getStickNum(data[attr]);
    if(res[value] === undefined) res[value] = value;
  }
  return res;
}

function createStorageVolumeList(datas, attr) {
  let res = {};
  for(let data of datas) {
    let value = getStorageVolume(data[attr]);
    if(res[value] === undefined) res[value] = value;
  }
  return res;
}

function createCache(values, datas, attr) {
  let res = {};
  for(let value of values) {
    res[value] = datas.filter(data => data[attr] === value);
  }
  return res;
}

function createStickNumCache(values, datas, attr) {
  let res = {};
  for(let key of values) {
    res[key] = datas.filter(data => getStickNum(data[attr]) === key);
  }
  return res;
}

function createStorageTypeCache(value, datas) {
  let res = {};
  res[value] = datas;
  return res;
}

function getStickNum(value) {
  const indexOfX = value.lastIndexOf("x");
  return value.slice(indexOfX - 1, indexOfX);
}

function getStorageVolume(value) {
  let IndexOfType = value.indexOf("TB") !== -1
  ? value.indexOf("TB")
  : value.indexOf("GB")
  const indexOfLastBlank = value.slice(0, IndexOfType).lastIndexOf(" ");
  return value.slice(indexOfLastBlank + 1, IndexOfType + 2);
}

function getInputValueFromSelectBxs(STEP, i) {
  let res = [];
  for(let j = 0; j <= i; j++) {
    let value = document.getElementById(`${CONFIG.STEPS[STEP][j]}Of${STEP}`).value;
    res.push(value);
  }
  return res;
}

function getInputValueFromLastSelectBx(STEP) {
  const currStep = CONFIG.STEPS[STEP];
  const lastSelectBx = currStep[currStep.length - 1];
  const res = document.getElementById(`${lastSelectBx}Of${STEP}`).value;
  return res;
}

function getBenchmarkScore(datas, value) {
  return datas.filter(data => data["Model"] === value)[0]["Benchmark"];
}

function calculateGamingScore() {
  let gamingScore = 0;
  for(let STEP of Object.keys(CONFIG.SELECTED_PC)) {
    gamingScore += CONFIG.SELECTED_PC[STEP].score * CONFIG.GAMING_INDEX[STEP];
  }
  return Math.floor(gamingScore);
}

function calculateWorkingScore() {
  let workingScore = 0;
  for(let STEP of Object.keys(CONFIG.SELECTED_PC)) {
    workingScore += CONFIG.SELECTED_PC[STEP].score * CONFIG.WORKING_INDEX[STEP];
  }
  return Math.floor(workingScore);
}