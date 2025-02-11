// === STRICT MODE === //
"use strict";

// === DOM ELEMENTS === //
let menuIcon;
let navbar;
let sections;
let navLinks;

// === EVENT LISTENERS === //
window.addEventListener("load", init, false);

// === METHODS === //

function init() {
  // Link DOM elements
  menuIcon = document.querySelector("#menu-icon");
  navbar = document.querySelector(".navbar");
  sections = document.querySelectorAll("section");
  navLinks = document.querySelectorAll("header nav a");

  // Add event listeners
  menuIcon.addEventListener("click", toggleMenu);
  window.addEventListener("scroll", changeActiveMenuOption);
}

function toggleMenu() {
  toggleMenuIcon();
  navbar.classList.toggle("active");
}

function toggleMenuIcon() {
  menuIcon.classList.toggle("ti-menu-2");
  menuIcon.classList.toggle("ti-x");  
}

function changeActiveMenuOption() {
  sections.forEach(section => {
    let top = window.scrollY;
    let offset = section.offsetTop - 150;
    let height= section.offsetHeight;
    let id = section.getAttribute("id");
    
    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        document.querySelector("header nav a[href='#" + id + "']").classList.add("active");
      });
    }
  });
}