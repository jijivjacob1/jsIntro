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

cityList = Array.from((new Set(dataSet.map(d=>d.city)))).sort();
stateList = Array.from((new Set(dataSet.map(d=>d.state)))).sort();
countryList = Array.from((new Set(dataSet.map(d=>d.country)))).sort();
shapeList = Array.from((new Set(dataSet.map(d=>d.shape)))).sort();

function setSelection(selectedObj,selection){
  event.preventDefault();

  switch(selection) {
    case "state":
        $stateInput.value = selectedObj.text;
        break;
    case "country":
        $countryInput.value = selectedObj.text;
        break;
    case "shape":
        $shapeInput.value = selectedObj.text;
        break;
    case "city":
        $cityInput.value = selectedObj.text;
        break;
    default:
        
  }

  
}
d3.select("#Ulstate").selectAll("li").data(stateList).enter().append('li')
.append('a').attr("href","#").attr("onclick","setSelection(this,'state')").text(d => d);

d3.select("#Ulcountry").selectAll("li").data(countryList).enter().append('li','country')
.append('a').attr("href","#").attr("onclick","setSelection(this,'country')").text(d => d);

d3.select("#Ulshape").selectAll("li").data(shapeList).enter().append('li')
.append('a').attr("href","#").attr("onclick","setSelection(this,'shape')").text(d => d);

d3.select("#Ulcity").selectAll("li").data(cityList).enter().append('li')
.append('a').attr("href","#").attr("onclick","setSelection(this,'city')").text(d => d);



// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);

// Set filteredAddresses to addressData initially
var filteredUfoData = dataSet;


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
        if (j == 0 ) {
          var dtSplit = ufoData[field].split("/");
          // test = Date.parse(ufoData[field]);
          $cell.innerText = dtSplit[0].padStart(2,'0') + "/" + dtSplit[1].padStart(2,'0') +  "/" + dtSplit[2];
        }
        else
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

    // Format the user's search by removing leading and trailing whitespace, lowercase the string
  
    var filterCriteria = getFilterCriteria();
   
 
    
  
    // Set filteredAddresses to an array of all addresses whose "state" matches the filter
    filteredUfoData = dataSet.filter(function(ufoData) {
  
    var filterColumns = "" ;
    for(i = 0; i < columnsToFilter.length ; i++){
      if (columnsToFilter[i] == "datetime"){
        var dtSplit = ufoData[columnsToFilter[i]].split("/");
        // console.log((dtSplit[2] + "-" + dtSplit[0].padStart(2,'0') + "-" +dtSplit[1].padStart(2,'0')));
        filterColumns += (dtSplit[2] + "-" + dtSplit[0].padStart(2,'0') + "-" +dtSplit[1].padStart(2,'0'));
      }
      else
       filterColumns += ufoData[columnsToFilter[i]].toLowerCase();
    }
   
   
      // If true, add the address to the filteredAddresses, otherwise don't add it to filteredAddresses
      return ((filterColumns === filterCriteria));
    });
    renderTable(firstRow);
    
    pageCount = Math.ceil(filteredUfoData.length / pgSz);
    
    currStrtPg = 1;
    if (pageCount < pagination_cnts)
      currEndPg = pageCount;
    else
      currEndPg = pagination_cnts;
    initPagination();
  }

  function previous(liTagPrev){
 
    
    
    if ((currStrtPg - pagination_cnts) < 1 ) {
      // currStrtPg = 1;
      // currEndPg = 10;
      liTagPrev.class="disabled";
    }
    else{
    currEndPg = currStrtPg - 1;
    currStrtPg = currStrtPg - pagination_cnts;
   
    //renderTable(currStrtPg - 1);
    renderTable((currStrtPg - 1) * pgSz  )
    initPagination();
    }
  }

  function next(liTagNext){
  
    
    
    if ((currStrtPg + pagination_cnts ) > pageCount ) {
      // currEndPg = pageCount;
      liTagNext.class="disabled";
    }
    else {
      currStrtPg = currEndPg + 1;
      currEndPg = currEndPg + pagination_cnts;
      if (currEndPg  > pageCount ) currEndPg = pageCount;
      renderTable((currStrtPg - 1) * pgSz );
      initPagination();
    }
    

  }

function deactivateAllPgntn(){
  var items = $pagination.getElementsByTagName("li");

  for (var i = 0; i < items.length; ++i) {
    items[i].classList.remove('active');
  } 
}


function setCurrPage(aiTag){

  
  renderTable((aiTag.text - 1) * pgSz  ); 
  
  
  aiTag.parentNode.classList.add('active'); 
  
}

function initPagination()
{
 
  var nav = ' <li><a href="#" aria-label="Previous" onclick="previous(this);"> <span aria-hidden="true">&laquo;</span></a></li>';
  for (var s=currStrtPg; s<=currEndPg; s++){
      if (s ==  currStrtPg)
        nav += '<li class="numeros' + ' active ' + '"><a href="#" onclick="setCurrPage(this);">' + (s)+'</a></li>';
      else 
        nav += '<li class="numeros"><a href="#" onclick="deactivateAllPgntn();setCurrPage(this);">' + (s)+'</a></li>';
  }

  nav += '<li><a href="#" aria-label="Next" onclick="next(this);">  <span aria-hidden="true">&raquo;</span></a></li>';

  $pagination.innerHTML = nav;
}



renderTable(firstRow);

initPagination();

  

  
