// add movieID to local storage
const addToLocalStorage = function (name, value) {
  // Get the existing data
  let existing = localStorage.getItem(name);
  existing = existing ? JSON.parse(existing) : [];
  if (existing.includes(value)) {
    alert("You already have this movie in your library");
  } else {
    // Add new data to localStorage
    existing.push(value);
    // Save back to localStorage
    localStorage.setItem(name, JSON.stringify(existing));
  }
};


export { addToLocalStorage };
