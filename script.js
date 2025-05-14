const events = [
  {
    title: "Live Music Concert Darshan Raval",
    date: "2025-06-10",
    location: "New York",
    category: "Music",
  },
  {
    title: "Tech Seminar",
    date: "2025-06-15",
    location: "San Francisco",
    category: "Education",
  },
  {
    title: "Jazz Night",
    date: "2025-07-01",
    location: "Chicago",
    category: "Music",
  },
];

let currentUser = null;

function renderAuthButtons() {
  const authArea = document.getElementById("authArea");
  authArea.innerHTML = "";

  if (currentUser) {
    authArea.innerHTML = `
      <li class="nav-item me-2 mt-1 text-white">👤 ${currentUser.username}</li>
      <li class="nav-item">
        <button class="btn btn-warning btn-sm" onclick="logout()">Sign Out</button>
      </li>
    `;
  } else {
    authArea.innerHTML = `
      <li class="nav-item">
        <button class="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#loginModal">Sign In</button>
      </li>
      <li class="nav-item ms-2">
        <button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#registerModal">New Registration</button>
      </li>
    `;
  }
}

function logout() {
  currentUser = null;
  renderAuthButtons();
  renderEvents();
}

function setReminder(eventTitle, eventDate) {
  const eventTime = new Date(eventDate);
  const reminderTime = new Date(eventTime - 10 * 60 * 1000);
  const timeDiff = reminderTime - new Date();

  if (timeDiff > 0) {
    setTimeout(() => {
      alert(`Reminder: ${eventTitle} is starting soon at ${eventDate}`);
    }, timeDiff);
    alert(`Reminder set for ${eventTitle} at ${eventDate}`);
  } else {
    alert("The event time has already passed.");
  }
}

function checkIn(eventTitle) {
  alert(`You have successfully checked in for: ${eventTitle}`);
}

function renderEvents(filter = "All") {
  const list = document.getElementById("event-list");
  list.innerHTML = "";

  const filtered = events.filter((e) =>
    filter === "All" ? true : e.category === filter
  );

  if (filtered.length === 0) {
    list.innerHTML = `<p>No events found for this category.</p>`;
    return;
  }

  filtered.forEach((event) => {
    list.innerHTML += `
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${event.title}</h5>
            <p class="card-text">Date: ${event.date}</p>
            <p class="card-text">Location: ${event.location}</p>
            <p class="card-text">Category: ${event.category}</p>
            <button class="btn btn-primary" onclick="setReminder('${event.title}', '${event.date}')">Set Reminder</button>
            <div id="qrCode${event.title}" class="mt-3"></div>
            <button class="btn btn-success mt-2" onclick="checkIn('${event.title}')">Check In</button>
            ${
              currentUser
                ? `<a href="#" class="btn btn-primary">${currentUser.role === "Admin" ? "Manage" : "Book Now"}</a>`
                : ""
            }
          </div>
        </div>
      </div>
    `;

    const qrCodeElement = document.getElementById(`qrCode${event.title}`);
    QRCode.toCanvas(
      qrCodeElement,
      `${event.title} | ${event.date} | ${event.location}`,
      function (error) {
        if (error) console.error(error);
      }
    );
  });
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const role = document.getElementById("role").value;

  currentUser = { username, role };

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("loginModal")
  );
  modal.hide();

  renderAuthButtons();
  renderEvents();
});

document
  .getElementById("categoryFilter")
  .addEventListener("change", (e) => renderEvents(e.target.value));

document.addEventListener("DOMContentLoaded", function () {
  $("#calendar").fullCalendar({
    events: events.map((e) => ({
      title: e.title,
      start: e.date,
      description: e.location,
    })),
    dayClick: function (date) {
      alert("You clicked on " + date.format());
    },
    eventClick: function (event) {
      alert("Event: " + event.title + "\nDate: " + event.start.format());
    },
  });

  renderAuthButtons();
  renderEvents();
});

// Registration form handling

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;

  alert(`Registration Successful!\nName: ${name}\nEmail: ${email}\nRole: ${role}`);

  const registerModal = bootstrap.Modal.getInstance(document.getElementById("registerModal"));
  registerModal.hide();

  document.getElementById("registerForm").reset();
});
