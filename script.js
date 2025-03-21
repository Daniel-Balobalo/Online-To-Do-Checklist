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
          items.push(item.textContent.replace('Delete', '').trim());
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
  
      // Add date input
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.value = savedChecklist.date || '';
      checklistInstance.appendChild(dateInput);
  
      // Add list container
      const listContainer = document.createElement('ul');
      checklistInstance.appendChild(listContainer);
  
      // Add saved list items
      if (savedChecklist.items) {
        savedChecklist.items.forEach((item) => {
          const listItem = document.createElement('li');
          listItem.textContent = item;
  
          // Add delete button for the list item
          const deleteItemButton = document.createElement('button');
          deleteItemButton.textContent = 'Delete';
          deleteItemButton.classList.add('delete-list');
          deleteItemButton.addEventListener('click', () => {
            listItem.remove();
            saveChecklists(); // Save after deletion
          });
  
          listItem.appendChild(deleteItemButton);
          listContainer.appendChild(listItem);
        });
      }
  
      // Add input for new list item
      const newItemInput = document.createElement('input');
      newItemInput.type = 'text';
      newItemInput.placeholder = 'Add new list item';
      checklistInstance.appendChild(newItemInput);
  
      // Add button to add new list item
      const addItemButton = document.createElement('button');
      addItemButton.textContent = 'Add Item';
      addItemButton.addEventListener('click', () => {
        if (newItemInput.value.trim() !== '') {
          const listItem = document.createElement('li');
          listItem.textContent = newItemInput.value.trim();
  
          // Add delete button for the list item
          const deleteItemButton = document.createElement('button');
          deleteItemButton.textContent = 'Delete';
          deleteItemButton.classList.add('delete-list');
          deleteItemButton.addEventListener('click', () => {
            listItem.remove();
            saveChecklists(); // Save after deletion
          });
  
          listItem.appendChild(deleteItemButton);
          listContainer.appendChild(listItem);
          newItemInput.value = ''; // Clear input
          saveChecklists(); // Save after adding
        }
      });
      checklistInstance.appendChild(addItemButton);
  
      // Add button to delete the entire instance
      const deleteInstanceButton = document.createElement('button');
      deleteInstanceButton.textContent = 'Delete Checklist';
      deleteInstanceButton.classList.add('delete-instance');
      deleteInstanceButton.addEventListener('click', () => {
        checklistInstance.remove();
        saveChecklists(); // Save after deletion
      });
      checklistInstance.appendChild(deleteInstanceButton);
  
      // Append the new checklist instance to the container
      checklistsContainer.appendChild(checklistInstance);
  
      // Save checklists whenever the title or date changes
      titleInput.addEventListener('input', saveChecklists);
      dateInput.addEventListener('change', saveChecklists);
    }
  
    // Add new checklist instance
    addInstanceButton.addEventListener('click', () => {
      createChecklistInstance();
    });
  });