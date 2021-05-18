const CONFIG = {
  "apiURL": "https://api.recursionist.io/builder/computers?type=",
  "root": document.getElementById("root"),
  STEPS: [
    {name: "CPU", options:["Brand", "Model"]},
    {name: "GPU", options:["Brand", "Model"]},
    {name: "Memory Card", options:["How Many?", "Brand", "Model"]},
    {name: "Storage", options:["HDD or SSD" ,"Storage", "Brand", "Model"]},
  ],
}

function initialize(steps){
  // 「Build Your Own PC」のHTML文字列が返る。
  // createHTML()はHTMLタグ, innerHTML, [classList]を受け取り、スタイル付きDOMのHTMLを文字列で返す自作関数。
  const header = createHTML("h1", "Build Your Own PC", ["text-center","text-black","bg-blue-300","p-3","w-full","font-bold","text-2xl"]);
  // step（質問）ごとにHTMLを生成する。htmlStrに文字列として足し合わせることで連結する。
  let htmlStr = "";
  for(let i = 0; i < steps.length; i++) {
    // 「step1: Select your CPU」のHTML文字列が返る。
    const title = createHTML("p", `step${i+1}: Select your ${steps[i].name}`, ["font-bold","text-lg",]);

    const form = generateForm(steps[i]);
    // titleとformを囲うdivのHTML文字列が返る。
    const formBox = createHTML("div", title + form, ["flex","flex-col","items-start","bg-blue-200"]);
    htmlStr += formBox;
  }
  // 「Add PC」ボタンのHTML文字列が返る。
  const submitBtn = createHTML("button", "Add PC", ["submitBtn","p-2","m-2","bg-blue-500","rounded-sm","font-bold","text-gray-100","focus:outline-none","hover:shadow-outline"]);
  const main = createHTML("div", htmlStr + submitBtn, ["w-full", "bg-blue-200","p-2"]);
  CONFIG.root.innerHTML = header + main;
};

function createHTML(tag, innerHTML, classList){
  let styles = "";
  for(let c of classList) styles += c + " ";
  return `<${tag} class="${styles}">${innerHTML}</${tag}>`;
}

function generateForm(step){
  let htmlStr = "";
  for(let i = 0; i < step.options.length; i++) {
    const name = createHTML("p", step.options[i], ["ml-4", "mr-2"]);
    const select = document.createElement("select");
    select.classList.add("mt-3","mb-5","px-16")
    select.id = `${step.name}-${step.options[i]}-select`;
    htmlStr += name + select.outerHTML;
  }
  return createHTML("div",htmlStr,["flex","justify-center","items-center","test", "font-bold"]);
};

function fetchData(key, attribute) {
  const fetchURL = CONFIG.apiURL + key.toLowerCase();
  return fetch(fetchURL).then(res=>res.json())
    .then(data => {
      let hashmap = {};
      for(let d of data) if(hashmap[d[attribute]] === undefined) hashmap[d[attribute]] = d[attribute];
      return Object.keys(hashmap);
    });
}

function setOptions(selectBxId, values) {
  console.log("id" + selectBxId);
  console.log("values" + values);
  let htmlStr = "";
  values.forEach(value => htmlStr += createHTML("option", value, [""]));
  const target = document.querySelector(selectBxId);
  console.log(target);
  target.innerHTML = htmlStr;
}

function generateOptions(values) {
  let htmlStr = "";
  values.forEach(value => htmlStr += createHTML("option", value, [""]));
  return htmlStr;
}


initialize(CONFIG.STEPS);

console.log(document.getElementById("CPU-Brand-select"));
