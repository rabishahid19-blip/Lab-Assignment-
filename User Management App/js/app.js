const apiBase = 'https://dummyjson.com/users';
const usersTableBody = document.querySelector('#usersTable tbody');
const userForm = document.getElementById('userForm');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('search');

let users = [];

// FETCH USERS
async function fetchUsers() {
  try {
    loading.style.display = 'block';
    const res = await fetch(apiBase);
    const data = await res.json();
    users = data.users;
    renderUsers(users);
  } catch (err) {
    alert('Error fetching users');
    console.error(err);
  } finally {
    loading.style.display = 'none';
  }
}

// RENDER USERS
function renderUsers(usersArr) {
  usersTableBody.innerHTML = '';
  usersArr.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>
        <button class="edit-btn" data-id="${user.id}">Edit</button>
        <button class="delete-btn" data-id="${user.id}">Delete</button>
      </td>
    `;
    usersTableBody.appendChild(tr);
  });
}

// ADD USER
userForm.addEventListener('submit', async e => {
  e.preventDefault();
  const newUser = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value
  };

  try {
    const res = await fetch(`${apiBase}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const addedUser = await res.json();
    users.push(addedUser);
    renderUsers(users);
    userForm.reset();
    alert('User added successfully!');
  } catch (err) {
    alert('Error adding user');
    console.error(err);
  }
});

// EDIT & DELETE
usersTableBody.addEventListener('click', async e => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('delete-btn')) {
    if (confirm('Are you sure?')) {
      try {
        await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
        users = users.filter(u => u.id != id);
        renderUsers(users);
        alert('User deleted!');
      } catch (err) {
        alert('Error deleting user');
      }
    }
  } else if (e.target.classList.contains('edit-btn')) {
    const user = users.find(u => u.id == id);
    const firstName = prompt('First Name:', user.firstName) || user.firstName;
    const lastName = prompt('Last Name:', user.lastName) || user.lastName;
    const email = prompt('Email:', user.email) || user.email;
    const phone = prompt('Phone:', user.phone) || user.phone;

    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone })
      });
      const updatedUser = await res.json();
      users = users.map(u => u.id == id ? updatedUser : u);
      renderUsers(users);
      alert('User updated!');
    } catch (err) {
      alert('Error updating user');
    }
  }
});

// SEARCH
searchInput.addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  const filtered = users.filter(u =>
    u.firstName.toLowerCase().includes(term) ||
    u.lastName.toLowerCase().includes(term) ||
    u.email.toLowerCase().includes(term)
  );
  renderUsers(filtered);
});

// INIT
fetchUsers();