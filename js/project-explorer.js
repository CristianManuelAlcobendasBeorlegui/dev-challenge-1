// === STRICT MODE === //
"use strict";

// === DOM ELEMENTS === //
let projectItems;
let projectsData;
let projects;
let closeProjectViewerIcon;
const CSS_CLASSNAMES = {
  projectItem: "project__item",
  projectContent: "project__content",
  projectTitle: "project__title",
  projectDescription: "project__description",
  tagItems: "tag__items",
  tagItem: "tag__item",
  technologyItems: "technology__items",
  technologyItem: "technology__item",
  authorItems: "author__items",
  authorItem: "author__item",
  html5: "ti ti-brand-html5",
  css3: "ti ti-brand-css3",
  javascript: "ti ti-brand-javascript",
  php: "ti ti-brand-php",
  laravel: "ti ti-brand-laravel",
  heading: "heading",
  button: "button",
  active: "active"
}
const projectViewer = {
  element: document.querySelector(".project-viewer"),
  preview: document.querySelector(".project-viewer .project__preview-item"),
  title: document.querySelector(".project-viewer .project__title"),
  tagItems: document.querySelector(".project-viewer .tag__items"),
  technologyItems: document.querySelector(".project-viewer .technology__items"),
  description: document.querySelector(".project-viewer .project__description p"),
  authorItems: document.querySelector(".project-viewer .author__items"),
  ctaButton: document.querySelector(".project-viewer__cta-btn")
};
let cleanFiltersIcon;
let filterProjectName;
let filterTechnologies;

// === EVENT LISTENERS === //
window.addEventListener("load", init);

// === METHODS === //

function init() {
  // Initialize variables
  projectsData = {};

  // Link DOM elements
  projectItems = document.querySelector(".project__items");
  
  filterProjectName = document.querySelector("#project-name");
  let checkboxItems = document.querySelectorAll("[type='checkbox']");
  cleanFiltersIcon = document.querySelector("#clean-filters-icon");

  // Add event listeners
  filterProjectName.addEventListener("keyup", filter);
  checkboxItems.forEach(checkboxItem => {
    checkboxItem.addEventListener("change", filter); 
  });
  cleanFiltersIcon.addEventListener("click", cleanFilters);

  // Make async requests
  ajax("GET", window.location.origin + "/js/response.json", true, loadProjects);
}

function loadProjects(xhttp) {
  let projects = JSON.parse(xhttp.response);

  for (let key in projects) {
    let project = projects[key];

    let id = project.id;
    let title = project.name;
    let description = project.description;
    let link = project.link;
    let picture = project.picture;
    let tags = project.tags;
    let technologies = project.technologies;
    let authors = project.authors;

    // Define HTML elements
    let projectItem = document.createElement("div");
    let projectContent = document.createElement("div");
    let projectTitle = document.createElement("h3");
    let projectDescription = document.createElement("p");
    let button = document.createElement("button");

    // Set attributes
    projectItem.setAttribute("id", id);
    projectItem.setAttribute("class", CSS_CLASSNAMES.projectItem);
    projectItem.setAttribute("style", "background-image: url(" + picture + ")");
    projectItem.setAttribute("data-name", project.name);
    projectItem.setAttribute("data-technologies", project.technologies.join(", "));
    projectContent.setAttribute("class", CSS_CLASSNAMES.projectContent);
    projectTitle.setAttribute("class", CSS_CLASSNAMES.projectTitle);
    projectDescription.setAttribute("class", CSS_CLASSNAMES.projectDescription);
    button.setAttribute("class", CSS_CLASSNAMES.button);

    // Add data to elements
    projectTitle.innerText = title;
    projectDescription.innerText = description;
    button.innerHTML = "See more";

    // Append childs
    projectItems.appendChild(projectItem);
    projectItem.appendChild(projectContent);
    projectContent.appendChild(projectTitle);
    projectContent.appendChild(projectDescription);
    projectContent.appendChild(button);

    // Save current project data
    projectsData[id] = {
      id: id,
      name: title,
      description: description,
      tags: tags,
      picture: picture,
      technologies: technologies,
      authors: authors,
      link: link
    };
  }

  linkProjectsToViewer();
}

function ajax(httpMethod, url, async, callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.addEventListener("readystatechange", function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this);
    }
  });
  xhttp.open(httpMethod, url, async);
  xhttp.send();
}

