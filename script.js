function compareJSONs() {
  // Parse JSON inputs from text areas
  const json1 = JSON.parse(document.getElementById("json1").value);
  const json2 = JSON.parse(document.getElementById("json2").value);

  document.getElementById("table-container").innerHTML = "";
  // Create a table element
  const table = document.createElement("table");

  // Compare the JSON objects recursively
  compareObjects(json1, json2, table);

  // Add the table to the HTML document
  document.getElementById("table-container").appendChild(table);
}

function compareObjects(obj1, obj2, table, path = []) {
  // Get all unique keys from both objects
  let obj1Keys;
  let obj2Keys;
  let allKeys;

  if (Array.isArray(obj1)) {
    obj1Keys = [...new Array(obj1.length)].map((_, i) => i.toString());
  } else if (typeof obj1 === "object") {
    obj1Keys = Object.keys(obj1);
  }

  if (Array.isArray(obj2)) {
    obj2Keys = [...new Array(obj2.length)].map((_, i) => i.toString());
  } else if (typeof obj2 === "object") {
    obj2Keys = Object.keys(obj2);
  }


  if (typeof obj1 === "object") {
    obj1Keys = Object.keys(obj1);
    allKeys = [...new Set([...obj1Keys])];
  }

  if (typeof obj2 === "object") {
    obj2Keys = Object.keys(obj2);
    allKeys = [...new Set([...obj2Keys])];

    if (typeof obj1 === "object")
      allKeys = [...new Set([...obj1Keys, ...obj2Keys])];
  }
  // Loop through each key and compare the values
  for (const key of allKeys) {
    // Create a row element
    const row = document.createElement("tr");

    // Create a column for the attribute path
    const column1 = document.createElement("td");
    const attributePath = [...path, key].join(".");
    column1.textContent = attributePath;
    row.appendChild(column1);

    // Get the values for this attribute from both objects
    const obj1Value = getValue(obj1, key);
    const obj2Value = getValue(obj2, key);

    // Create a column for the value in object 1
    const column2 = document.createElement("td");
    column2.textContent = JSON.stringify(obj1Value);
    row.appendChild(column2);

    // Create a column for the value in object 2
    const column3 = document.createElement("td");
    column3.textContent = JSON.stringify(obj2Value);
    row.appendChild(column3);

    // Highlight cells that are different
    if (JSON.stringify(obj1Value) !== JSON.stringify(obj2Value)) {
      column2.classList.add("yellow");
      column3.classList.add("yellow");
    }

    // Add the row to the table
    table.appendChild(row);

    // If the attribute is an array, compare each element recursively
    if (Array.isArray(obj1Value) && Array.isArray(obj2Value)) {
      const maxArrayLength = Math.max(obj1Value.length, obj2Value.length);
      for (let i = 0; i < maxArrayLength; i++) {
        const arrayObj1Value = obj1Value[i];
        const arrayObj2Value = obj2Value[i];

        if (arrayObj1Value !== undefined || arrayObj2Value !== undefined) {
          const arrayKey = `${i}.${key}`;
          compareObjects(arrayObj1Value, arrayObj2Value, table, [...path, arrayKey]);
        }
      }
    }
    // If the attribute is an object, compare recursively
    else if (typeof obj1Value === "object" || typeof obj2Value === "object") {
      compareObjects(obj1Value, obj2Value, table, [...path, key]);
    }
  }
}


function getValue(obj, key) {
  // If the object is an array, parse the attribute name to get the index and key
  if (Array.isArray(obj)) {
      const arrayIndex = parseInt(key);
      if (isNaN(arrayIndex)) {
          return undefined;
      }
      const arrayValue = obj[arrayIndex];
      const attributeKey = key.substring(key.indexOf(".") + 1);
      return getValue(arrayValue, attributeKey);
  }
  // If the object is a regular object, parse the attribute name to get the key and nested key (if any)
  else if (typeof obj === "object") {
      if (key.indexOf(".") === -1) {
          return obj[key];
      } else {
          const objectKey = key.substring(0, key.indexOf("."));
          const attributeKey = key.substring(key.indexOf(".") + 1);
          const objectValue = obj[objectKey];
          return getValue(objectValue, attributeKey); 
      }
  }
  // If the object is not an array or regular object, return undefined
  else {
      return undefined;
  }
}

