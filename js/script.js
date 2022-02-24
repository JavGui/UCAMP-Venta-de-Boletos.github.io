const container = document.querySelector('.container');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
let ticketPrecio = parseFloat(movieSelect.value);
let movieIndex = parseInt(movieSelect.selectedIndex);

populateUI();
updateSelectedCount();

// Se actualizan los asientos seleccionados y se calcula el total a pagar
function updateSelectedCount()
{
  const asientos = document.querySelectorAll('.row .seat');
  const asientosSeleccionados = document.querySelectorAll('.row .seat.selected'); 

  const asientosIndice = [...asientosSeleccionados].map((asientoElemento)=>[...asientos].indexOf(asientoElemento) )
  
  localStorage.setItem('seleccionadosAsientos', JSON.stringify(asientosIndice));

  const seleccionadoAsientosCount = asientosSeleccionados.length;
  count.innerText = seleccionadoAsientosCount;
  let importeTotal = seleccionadoAsientosCount * ticketPrecio;
  total.innerText = Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits: 2}).format(importeTotal);
};

// Al hacer click en el botón Comprar, se actualizan los asientos
function updateCompradosCount()
{
  const asientos = document.querySelectorAll('.row .seat');
  const asientosSeleccionados = document.querySelectorAll('.row .seat.selected');

  if (movieIndex === 0) { alert("No ha seleccionado una película"); return; }

  if(asientosSeleccionados === null || asientosSeleccionados.length === 0) { alert("No hay asientos seleccionados"); return; }

  if(!confirm("¿Confirma la compra de los boletos y los asientos seleccionados?")) { return; }

  const indiceSeleccionados = [...asientosSeleccionados].map((ocupadoElemento)=>[...asientos].indexOf(ocupadoElemento) )
  
  let pelicula = "Pelicula" + movieIndex;
  const arregloOcupados = JSON.parse(localStorage.getItem(pelicula));
  indiceSeleccionados.forEach((seat, index)=>
    {
      arregloOcupados.push(seat);
    });

  localStorage.setItem('seleccionadosAsientos', JSON.stringify([]));  
  localStorage.setItem(pelicula, JSON.stringify(arregloOcupados));

  asientos.forEach((seat, index)=>
    {
      if(indiceSeleccionados.indexOf(index) > -1)
      {
        seat.classList.remove("selected");
        seat.classList.add("occupied");
      }
    });

    updateSelectedCount();

    if(arregloOcupados.length === 48)
  {
    let mensaje = ">>>  No hay boletos disponibles  <<<";
    document.getElementById("mensaje").innerHTML = mensaje;
    document.getElementById("mensaje").style.visibility = "visible";
    return;
  }
  else
  {
    document.getElementById("mensaje").style.visibility = "hidden";  
  }
}

// Al cargar la página se cargan los valores guardados en el LocalStorage 
function populateUI()
{
  movieIndex = parseInt(localStorage.getItem('IndicePeliculaSeleccionada'));
  let pelicula = "Pelicula" + movieIndex;
  const asientos1 = document.querySelectorAll('.row .seat');
  const indicesOcupados = JSON.parse(localStorage.getItem(pelicula));
  document.getElementById("movie").selectedIndex = movieIndex;

  if(indicesOcupados !==null && indicesOcupados.length > 0)
  {
    asientos1.forEach((seat, index)=>
    {
      if(indicesOcupados.indexOf(index) > -1)
      {
        seat.classList.add('occupied');
      }
    });

    if(indicesOcupados.length === 48)
    {
      let mensaje = ">>>  No hay boletos disponibles  <<<";
      document.getElementById("mensaje").innerHTML = mensaje;
      document.getElementById("mensaje").style.visibility = "visible";
      return;
    }
    else
    {
      document.getElementById("mensaje").style.visibility = "hidden";
    }
  }

  const asientos2 = document.querySelectorAll('.row .seat');
  const indicesSeleccionados = JSON.parse(localStorage.getItem('seleccionadosAsientos'));
  
  if(indicesSeleccionados !==null && indicesSeleccionados.length > 0)
  {
    asientos2.forEach((seat, index)=>
    {
      if(indicesSeleccionados.indexOf(index) > -1)
      {
        seat.classList.add('selected');
      }
    });
  }

  ticketPrecio = parseFloat( localStorage.getItem('PrecioPeliculaSeleccionada'));
  movieIndex = parseInt(localStorage.getItem('IndicePeliculaSeleccionada'));

  if(movieIndex !== null && !isNaN(movieIndex))
  {
    document.getElementById("movie").selectedIndex = movieIndex; 
  }
  else
  {
    ticketPrecio = 0;
    movieIndex = 0;
    document.getElementById("movie").selectedIndex = "0"; 
  }  
}