function linkProjectsToViewer() {
  // Link DOM elements
  projects = document.querySelectorAll(".project__item");
  closeProjectViewerIcon = document.querySelector("#close-project-viewer__icon");

  // Add event listeners
  projects.forEach(project => {
    let id = project.getAttribute("id");
    project.addEventListener("click", () => openProjectViewer(id));
  });
  closeProjectViewerIcon.addEventListener("click", closeProjectViewer);
}

async function openProjectViewer(id) {
  if (projectsData[id] == null) throw Error("Given ID does not exists.");

  await loadDataInProjectViewer(id);
  projectViewer.element.classList.add(CSS_CLASSNAMES.active);
}

async function loadDataInProjectViewer(id) {
  // Get project data
  let link = projectsData[id].link;
  let title = projectsData[id].name;
  let tags = projectsData[id].tags;
  let technologies = projectsData[id].technologies;
  let description = projectsData[id].description;
  let authors = projectsData[id].authors;

  // Update text/attribute content
  projectViewer.title.innerText = title;
  projectViewer.description.innerText = description;
  projectViewer.ctaButton.setAttribute("href", link);
  projectViewer.preview.setAttribute("src", link);

  // Remove child elements
  projectViewer.tagItems.innerHTML = "";
  projectViewer.technologyItems.innerHTML = "";
  // projectViewer.authorItems.innerHTML = "";

  // Generate child elements
  // Tags
  // for (let tag of tags) {
  //   projectViewer.tagItems.appendChild(generateTagFormat(tag));
  // }

  // Techs
  for (let technology of technologies) {
    projectViewer.technologyItems.appendChild(generateTechnologyFormat(technology));
  }

  // Authors
  // for (let author of authors) {
  //   projectViewer.authorItems.appendChild(generateAuthorFormat(author));
  // }

  return new Promise(resolve => setTimeout(resolve, 0));
}

function generateTagFormat(tag) {
  let span = document.createElement("span");
  span.setAttribute("class", CSS_CLASSNAMES.tagItem);
  span.innerText = "#" + tag;

  return span;
}

function generateTechnologyFormat(technology) {
  let i = document.createElement("i");
  let technologyClassName = getTechnologyClassName(technology);

  i.setAttribute("class", CSS_CLASSNAMES.technologyItem + " " + technologyClassName);

  return i;
}

function getTechnologyClassName(technology) {
  switch (technology.toLowerCase()) {
    case "html5":
      return CSS_CLASSNAMES.html5;

    case "css3":
      return CSS_CLASSNAMES.css3;

    case "javascript":
      return CSS_CLASSNAMES.javascript;

    case "php":
      return CSS_CLASSNAMES.php;

    case "laravel":
      return CSS_CLASSNAMES.laravel;

    default:
      return "";
  }
}

function generateAuthorFormat(author) {
  let anchor = document.createElement("a");
  let img = document.createElement("img");

  anchor.setAttribute("href", author.link);
  anchor.setAttribute("target", "_blank");
  anchor.setAttribute("class", CSS_CLASSNAMES.authorItem);
  img.setAttribute("src", author.picture);
  img.setAttribute("alt", author.name + "'s profile picture");
  img.setAttribute("class", "author__profile-image");

  anchor.appendChild(img);
  anchor.innerHTML += author.name;

  return anchor;
}

function closeProjectViewer() {
  projectViewer.element.classList.remove(CSS_CLASSNAMES.active);
}

function filter() {
  let projectName = filterProjectName.value;
  let technologies = [];

  document
    .querySelectorAll(":checked")
    .forEach(technology => {
      technologies.push(technology.value);    
    });

  let projectItems = document.querySelectorAll(".project__item");
  projectItems.forEach(projectItem => {
    let passFilter = true;

    if (!projectItem.getAttribute("data-name").toLowerCase().includes(projectName.toLowerCase())) {
      passFilter = false;
    }

    for (let i = 0; i < technologies.length && passFilter; i++) {
      if (!projectItem.getAttribute("data-technologies").includes(technologies[i])) {
        passFilter = false;
      }
    }

    if (passFilter) {
      projectItem.classList.remove("hidden");
    } else {
      projectItem.classList.add("hidden");
    }
  });
}

function cleanFilters() {
  filterProjectName.value = "";
  document.querySelectorAll(":checked").forEach(checkedItem => {
    checkedItem.checked = false;
  });
  filter();
}