const { linkSync } = require("original-fs");

document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.getElementById('itemInput');
  const addButton = document.getElementById('addButton');
  const itemList = document.getElementById('itemList');

  let items = [];

  function renderItems() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = item.name;
      nameSpan.className = item.eaten ? 'eaten' : 'not-eaten';

      const statusButton = document.createElement("button");
      statusButton.textContent = item.eaten ? "✓ Eaten" : "✗ Not Eaten";
      statusButton.style.background = item.eaten ? "green" : "red";
      statusButton.style.color = "white";
      statusButton.onclick = () => {
          items[index].eaten = !items[index].eaten;
          saveAndRender();
      };

      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.onclick = () => updateItem(index);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteItem(index);

      li.appendChild(nameSpan);
      li.appendChild(statusButton);
      li.appendChild(updateButton);
      li.appendChild(deleteButton);
      itemList.appendChild(li);
    });
  }

  function addItem() {
    const newItem = itemInput.value.trim();
    if (newItem) {
      items.push({name: newItem, eaten: false });
      itemInput.value = '';
      saveAndRender();
    }
    else{
      console.log("Please enter item!!")
    }
  }
  // 👇 Replaces prompt(), works inside Electron
  function updateItem(index) {
    const li = itemList.children[index];
    const currentText = items[index].name;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => {
      const updatedItem = input.value.trim();
      if (updatedItem) {
        items[index].name = updatedItem;
        saveAndRender();
      }
    };

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = renderItems;

    li.innerHTML = '';
    li.appendChild(input);
    li.appendChild(saveButton);
    li.appendChild(cancelButton);
  }

  function deleteItem(index) {
    if (confirm(`Delete "${items[index].name}"?`)){
      items.splice(index, 1);
      saveAndRender();
    }
  }
  function loadItem(){
    const saved = localStorage.getItem('sunnahMeals');
    if(saved){
      items = JSON.parse(saved);
      renderItems();
    }
  }
  function saveAndRender(){
    saveItems();
    renderItems();
  }

  function saveItems(){
    localStorage.setItem('sunnahMeals', JSON.stringify(items));
  }
  if (localStorage.getItem('refreshIndex')=='true'){
    localStorage.removeItem('refreshItem');
    location.reload();
  }

  document.getElementById('resetButton').addEventListener('click', () => {
    if (confirm("Are you sure  you want to clear your meal list ?")) {
      localStorage.removeItem('sunnahMeals');
      location.reload();
    }
  });

  addButton.addEventListener('click', addItem);
  loadItem();
});