// Evento cambio en la selección de película
movieSelect.addEventListener('change',(e)=>
{
  ticketPrecio = 0;
  movieIndex = 0;
  count.innerText = 0;
  total.innerText = 0;
  asientos = document.querySelectorAll('.row .seat');
  asientos.forEach((seat)=>
    {
      seat.classList.remove('selected');  
      seat.classList.remove('occupied');
    });

  ticketPrecio = parseFloat(e.target.value);
  movieIndex = parseInt(e.target.selectedIndex);
  localStorage.setItem('IndicePeliculaSeleccionada', movieIndex);
  localStorage.setItem('PrecioPeliculaSeleccionada', ticketPrecio);   
  recuperapelicula();
});

//Evento de click en los asientos  para seleccionar o quitar la selección
container.addEventListener('click',(e)=>
{
  if(movieIndex === 0)
  {
    alert("Debe elegir una película antes de seleccionar los asientos");
  }
  else
  {
    if(e.target.classList.contains('seat') && !e.target.classList.contains('occupied'))
    {
      e.target.classList.toggle('selected');  
      updateSelectedCount();
    }
  }
  
});

function recuperapelicula()
{
  document.getElementById("mensaje").style.visibility = "hidden";

  if(movieIndex > 0)
  {  
    asientos = document.querySelectorAll('.row .seat');
    asientos.forEach((seat)=>
      {
          seat.classList.remove('occupied');
      });
    const asientos1 = document.querySelectorAll('.row .seat');
    const indicesOcupados = JSON.parse(localStorage.getItem("Pelicula" + movieIndex));
    if(indicesOcupados !== null && indicesOcupados.length > 0)
    {
      asientos1.forEach((seat, index)=>
      {
        if(indicesOcupados.indexOf(index) > -1)
        {
          seat.classList.add('occupied');
        }
      });
      if(indicesOcupados.length === 48)
      {
        let mensaje = ">>>  No hay boletos disponibles  <<<";
        document.getElementById("mensaje").innerHTML = mensaje;
        document.getElementById("mensaje").style.visibility = "visible";
      }
    }
  }
}


// Limpia el Local Storage
function limpiar()
{
  localStorage.clear();
  localStorage.setItem('seleccionadosAsientos', JSON.stringify([]));
  localStorage.setItem('IndicePeliculaSeleccionada', "");
  localStorage.setItem('PrecioPeliculaSeleccionada', "");
  localStorage.setItem('Pelicula1', JSON.stringify([]));
  localStorage.setItem('Pelicula2', JSON.stringify([]));
  localStorage.setItem('Pelicula3', JSON.stringify([]));
  location.reload();
}
// Cierra la página
function salir() 
{
  localStorage.setItem('seleccionadosAsientos', JSON.stringify([]));
  localStorage.setItem('IndicePeliculaSeleccionada', "");
  localStorage.setItem('PrecioPeliculaSeleccionada', "");
  window.close();
}

function compraTodo()
{
  const asientos = document.querySelectorAll('.row .seat:not(.occupied)');
  asientos.forEach((seat)=>
      {
          seat.classList.add('selected');
      }); 
}



// let indice;
  // let k = 0;
  // let indAsientos = [];

  // for (let i = 0; i < seleccionadoAsientos.length; i++)
  // { 
  //   for(let j =0; j < asientos.length; j++)
  //   {    
  //     if(seleccionadoAsientos[i] === asientos[j])
  //     {  
  //       indice = [...asientos].indexOf(seleccionadoAsientos[i], k);
  //       indAsientos.push(indice);
  //       k = k + 1;
  //     }
  //   }
  // }

  // console.log(indAsientos);
