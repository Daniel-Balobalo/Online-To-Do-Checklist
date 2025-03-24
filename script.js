document.addEventListener('DOMContentLoaded', () => {
  const checklistsContainer = document.getElementById('checklists-container');
  const addInstanceButton = document.getElementById('add-instance');

  // Load saved checklists from localStorage
  loadChecklists();

  // Function to load saved checklists
  function loadChecklists() {
    const savedChecklists = JSON.parse(localStorage.getItem('checklists')) || [];
    savedChecklists.forEach((savedChecklist) => {
      createChecklistInstance(savedChecklist);
    });
  }

  // Function to save checklists to localStorage
  function saveChecklists() {
    const checklists = [];
    document.querySelectorAll('.checklist-instance').forEach((instance) => {
      const title = instance.querySelector('input[type="text"]').value;
      const date = instance.querySelector('input[type="date"]').value;
      const items = [];
      instance.querySelectorAll('ul li').forEach((item) => {
        items.push(item.textContent.replace('🗑', '').trim());
      });
      checklists.push({ title, date, items });
    });
    localStorage.setItem('checklists', JSON.stringify(checklists));
  }

  // Function to create a new checklist instance
  function createChecklistInstance(savedChecklist = {}) {
    const checklistInstance = document.createElement('div');
    checklistInstance.classList.add('checklist-instance');

    // Add title input
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Enter checklist title';
    titleInput.value = savedChecklist.title || '';
    checklistInstance.appendChild(titleInput);

    // Add date input (default to today)
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = savedChecklist.date || new Date().toISOString().split('T')[0];
    checklistInstance.appendChild(dateInput);

    // Add list container
    const listContainer = document.createElement('ul');
    checklistInstance.appendChild(listContainer);

    // Add saved list items
    if (savedChecklist.items) {
      savedChecklist.items.forEach((item) => {
        addListItem(listContainer, item);
      });
    }

    // Add input for new list item
    const newItemInput = document.createElement('input');
    newItemInput.type = 'text';
    newItemInput.placeholder = 'Add new list item';
    checklistInstance.appendChild(newItemInput);

    // Add button to add new list item (disabled by default)
    const addItemButton = document.createElement('button');
    addItemButton.textContent = 'Add Item';
    addItemButton.disabled = true; // Disabled initially
    checklistInstance.appendChild(addItemButton);

    // Enable/disable "Add Item" button based on input
    newItemInput.addEventListener('input', () => {
      addItemButton.disabled = newItemInput.value.trim() === '';
    });

    // Press Enter to add item
    newItemInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && newItemInput.value.trim() !== '') {
        addListItem(listContainer, newItemInput.value.trim());
        newItemInput.value = '';
        addItemButton.disabled = true;
        saveChecklists();
      }
    });

    // Click to add item
    addItemButton.addEventListener('click', () => {
      if (newItemInput.value.trim() !== '') {
        addListItem(listContainer, newItemInput.value.trim());
        newItemInput.value = '';
        addItemButton.disabled = true;
        saveChecklists();
      }
    });

    // Add button to delete the entire instance (with confirmation)
    const deleteInstanceButton = document.createElement('button');
    deleteInstanceButton.textContent = 'Delete Checklist';
    deleteInstanceButton.classList.add('delete-instance');
    deleteInstanceButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this checklist?')) {
        checklistInstance.remove();
        saveChecklists();
      }
    });
    checklistInstance.appendChild(deleteInstanceButton);

    // Append the new checklist instance to the container
    checklistsContainer.appendChild(checklistInstance);

    // Auto-focus title input for new checklists
    if (!savedChecklist.title) titleInput.focus();

    // Save checklists on title/date changes
    titleInput.addEventListener('input', saveChecklists);
    dateInput.addEventListener('change', saveChecklists);
  }

  // Helper function to add a list item
  function addListItem(listContainer, text) {
    const listItem = document.createElement('li');
    listItem.textContent = text;

    // Add delete button for the list item
    const deleteItemButton = document.createElement('button');
    deleteItemButton.innerHTML = '&#128465;';
    deleteItemButton.classList.add('delete-list');
    deleteItemButton.addEventListener('click', () => {
      listItem.remove();
      saveChecklists();
    });

    listItem.appendChild(deleteItemButton);
    listContainer.appendChild(listItem);
  }

  // Add new checklist instance
  addInstanceButton.addEventListener('click', () => {
    createChecklistInstance();
  });

  // Press Enter in title/date inputs to blur (improves keyboard UX)
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.matches('.checklist-instance input[type="text"]')) {
      e.target.blur();
    }
  });
});