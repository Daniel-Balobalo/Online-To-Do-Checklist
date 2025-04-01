document.addEventListener('DOMContentLoaded', () => {
  const checklistsContainer = document.getElementById('checklists-container');
  const addInstanceButton = document.getElementById('add-instance');

  // Load saved checklists from localStorage
  loadChecklists();

  function loadChecklists() {
    const savedChecklists = JSON.parse(localStorage.getItem('checklists')) || [];
    savedChecklists.forEach((savedChecklist) => {
      createChecklistInstance(savedChecklist);
    });
    
    if (savedChecklists.length === 0) {
      createChecklistInstance();
    }
  }

  function saveChecklists() {
    const checklists = [];
    document.querySelectorAll('.checklist-instance').forEach((instance) => {
      const title = instance.querySelector('input[type="text"]').value;
      const date = instance.querySelector('input[type="date"]').value;
      const items = [];
      instance.querySelectorAll('ul li').forEach((item) => {
        items.push({
          text: item.querySelector('.item-text').textContent,
          completed: item.classList.contains('completed')
        });
      });
      checklists.push({ title, date, items });
    });
    localStorage.setItem('checklists', JSON.stringify(checklists));
  }

  function createChecklistInstance(savedChecklist = {}) {
    const checklistInstance = document.createElement('div');
    checklistInstance.classList.add('checklist-instance');

    // Title input
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Enter checklist title';
    titleInput.value = savedChecklist.title || '';
    checklistInstance.appendChild(titleInput);

    // Date input
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = savedChecklist.date || new Date().toISOString().split('T')[0];
    checklistInstance.appendChild(dateInput);

    // List container
    const listContainer = document.createElement('ul');
    checklistInstance.appendChild(listContainer);

    // Saved items
    if (savedChecklist.items) {
      savedChecklist.items.forEach((item) => {
        addListItem(listContainer, item.text, item.completed);
      });
    }

    // New item input
    const itemInputContainer = document.createElement('div');
    itemInputContainer.classList.add('item-input-container');
    
    const newItemInput = document.createElement('input');
    newItemInput.type = 'text';
    newItemInput.placeholder = 'Add new list item';
    itemInputContainer.appendChild(newItemInput);

    const addItemButton = document.createElement('button');
    addItemButton.textContent = 'Add';
    addItemButton.classList.add('add-item');
    addItemButton.disabled = true;
    itemInputContainer.appendChild(addItemButton);

    checklistInstance.appendChild(itemInputContainer);

    // Event listeners for new item
    newItemInput.addEventListener('input', () => {
      addItemButton.disabled = newItemInput.value.trim() === '';
    });

    newItemInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && newItemInput.value.trim() !== '') {
        addListItem(listContainer, newItemInput.value.trim());
        newItemInput.value = '';
        addItemButton.disabled = true;
        saveChecklists();
      }
    });

    addItemButton.addEventListener('click', () => {
      if (newItemInput.value.trim() !== '') {
        addListItem(listContainer, newItemInput.value.trim());
        newItemInput.value = '';
        addItemButton.disabled = true;
        saveChecklists();
      }
    });

    // Actions container
    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('actions-container');

    // Clear completed button
    const clearCompletedButton = document.createElement('button');
    clearCompletedButton.textContent = 'Clear Completed';
    clearCompletedButton.classList.add('delete-instance');
    clearCompletedButton.addEventListener('click', () => {
      listContainer.querySelectorAll('li.completed').forEach(item => {
        item.classList.add('deleting');
        setTimeout(() => item.remove(), 300);
      });
      setTimeout(saveChecklists, 350);
    });
    actionsContainer.appendChild(clearCompletedButton);

    // Delete instance button - FIXED VERSION
    const deleteInstanceButton = document.createElement('button');
    deleteInstanceButton.textContent = 'Delete Checklist';
    deleteInstanceButton.classList.add('delete-instance');
    deleteInstanceButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this checklist?')) {
        checklistInstance.classList.add('deleting');
        setTimeout(() => {
          if (checklistInstance.parentNode) {
            checklistInstance.remove();
            if (checklistsContainer.children.length === 0) {
              createChecklistInstance();
            }
            saveChecklists();
          }
        }, 300);
      }
    });
    actionsContainer.appendChild(deleteInstanceButton);

    checklistInstance.appendChild(actionsContainer);
    checklistsContainer.appendChild(checklistInstance);

    if (!savedChecklist.title) titleInput.focus();
    titleInput.addEventListener('input', saveChecklists);
    dateInput.addEventListener('change', saveChecklists);
  }

  function addListItem(listContainer, text, isCompleted = false) {
    const listItem = document.createElement('li');
    if (isCompleted) listItem.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('item-checkbox');
    checkbox.checked = isCompleted;
    checkbox.addEventListener('change', () => {
      listItem.classList.toggle('completed', checkbox.checked);
      saveChecklists();
    });

    const itemText = document.createElement('span');
    itemText.classList.add('item-text');
    itemText.textContent = text;

    const deleteItemButton = document.createElement('button');
    deleteItemButton.innerHTML = '🗑';
    deleteItemButton.classList.add('delete-list');
    deleteItemButton.title = 'Delete item';
    deleteItemButton.addEventListener('click', () => {
      listItem.classList.add('deleting');
      setTimeout(() => {
        listItem.remove();
        saveChecklists();
      }, 300);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(itemText);
    listItem.appendChild(deleteItemButton);
    listContainer.appendChild(listItem);
  }

  addInstanceButton.addEventListener('click', () => {
    createChecklistInstance();
  });

  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.matches('.checklist-instance input[type="text"]')) {
      e.target.blur();
    }
  });
});