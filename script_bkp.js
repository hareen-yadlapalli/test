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
    console.log("1obj1 ", obj1);
    console.log("2obj2 ", obj2);
    let obj1Keys;
    let obj2Keys;
    let allKeys;
  
  
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
    console.log("3obj1keys", obj1Keys);
  
    console.log("4obj2keys", obj2Keys);
  
  
  
    console.log("5allKeys", allKeys);
  
    // Loop through each key and compare the values
    for (const key of allKeys) {
        // Create a row element
        const row = document.createElement("tr");
  
        // Create a column for the attribute path
        const column1 = document.createElement("td");
        const attributePath = [...path, key].join(".");
        console.log("6key ", key);
        console.log("7path ", path);
        console.log("8attributePath ", attributePath);
        column1.textContent = attributePath;
        row.appendChild(column1);
        console.log("8.1column1 ", column1);
  
        console.log("9obj1 ", obj1);
        console.log("10obj2 ", obj2);
        // Get the values for this attribute from both objects
        const obj1Value = getValue(obj1, key);
        const obj2Value = getValue(obj2, key);
        console.log("11obj1Value ", obj1Value);
        console.log("12obj2Value ", obj2Value);
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
  
        // If the attribute is an object, compare recursively
        if (typeof obj1Value === "object" || typeof obj2Value === "object") {
            compareObjects(obj1Value, obj2Value, table, [...path, key]);
        }
    }
  }
  
  function getValue(obj, key) {
    // If the object is an array, parse the attribute name to get the index and key
    if (Array.isArray(obj)) {
      console.log("11arrayobj ", obj);
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
  