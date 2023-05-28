function responsive() {
  const nav = document.querySelector("nav");

  if (nav.className == "responsive") {
    nav.className = "";
  } else {
    nav.className = "responsive";
  }
}
