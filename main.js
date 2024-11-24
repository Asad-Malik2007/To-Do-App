const inputArea = document.querySelector("#input-area");
const addBtn = document.querySelector("#add-btn");
const list = document.querySelector("#list");
const msg = document.querySelector("#msg");

function saveToLocalStorage() {
  const listItems = Array.from(list.children).map((item) => ({
    text: item.querySelector("label").textContent,
    checked: item.querySelector("input[type='checkbox']").checked,
  }));
  localStorage.setItem("todoList", JSON.stringify(listItems));
}

function loadFromLocalStorage() {
  const storedList = JSON.parse(localStorage.getItem("todoList")) || [];
  storedList.forEach(({ text, checked }) => {
    addItemToList(text, checked);
  });
}

function addItemToList(inputValue, isChecked = false) {
  const uniqueId = `checkbox-${Date.now()}`;
  const addedItem = `
    <li>
      <input class='checkbox' type='checkbox' id='${uniqueId}' ${isChecked ? "checked" : ""}>
      <label for='${uniqueId}'>${inputValue}</label>
      <button type='button' class='delete'>Delete</button>
    </li>`;
  list.insertAdjacentHTML("beforeend", addedItem);

  const newCheckbox = document.getElementById(uniqueId);
  newCheckbox.addEventListener("change", () => {
    const parentLi = newCheckbox.parentElement;
    if (newCheckbox.checked) {
      parentLi.style.textDecoration = "line-through";
      parentLi.style.color = "#9B9B9B";
    } else {
      parentLi.style.textDecoration = "none";
      parentLi.style.color = "#000000";
    }
    saveToLocalStorage();
  });

  if (isChecked) {
    const parentLi = newCheckbox.parentElement;
    parentLi.style.textDecoration = "line-through";
    parentLi.style.color = "#9B9B9B";
  }

  saveToLocalStorage();
}

function addToList(event) {
  event.preventDefault();

  const inputValue = inputArea.value.trim();
  if (inputValue === "" || /[.,#@$_&!?]/.test(inputValue)) {
    msg.textContent = "Invalid Input";
    setTimeout(() => {
      msg.textContent = "";
    }, 1000);
    return;
  }
  else if(inputValue.length<4){
    msg.textContent = "Too Short Input";
    setTimeout(() => {
      msg.textContent = "";
    }, 1000);
    return;
  }
  if (inputArea.validity.valid) {
    addItemToList(inputValue);
  }

  inputArea.value = "";
}

list.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    const listItem = event.target.parentElement;
    list.removeChild(listItem);
    saveToLocalStorage();
  }
});

document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

addBtn.addEventListener("click", addToList);