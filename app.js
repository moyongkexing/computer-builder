// ➀ CONFIG.STEPSをもとにinitialize()でHTMLを生成する
// ➁ セレクトボックスを作成する際にIDを付与し、それをCONFIG.TARGET_IDSに格納する
// ➂ CONFIG.TARGET_IDSをもとに入力された部品名を取得し、「Add PC」ボタンが押されたらSELECTED_PCに格納する

const CONFIG = {
  "url": "https://api.recursionist.io/builder/computers?type=",
  "root": document.getElementById("root"),
  STEPS: [
    {name: "CPU", selectBx:["Brand", "Model"]},
    {name: "GPU", selectBx:["Brand", "Model"]},
    {name: "RAM", selectBx:["Sticks", "Brand", "Model"]},
    {name: "STORAGE", selectBx:["Type" ,"Storage", "Brand", "Model"]},
  ],
  TARGET_IDS: {}, 
  SELECTED_PC: {},
}

function initialize(steps){
  // createHTML()は、第一引数にHTMLタグ、第二引数にinnerHTML、第三引数にclassListを受けとってHTML文字列を返す自作関数
  const header = createHTML("h1", "Build Your Own PC", ["text-center","text-black","bg-blue-300","p-3","w-full","font-bold","text-2xl"]);
  let htmlStr = "";
  for(let i = 0; i < steps.length; i++) {
    const title = createHTML("p", `step${i+1}: Select your ${steps[i].name}`, ["font-bold","text-lg"]);
    const form = createForm(steps[i]);
    const formBox = createHTML("div", title + form, ["flex","flex-col","items-start","bg-blue-200"]);
    htmlStr += formBox;
  }
  const submitBtn = createHTML("button", "Add PC", ["submitBtn","p-2","m-2","bg-blue-500","rounded-sm","font-bold","text-gray-100","focus:outline-none","hover:shadow-outline"]);
  const main = createHTML("div", htmlStr + submitBtn, ["w-full", "bg-blue-200","p-2"]);
  CONFIG.root.innerHTML = header + main;

  function createForm(step){
    let htmlStr = "";
    for(let i = 0; i < step.selectBx.length; i++) {
      const placeholder = createHTML("p", setPlaceholder(step.selectBx[i]), ["ml-4", "mr-2"]);

      const select = document.createElement("select");
      select.classList.add("mt-3","mb-5","px-16")
      const id = `${step.selectBx[i]}Of${step.name}`;
      select.id = id;
      CONFIG.TARGET_IDS[id] = `document.getElementById('${id}')`;

      if(i == 0) setSelectOptions(step.name, step.selectBx[i]);
      htmlStr += placeholder + select.outerHTML;
    }
    return createHTML("div",htmlStr,["flex","justify-center","items-center","test", "font-bold"]);
  };

  function createHTML(tag, innerHTML, classList){
    let styles = "";
    for(let c of classList) styles += c + " ";
    return `<${tag} class="${styles}">${innerHTML}</${tag}>`;
  }

  function setPlaceholder(value) {
    switch(value) {
      case "Sticks": return "How many?";
      case "Type": return "HDD or SSD?";
      default: return value;
    }
  }
};
initialize(CONFIG.STEPS);
// console.log(CONFIG.TARGET_IDS);

function fetchData(key) {
  const url = CONFIG.url + key.toLowerCase();
  fetch(url).then(res=>res.json()).then(data=> data);
}

async function setSelectOptions(key, attribute) {
  fetchData(key).then(data=> console.log(data));
  
}

