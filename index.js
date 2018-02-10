// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $datetimeInput = document.querySelector("#datetime");
var $cityInput = document.querySelector("#city");
var $countryInput = document.querySelector("#country");
var $stateInput = document.querySelector("#state");
var $shapeInput = document.querySelector("#shape");
var $searchBtn = document.querySelector("#search");
var $pagination = document.querySelector(".pagination");

var columnsToFilter = [];
var pgSz = 50;
var firstRow = 0;
var pagination_cnts = 10 ;
var currStrtPg = 1;
var currEndPg = 10;

var pageCount = 0 ;


currEndPg = pagination_cnts;


// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);

// Set filteredAddresses to addressData initially
var filteredUfoData = dataSet;

console.log(dataSet.length );

pageCount = Math.ceil(filteredUfoData.length / pgSz);

// renderTable renders the filteredAddresses to the tbody
function renderTable(startRow) {
    $tbody.innerHTML = "";
    for (var i = startRow, k =0; (i < (startRow + pgSz)) && (i < filteredUfoData.length); i++) {
      // Get get the current address object and its fields
      var ufoData = filteredUfoData[i];
      var fields = Object.keys(ufoData);
      // Create a new row in the tbody, set the index to be i + startingIndex
      var $row = $tbody.insertRow(k++);
      for (var j = 0; j < fields.length; j++) {
        // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
        var field = fields[j];
        var $cell = $row.insertCell(j);
        $cell.innerText = ufoData[field];
      }
    }

    
  }

  function getFilterCriteria(){
      var filterCriteria = "";
      columnsToFilter = [];
      
      if ($datetimeInput.value.trim().length > 0){
        columnsToFilter.push("datetime");
        filterCriteria = filterCriteria + $datetimeInput.value.trim().toLowerCase();
      }
      if ($cityInput.value.trim().length > 0){
        columnsToFilter.push("city");
        filterCriteria = filterCriteria + $cityInput.value.trim().toLowerCase();
      }
      if ($countryInput.value.trim().length > 0){
        columnsToFilter.push("country");
        filterCriteria = filterCriteria + $countryInput.value.trim().toLowerCase();
      }
      if ($stateInput.value.trim().length > 0){
        columnsToFilter.push("state");
        filterCriteria = filterCriteria + $stateInput.value.trim().toLowerCase();
      }
      if ($shapeInput.value.trim().length > 0){
        columnsToFilter.push("shape");
        filterCriteria = filterCriteria + $shapeInput.value.trim().toLowerCase();
      }

      return filterCriteria;
  }

  function handleSearchButtonClick() {
    console.log("Entring filter");
    // Format the user's search by removing leading and trailing whitespace, lowercase the string
  
    var filterCriteria = getFilterCriteria();
    console.log(filterCriteria );
 
    
  
    // Set filteredAddresses to an array of all addresses whose "state" matches the filter
    filteredUfoData = dataSet.filter(function(ufoData) {
  
    var filterColumns = "" ;
    for(i = 0; i < columnsToFilter.length ; i++){
      filterColumns += ufoData[columnsToFilter[i]].toLowerCase();
    }
   
    //  console.log("filterCriteria =>" + filterCriteria) ;
    //  console.log("filterColumns =>" + filterColumns) ;
      // If true, add the address to the filteredAddresses, otherwise don't add it to filteredAddresses
      return ((filterColumns === filterCriteria));
    });
    renderTable(firstRow);
    console.log(filteredUfoData.length) ;
    pageCount = Math.ceil(filteredUfoData.length / pgSz);
    
    currStrtPg = 1;
    if (pageCount < pagination_cnts)
      currEndPg = pageCount;
    else
      currEndPg = pagination_cnts;
    initPagination();
  }

  function previous(liTagPrev){
    console.log("previous");
    console.log(liTagPrev);
    
    
    if ((currStrtPg - pagination_cnts) < 1 ) {
      // currStrtPg = 1;
      // currEndPg = 10;
      liTagPrev.class="disabled";
    }
    else{
    currEndPg = currStrtPg - 1;
    currStrtPg = currStrtPg - pagination_cnts;
    console.log("currStrtPg =>" + currStrtPg);
    console.log("currEndPg =>" + currEndPg);
    renderTable(currStrtPg - 1);
    initPagination();
    }
  }

  function next(){
    console.log("next");
    
    if ((currEndPg + pagination_cnts ) > pageCount ) {
      currEndPg = pageCount;
    }
    else {
      currStrtPg = currEndPg + 1;
      currEndPg = currEndPg + pagination_cnts;
      renderTable(currStrtPg - 1);
      initPagination();
    }
    
    console.log("currStrtPg =>" + currStrtPg);
    console.log("currEndPg =>" + currEndPg);
  }

  

function setCurrPage(liTag){
  console.log("setCurrPage");
  console.log(liTag.text);
  
  renderTable((liTag.text * pgSz) - 1);
  liTag.parentNode.classList.add('active'); 
  
}

function initPagination()
{
  var nav = ' <li><a href="#" aria-label="Previous" onclick="previous(this);"> <span aria-hidden="true">&laquo;</span></a></li>';
  for (var s=currStrtPg; s<=currEndPg; s++){
      if (s ==  currStrtPg)
        nav += '<li class="numeros' + ' active ' + '"><a href="#" onclick="setCurrPage(this);">' + (s)+'</a></li>';
      else 
        nav += '<li class="numeros"><a href="#" onclick="setCurrPage(this);">' + (s)+'</a></li>';
  }

  nav += '<li><a href="#" aria-label="Next" onclick="next();">  <span aria-hidden="true">&raquo;</span></a></li>';

  $pagination.innerHTML = nav;
}

renderTable(firstRow);

initPagination();

  

  
