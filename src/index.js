window.loadData = (json) => {
  const data = JSON.parse(json);

  let statusFilter = null;
  let profileFilter = null;
  let filteredData = null;
  let param = null;

  // Sort the data based on the 'Profile' element, then 'Size'
  data.sort((a, b) => {
    // Compare profiles first
    const profileComparison = a.fieldData.Profile.localeCompare(
      b.fieldData.Profile
    );

    // If profiles are different, return the comparison result
    if (profileComparison !== 0) {
      return profileComparison;
    } else {
      // If profiles are the same, sort by size in descending order
      return parseFloat(b.fieldData.Size) - parseFloat(a.fieldData.Size);
    }
  });

  //add index element
  data.map((e) => Object(e.fieldData));
  data.forEach(function (row, index) {
    row.fieldData.index = index;
  });

  // Function to create table body
  function createTableBody(data) {
    const tbody = document.createElement("tbody");
    let currentProfile = "";

    for (const item of data) {
      const profile = item.fieldData.Profile;
      if (profile !== currentProfile) {
        const profileRow = document.createElement("tr");
        const profileHeaderCell = document.createElement("th");
        profileHeaderCell.textContent = `Profile ${profile}`;
        profileHeaderCell.colSpan = 12; // Increased colspan to accommodate the button
        profileRow.appendChild(profileHeaderCell);
        tbody.appendChild(profileRow);
        currentProfile = profile;
      }

      const infoCell = document.createElement("td");

      const rowData = item.fieldData;
      const row = document.createElement("tr");
      row.setAttribute("data-index", item.fieldData.index); // Add data-index attribute
      const statusIcon = document.createElement("div");
      if (rowData.StatusMag === "Ready") {
        statusIcon.className = "statusIcon-Black";
      } else if (rowData.StatusMag === "Complete") {
        statusIcon.className = "statusIcon-Green";
      }
      statusIcon.textContent = "-";

      const statusText = document.createElement("div");
      statusText.className = "statusText";
      statusText.textContent = rowData.StatusMag;
      statusText.addEventListener("click", () => {
        if (rowData.StatusMag === "Ready") {
          statusValue = "Complete";
          priorClass = "statusIcon-Black";
          newClass = "statusIcon-Green";
          rowData.StatusMag = statusValue;
          processBtnStatus(item, statusValue, priorClass, newClass);
        } else if (rowData.StatusMag === "Complete") {
          if (
            confirm(
              "Are you sure you would like to revert this magnet record to Ready"
            ) == true
          ) {
            statusValue = "Ready";
            priorClass = "statusIcon-Green";
            newClass = "statusIcon-Black";
            rowData.StatusMag = statusValue;
            processBtnStatus(item, statusValue, priorClass, newClass);
          }
        }
      });

      const sizeText = document.createElement("div");
      sizeText.className = "sizeText";
      sizeText.textContent = rowData.Size;

      const qtyText = document.createElement("div");
      qtyText.className = "qtyText";
      qtyText.textContent = rowData.Quantity;

      infoCell.appendChild(statusIcon);
      infoCell.appendChild(statusText);
      infoCell.appendChild(sizeText);
      infoCell.appendChild(qtyText);

      row.appendChild(infoCell);

      /*
      for (const key in rowData) {
        if (key !== "Profile") {
          const cell = document.createElement("td");
          cell.textContent = rowData[key];
          row.appendChild(cell);
        }
      }
      */

      // Create button and attach event listener
      const buttonCellCut = document.createElement("td");
      const buttonCut = document.createElement("div");
      buttonCut.insertAdjacentHTML(
        "afterbegin",
        '<i class="fa-solid fa-scissors"></i>'
      );
      buttonCut.className = "buttonIcon";
      buttonCut.addEventListener("click", () => {
        item.action = "btnCut";
        FileMaker.PerformScriptWithOption(
          "PFMj-WV002_wv_process",
          JSON.stringify(item),
          "0"
        );
      });
      buttonCellCut.appendChild(buttonCut);
      row.appendChild(buttonCellCut);

      // Create button and attach event listener
      const buttonCellHam = document.createElement("td");
      const buttonHam = document.createElement("div");
      buttonHam.insertAdjacentHTML(
        "afterbegin",
        '<i class="fa-solid fa-hammer"></i>'
      );
      buttonHam.className = "buttonIcon";
      buttonHam.addEventListener("click", () => {
        item.action = "btnHam";
        FileMaker.PerformScriptWithOption(
          "PFMj-WV002_wv_process",
          JSON.stringify(item),
          "0"
        );
      });
      buttonCellHam.appendChild(buttonHam);
      row.appendChild(buttonCellHam);

      // Create button and attach event listener
      const buttonCellTime = document.createElement("td");
      const buttonTime = document.createElement("div");
      buttonTime.className = "buttonIcon";
      buttonTime.insertAdjacentHTML(
        "afterbegin",
        '<i class="fa-solid fa-clock"></i>'
      );
      buttonTime.addEventListener("click", () => {
        item.action = "btnTime";
        FileMaker.PerformScriptWithOption(
          "PFMj-WV002_wv_process",
          JSON.stringify(item),
          "0"
        );
      });
      buttonCellTime.appendChild(buttonTime);
      row.appendChild(buttonCellTime);

      // Create button and attach event listener
      const buttonCellOrd = document.createElement("td");
      const buttonOrd = document.createElement("div");
      buttonOrd.insertAdjacentHTML(
        "afterbegin",
        '<i class="fa-solid fa-receipt"></i>'
      );
      buttonOrd.className = "buttonIcon";
      buttonOrd.addEventListener("click", () => {
        item.action = "btnOrd";
        FileMaker.PerformScriptWithOption(
          "PFMj-WV002_wv_process",
          JSON.stringify(item),
          "0"
        );
      });
      buttonCellOrd.appendChild(buttonOrd);
      row.appendChild(buttonCellOrd);

      const statusDiv = document.createElement("div");
      statusDiv.classList.add("statusDiv");

      const statusCut = document.createElement("div");
      statusCut.classList.add("statusCMText");
      if (rowData.StatusCut === "Complete") {
        statusCut.classList.add("grayText");
      } else if (calculateBusinessDaysSince(rowData.StatusCutTimestamp) === 2) {
        statusCut.classList.add("yellowbg");
      } else if (calculateBusinessDaysSince(rowData.StatusCutTimestamp) === 3) {
        statusCut.classList.add("orangebg");
      } else if (calculateBusinessDaysSince(rowData.StatusCutTimestamp) > 3) {
        statusCut.classList.add("redbg");
      }
      statusCut.textContent =
        "Cut: " + convertTimestamp(rowData.StatusCutTimestamp);

      const statusMag = document.createElement("div");
      statusMag.classList.add("statusCMText");
      if (rowData.StatusMag === "Complete") {
        statusMag.classList.add("grayText");
      } else if (calculateBusinessDaysSince(rowData.StatusMagTimestamp) === 2) {
        statusMag.classList.add("yellowbg");
      } else if (calculateBusinessDaysSince(rowData.StatusMagTimestamp) === 3) {
        statusMag.classList.add("orangebg");
      } else if (calculateBusinessDaysSince(rowData.StatusMagTimestamp) > 3) {
        statusMag.classList.add("redbg");
      }
      statusMag.textContent =
        "Mag: " + convertTimestamp(rowData.StatusMagTimestamp);

      statusDiv.appendChild(statusCut);
      statusDiv.appendChild(statusMag);

      row.appendChild(statusDiv);

      tbody.appendChild(row);
    }
    return tbody;
  }

  // Function to create buttons for filtering by profile
  function createFilterButtons(buttonData) {
    const profiles = Array.from(
      new Set(buttonData.map((item) => item.fieldData.Profile))
    );
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "filter-buttons";

    profiles.forEach((profile) => {
      const button = document.createElement("button");
      button.textContent = `${profile}`;
      button.className = "buttonFilterProfile";
      if (profileFilter === profile) {
        button.classList.add("redBorder");
      }
      button.addEventListener("click", () => {
        filterByProfile(profile);
      });
      buttonContainer.appendChild(button);
    });

    return buttonContainer;
  }

  // Function to create buttons for filtering by status
  function createFilterButtonsStatus(buttonData) {
    const StatusMags = Array.from(
      new Set(buttonData.map((item) => item.fieldData.StatusMag))
    );
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "filter-buttons";

    const showAllButton = document.createElement("button");
    showAllButton.textContent = "Show All";
    showAllButton.className = "buttonShowAll";
    showAllButton.addEventListener("click", () => {
      showAllData();
    });
    buttonContainer.appendChild(showAllButton);

    StatusMags.forEach((StatusMag) => {
      const button = document.createElement("button");
      button.textContent = `${StatusMag}`;
      button.className = "buttonFilter" + StatusMag;
      if (statusFilter === StatusMag) {
        button.classList.add("redBorder");
      }
      button.addEventListener("click", () => {
        filterByStatusMag(StatusMag);
      });
      buttonContainer.appendChild(button);
    });

    return buttonContainer;
  }

  // Function to filter data by profile
  function filterByProfile(profile) {
    profileFilter = profile;
    FileMaker.PerformScriptWithOption("PFMj-WV003a_pullMagData", "", "0");
  }

  // Function to filter data by status
  function filterByStatusMag(StatusMag) {
    statusFilter = StatusMag;
    FileMaker.PerformScriptWithOption("PFMj-WV003a_pullMagData", "", "0");
  }

  // Function to show all data
  function showAllData() {
    statusFilter = null;
    profileFilter = null;
    FileMaker.PerformScriptWithOption("PFMj-WV003a_pullMagData", "", "0");
  }

  // Function to update the table
  function updateTable(data) {
    const table = document.querySelector("table");
    const tbody = createTableBody(data); // Create the new tbody element
    // Remember the current scroll position
    const scrollY = table.scrollTop;
    // Clear the table contents
    table.innerHTML = "";
    // Append the new tbody to the table
    table.appendChild(tbody);
    // Restore the scroll position
    table.scrollTop = scrollY;
  }

  window.refreshData = function (json) {
    const data = JSON.parse(json);
    // Sort the data based on the 'Profile' element, then 'Size'
    data.sort((a, b) => {
      // Compare profiles first
      const profileComparison = a.fieldData.Profile.localeCompare(
        b.fieldData.Profile
      );

      // If profiles are different, return the comparison result
      if (profileComparison !== 0) {
        return profileComparison;
      } else {
        // If profiles are the same, sort by size in descending order
        return parseFloat(b.fieldData.Size) - parseFloat(a.fieldData.Size);
      }
    });
    //add index element
    data.map((e) => Object(e.fieldData));
    data.forEach(function (row, index) {
      row.fieldData.index = index;
    });

    if (profileFilter !== null && statusFilter !== null) {
      filteredData = data.filter(
        (item) =>
          item.fieldData.StatusMag === statusFilter &&
          item.fieldData.Profile === profileFilter
      );
    } else if (statusFilter !== null) {
      filteredData = data.filter(
        (item) => item.fieldData.StatusMag === statusFilter
      );
    } else if (profileFilter !== null) {
      filteredData = data.filter(
        (item) => item.fieldData.Profile === profileFilter
      );
    } else {
      filteredData = data;
    }

    updateTable(filteredData);
  };

  window.refreshButtons = function (json) {
    const data = JSON.parse(json);

    // Sort the data based on the 'Profile' element, then 'Size'
    data.sort((a, b) => {
      const profileComparison = a.fieldData.Profile.localeCompare(
        b.fieldData.Profile
      );

      if (profileComparison !== 0) {
        return profileComparison;
      } else {
        return parseFloat(b.fieldData.Size) - parseFloat(a.fieldData.Size);
      }
    });

    // Update filter buttons without replacing the entire container
    const filterContainerProfile = createFilterButtons(data);
    const filterContainerStatus = createFilterButtonsStatus(data);
    const filterButtonsContainer = document.querySelector(
      ".filter-buttons-container"
    );

    // Update filter buttons only if they have changed
    if (
      !isEqualNode(filterContainerProfile, filterButtonsContainer.lastChild)
    ) {
      filterButtonsContainer.replaceChild(
        filterContainerProfile,
        filterButtonsContainer.lastChild
      );
    }
    if (
      !isEqualNode(filterContainerStatus, filterButtonsContainer.firstChild)
    ) {
      filterButtonsContainer.replaceChild(
        filterContainerStatus,
        filterButtonsContainer.firstChild
      );
    }
  };

  // Helper function to compare two DOM nodes
  function isEqualNode(node1, node2) {
    return node1.isEqualNode(node2);
  }

  // Function to handle button click
  function processBtn(item) {
    // Update the quantity of the clicked item
    data[item.fieldData.index].fieldData.Quantity = 100;

    // Update the quantity cell in the clicked row
    const rowIndex = item.fieldData.index;
    const quantityCell = document.querySelector(
      `tr[data-index="${rowIndex}"] .qtyText`
    );
    quantityCell.textContent = "100";
  }

  // Function to handle button click
  function processBtnStatus(item, status, priorClass, newClass) {
    // Update the quantity of the clicked item
    data[item.fieldData.index].fieldData.StatusMag = status;

    // Update the quantity cell in the clicked row
    const rowIndex = item.fieldData.index;
    const statusIcon = document.querySelector(
      `tr[data-index="${rowIndex}"] .${priorClass}`
    );
    const statusText = document.querySelector(
      `tr[data-index="${rowIndex}"] .statusText`
    );

    // Check if statusIcon is not null before accessing its properties
    if (statusIcon) {
      statusIcon.className = newClass;
    } else {
      console.error("statusIcon not found for rowIndex:", rowIndex);
    }

    if (statusText) {
      statusText.textContent = status;
    } else {
      console.error("statusText not found for rowIndex:", rowIndex);
    }

    item.action = "statusChange";

    FileMaker.PerformScriptWithOption(
      "PFMj-WV002_wv_process",
      JSON.stringify(item),
      "0"
    );
  }

  // Create filter containers
  const filterContainerStatus = createFilterButtonsStatus(data);
  const filterContainerProfile = createFilterButtons(data);

  // Create container to hold filter buttons
  const filterButtonsContainer = document.createElement("div");
  filterButtonsContainer.className = "filter-buttons-container";
  filterButtonsContainer.appendChild(filterContainerStatus);
  filterButtonsContainer.appendChild(filterContainerProfile);
  document.body.appendChild(filterButtonsContainer);

  // Style the filterButtonsContainer to be sticky at the bottom
  filterButtonsContainer.style.position = "fixed";
  filterButtonsContainer.style.bottom = "0"; // Stick it to the bottom of the viewport
  filterButtonsContainer.style.width = "100%"; // Make it span the entire width
  filterButtonsContainer.style.zIndex = "2"; // Ensure it's above the table

  // Append the filterButtonsContainer to the document body
  document.body.appendChild(filterButtonsContainer);

  // Create table container
  const tableContainer = document.createElement("div");
  tableContainer.className = "table-container"; // Add the class
  document.body.appendChild(tableContainer);

  // Create table
  const table = document.createElement("table");
  table.appendChild(createTableBody(data));
  tableContainer.appendChild(table);

  function convertTimestamp(timestamp) {
    // Parse the input timestamp string
    const date = new Date(timestamp);

    // Extract the date components
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    const year = date.getFullYear() % 100; // Get last two digits of the year

    // Extract the time components
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert hours to 12-hour format

    // Construct the formatted timestamp string
    const formattedTimestamp = `${month}/${day}/${year} ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;

    return formattedTimestamp;
  }

  function calculateBusinessDaysSince(timestamp) {
    // Convert the timestamp to a Date object
    const startDate = new Date(timestamp);

    // Current date
    const currentDate = new Date();

    // Number of milliseconds in a day
    const oneDay = 1000 * 60 * 60 * 24;

    // Function to check if a given date is a weekend day (Saturday or Sunday)
    function isWeekend(date) {
      const day = date.getDay();
      return day === 0 || day === 6; // 0 represents Sunday, 6 represents Saturday
    }

    let businessDays = 0;

    // Iterate through each day between startDate and currentDate
    for (
      let date = new Date(startDate);
      date <= currentDate;
      date.setDate(date.getDate() + 1)
    ) {
      // Check if the current date is a weekend day
      if (!isWeekend(date)) {
        businessDays++;
      }
    }

    return businessDays;
  }

  // Function to dynamically adjust table container height based on filter buttons container height
  function adjustTableHeight() {
    const filterButtonsContainerHeight = document.querySelector(
      ".filter-buttons-container"
    ).offsetHeight;
    const maxHeight = window.innerHeight - filterButtonsContainerHeight - 20; // Adjust padding or margin as needed
    document.querySelector(".table-container").style.maxHeight =
      maxHeight + "px";
  }

  // Call the function to adjust the table container height initially and whenever window is resized
  window.addEventListener("resize", adjustTableHeight);
  adjustTableHeight();
};

setInterval(function () {
  window.FileMaker.PerformScript("PFMj-WV003a_pullMagData", "");
}, 30000);
