const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const editIndex = document.getElementById("editIndex");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const contactList = document.getElementById("contactList");
const contactCount = document.getElementById("contactCount");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("search");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function displayContacts() {
  const searchText = searchInput.value.toLowerCase();

  const filtered = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText) ||
    contact.phone.includes(searchText) ||
    contact.email.toLowerCase().includes(searchText)
  );

  contactList.innerHTML = "";
  contactCount.textContent = contacts.length;

  if (filtered.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  filtered.forEach(contact => {
    const index = contacts.indexOf(contact);

    const div = document.createElement("div");
    div.className = "contact";

    div.innerHTML = `
      <div class="contact-info">
        <h3>${escapeHTML(contact.name)}</h3>
        <p>📞 ${escapeHTML(contact.phone)}</p>
        <p>✉️ ${escapeHTML(contact.email || "No email")}</p>
        <p>📍 ${escapeHTML(contact.address || "No address")}</p>
      </div>
      <div class="actions">
        <button class="edit" onclick="editContact(${index})">Edit</button>
        <button class="delete" onclick="deleteContact(${index})">Delete</button>
      </div>
    `;

    contactList.appendChild(div);
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const contact = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim()
  };

  if (editIndex.value === "") {
    contacts.push(contact);
  } else {
    contacts[Number(editIndex.value)] = contact;
  }

  saveContacts();
  displayContacts();
  resetForm();
});

function editContact(index) {
  const contact = contacts[index];

  nameInput.value = contact.name;
  phoneInput.value = contact.phone;
  emailInput.value = contact.email;
  addressInput.value = contact.address;
  editIndex.value = index;

  formTitle.textContent = "Edit Contact";
  submitBtn.textContent = "Update Contact";
  cancelBtn.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteContact(index) {
  if (confirm("Are you sure you want to delete this contact?")) {
    contacts.splice(index, 1);
    saveContacts();
    displayContacts();
  }
}

function resetForm() {
  form.reset();
  editIndex.value = "";
  formTitle.textContent = "Add Contact";
  submitBtn.textContent = "Add Contact";
  cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", displayContacts);

displayContacts();
