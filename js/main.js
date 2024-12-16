const courseCardTemplate = document.querySelector("[data-user-template]");
const courseCardContainer = document.querySelector("[data-course-cards-container]");
const searchInput = document.querySelector("[data-search]");
let courses = []; 

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase(); 
  courses.forEach(course => {

    const isVisible = Object.values(course.data).some(field =>
      field?.toLowerCase().includes(value)
    );
    course.element.style.display = isVisible ? "block" : "none";
  });
});

fetch("js/course-list.csv")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }
    return response.text();
  })
  .then(csvText => {

    const rows = csvText.split("\n").map(row => row.trim());
    const header = rows[0].split(",");
    courses = rows.slice(1).map(row => {
      const values = row.split(",");
      return header.reduce((obj, key, index) => {
        obj[key] = values[index]?.trim() || ""; 
        return obj;
      }, {});
    });

    courses = courses.map(courseData => {
      const card = courseCardTemplate.content.cloneNode(true).children[0];
      const headerElement = card.querySelector("[data-header]");
      const bodyElement = card.querySelector("[data-body]");

      headerElement.textContent = courseData.CourseTitle || "Untitled Course";

      bodyElement.innerHTML = Object.entries(courseData)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join("");

      courseCardContainer.append(card);

      return { data: courseData, element: card };
    });
  })
  .catch(error => {
    console.error("Error fetching or parsing CSV:", error);
  });

