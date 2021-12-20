
// global view point
const map = L.map('mapid').setView([30, -30],3);
const Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});
Esri_WorldStreetMap.addTo(map);

//map.dragging.disable();


function generateMarker(){
    demolist.forEach((entry) => {
        const latM_c = entry.geometry.coordinates[1][1];
        const lngM_c = entry.geometry.coordinates[1][0];
        const loc = entry.properties.colonial_location;
        //console.log(loc);
        var marker_c = L.marker([latM_c,lngM_c]);
        var popup_c = marker_c.bindPopup(loc).openPopup();

        marker_c.addTo(map);
    
        const latM_o = entry.geometry.coordinates[0][1];
        const lngM_o = entry.geometry.coordinates[0][0];
        const ori = entry.properties.origin;
        //console.log(ori);
        var marker_o = L.marker([latM_o,lngM_o]);
        var popup_o = marker_o.bindPopup(ori).openPopup();
        marker_o.addTo(map);
      });
  }

generateMarker();

function generateList() {
    const ul = document.querySelector('.list');
    const cityset = new Set();
    demolist.forEach((entry) => {
      /console.log(entry.properties);/
      const li = document.createElement('li');
      const div = document.createElement('div');
      const a = document.createElement('a');
      const p = document.createElement('p');
      const ori = document.createElement('h8');
      const col_loc = document.createElement('h8');
      const draw = document.createElement('button');
      const full = document.createElement('p');
      col_loc.addEventListener('click', () => {
        const opt = "col";
          flyTo(entry,opt);
      });
      ori.addEventListener('click', () => {
        const opt = "ori";
        flyTo(entry, opt);
    });
    a.addEventListener('click', () => {
      drawLine(entry);
      });
      draw.addEventListener('click', () => {
        drawLine(entry);
        });
      div.classList.add('entry-item');
      date = "";
      if(entry.properties.date !== null){
        date = "("+ entry.properties.date +")";
      }
      a.innerText = entry.properties.person + ' ' + date;
      a.href = '#';
      p.innerText = "";
      ori.innerText = entry.properties.origin;
     //ori.setAttribute('id', 'city');
      col_loc.innerText = entry.properties.colonial_location;
      draw.innerText = "➠";
      full.innerText = entry.properties.full_entry;
  
      div.appendChild(a);
      div.appendChild(p);
      div.appendChild(ori);
      cityset.add(entry.properties.origin);
      div.appendChild(draw);
      div.appendChild(col_loc);
      div.appendChild(full);
      li.appendChild(div);
      ul.appendChild(li);

    });
    console.log(cityset);
    const dropdown = document.getElementById('citiesDropdown');
    cityset.forEach((city)=>{
      const option = document.createElement('option');
      option.innerText = city;
      dropdown.appendChild(option);
    });
  }

  generateList();

  function filterList() {
    // Variables
    let dropdown, ul, li, city, filter;
    dropdown = document.getElementById("citiesDropdown");
    ul = document.querySelector('.list');
    li = ul.getElementsByTagName("li");
    filter = dropdown.value;
    //console.log(li);
    //console.log('filter:' + filter);
  
    // Loops through rows and hides those with countries that don't match the filter
    for (i = 0; i < li.length; i++) { // `for...of` loops through the NodeList
      city = li[i].getElementsByTagName("h8")[0];
      //console.log(city);
      // if the filter is set to 'All', or this is the header row, or text matches filter
      if (filter === "All" || !city || (filter === city.textContent)) {
        li[i].style.display = ""; // shows this row
      }
      else {
        li[i].style.display = "none"; // hides this row
      }
    }
  }
  
  function filterMarker() {
    // Variables
    let dropdown, ul, li, city, filter;
    dropdown = document.getElementById("citiesDropdown");
    ul = document.querySelector('.list');
    li = ul.getElementsByTagName("li");
    filter = dropdown.value;
    //console.log(li);
    //console.log('filter:' + filter);
  
    // Loops through rows and hides those with countries that don't match the filter
    for (i = 0; i < li.length; i++) { // `for...of` loops through the NodeList
      city = li[i].getElementsByTagName("h8")[0];
      //console.log(city);
      // if the filter is set to 'All', or this is the header row, or text matches filter
      if (filter === "All" || !city || (filter === city.textContent)) {
        li[i].style.display = ""; // shows this row
      }
      else {
        li[i].style.display = "none"; // hides this row
      }
    }
  }

function makePopupContent(entry) {
  console.log(entry.properties);
    date = "";
    if(entry.properties.date !== null){
        date = "(" + entry.properties.date +")";
    }
    activities = "See full entry";
    if(entry.properties.activities !== null){
      activities = "";
      entry.properties.activities.forEach((a) =>{
          activities += a + ', ';
      });}
    return `
      <div>
          <h5>${entry.properties.person}${date}</h5>
          <p>Origin: ${entry.properties.origin}</p>
          <p>Colonial Location: ${entry.properties.colonial_location}</p>
          <p>Activities: ${activities}</p>
      </div>
    `;
  }

function flyTo(entry, opt) {
  let lat;
  let lng;
    if(opt == "col") {
      lat = entry.geometry.coordinates[1][1];
      lng = entry.geometry.coordinates[1][0];
    } else {
      lat = entry.geometry.coordinates[0][1];
      lng = entry.geometry.coordinates[0][0];
    }
    
    //console.log(lat)
    map.flyTo([lat, lng], 8, {
        duration: 2
    });
    setTimeout(() => {
        L.popup({closeButton: true, offset: L.point(0, -8)})
        .setLatLng([lat, lng])
        .setContent(makePopupContent(entry))
        .openOn(map);
    }, 1000);
}

function drawLine(entry) {
    
    var cor_s = [entry.geometry.coordinates[0][1], entry.geometry.coordinates[0][0]];
    var cor_e = [entry.geometry.coordinates[1][1], entry.geometry.coordinates[1][0]];
    var latlngs = [ cor_s,cor_e ];
    //console.log(latlngs );
    
    var polyline = L.polyline(latlngs, {color: '#404040'})
    var info = makePopupContent(entry);
    polyline.bindPopup(info);
    polyline.addTo(map);
    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());
    polyline.openPopup();
    polyline.on('click', function () {
        map.removeLayer(this);
    });
    
    
}

// function onEachFeature(feature, layer) {
//     layer.bindPopup(makePopupContent(feature), 
//     { closeButton: false, offset: L.point(0, -8) });
// }

// const geoLayer = L.geoJSON(demolist, {
//     onEachFeature: onEachFeature,
//     pointToLayer: function(feature, latlng) {
//         return L.marker(latlng);
//     }
// });
// geoLayer.addTo(map);
