const url = window.location.href;
function onSubmit(e) {
  e.preventDefault();
  // e.preventPropagation();
  var data = new FormData(e.target);

  setTimeout(() => {}, 1000);
  fetch(url, {
    method: "POST",
    headers: {
      "x-csrf-token": e.target._csrf.value,
    },
    body: data,
  })
    .then((res) => {
      if (res.redirected) {
        return location.replace(res.url);
      } else {
        return res.text();
      }
    })
    .then((html) => (document.body.innerHTML = html));
  return false;
}
