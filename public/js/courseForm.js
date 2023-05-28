// add block
function addBlock(elem) {
  const block = elem.parentNode;
  const group = document.createElement("div");
  const div = document.createElement("div");
  const remove = document.createElement("button");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const formUnit = document.createElement("div");
  const addUnit = document.createElement("button");

  let blockCount = block.childElementCount;

  group.setAttribute("class", "form-group");
  remove.setAttribute("type", "button");
  remove.setAttribute("class", "removeForm");
  remove.setAttribute("onclick", "removeItem(this)");
  remove.innerHTML = "-";
  label.setAttribute("for", `block-${blockCount}`);
  label.innerHTML = "Block Name:";
  input.setAttribute("type", "text");
  input.setAttribute("name", `block-${blockCount}`);
  input.setAttribute("id", `block-${blockCount}`);

  formUnit.setAttribute("class", "form-unit");
  addUnit.setAttribute("type", "button");
  addUnit.setAttribute("class", "btn");
  addUnit.setAttribute("onclick", "addUnit(this)");
  addUnit.innerHTML = "Add Unit";

  div.appendChild(remove);
  div.appendChild(label);

  formUnit.appendChild(addUnit);

  group.appendChild(div);
  group.appendChild(input);
  group.appendChild(formUnit);

  block.insertBefore(group, elem);
}

function addUnit(elem) {
  const unit = elem.parentNode;
  const group = document.createElement("div");
  const div = document.createElement("div");
  const remove = document.createElement("button");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const formTopic = document.createElement("div");
  const addTopic = document.createElement("button");

  let unitCount = unit.childElementCount;
  let parentClass = unit.parentNode.children[1].id;

  group.setAttribute("class", "form-group");
  remove.setAttribute("type", "button");
  remove.setAttribute("class", "removeForm");
  remove.setAttribute("onclick", "removeItem(this)");
  remove.innerHTML = "-";
  label.setAttribute("for", `${parentClass}-unit-${unitCount}`);
  label.innerHTML = "Unit Name:";
  input.setAttribute("type", "text");
  input.setAttribute("name", `${parentClass}-unit-${unitCount}`);
  input.setAttribute("id", `${parentClass}-unit-${unitCount}`);

  formTopic.setAttribute("class", "form-topic");
  addTopic.setAttribute("type", "button");
  addTopic.setAttribute("class", "btn");
  addTopic.setAttribute("onclick", "addTopic(this)");
  addTopic.innerHTML = "Add Topic";

  formTopic.appendChild(addTopic);

  div.appendChild(remove);
  div.appendChild(label);

  group.appendChild(div);
  group.appendChild(input);
  group.appendChild(formTopic);

  unit.insertBefore(group, elem);
}

function addTopic(elem) {
  const topic = elem.parentNode;
  const group = document.createElement("div");
  const div = document.createElement("div");
  const remove = document.createElement("button");
  const label = document.createElement("label");
  const input = document.createElement("input");

  let topicCount = topic.childElementCount;
  let parentClass = topic.parentNode.children[1].id;

  group.setAttribute("class", "form-group");
  remove.setAttribute("type", "button");
  remove.setAttribute("class", "removeForm");
  remove.setAttribute("onclick", "removeItem(this)");
  remove.innerHTML = "-";
  label.setAttribute("for", `${parentClass}-topic-${topicCount}`);
  label.innerHTML = "Topic Name:";
  input.setAttribute("type", "text");
  input.setAttribute("name", `${parentClass}-topic-${topicCount}`);
  input.setAttribute("id", `${parentClass}-topic-${topicCount}`);

  div.appendChild(remove);
  div.appendChild(label);

  group.appendChild(div);
  group.appendChild(input);

  topic.insertBefore(group, elem);
}

function removeItem(elem) {
  const doc = elem.parentNode.parentNode;
  doc.remove();
}
