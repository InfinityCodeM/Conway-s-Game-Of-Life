/*
 * JUEGO DE LA VIDA DE CONWAY. (TABLA).
 */ 

//Variables globales.
var rows = 24;		//FILAS:
var cols = 24;		//COLUMNAS.

var cellW = 8;		//ANCHO DE CELDA.
var cellH = 8;		//ALTO DE CELDA.
//Degradado de color de acuerdo a la edad.
var ageColor = ["#00FF00",
				"#11FF11",
				"#22FF22",
				"#33FF33",
				"#44FF44",
				"#55FF55",
				"#66FF66",
				"#77FF77",
				"#88FF88",
				"#99FF99",
				"#AAFFAA",
				"#BBFFBB",
				"#CCFFCC",
				"#DDFFDD",
				"#EEFFEE",
				"#FFFFFF"];

//Tablero.
let tab;
var gen = 0; //GENERACIONES.

//Bucle
let mloop; //IDENTIFICADOR DEL BUCLE PRINCIPAL.

//Clase que define a la célula.
class cell{

	//Constructor.
	constructor(row, col, estate){
		this.cId = "c"+row+col;
		this.r = row;				//FILA.
		this.c = col;				//COLUMNA.
		this.e = estate;			//ESTADO. 1 = VIVO, 0 = MUERTO.
		this.eSig = this.estate;	//ESTADO PARA LA SIGUIENTE GENERACION.
		this.a = 0;					//Edad.
		this.v;						//VECINOS.
	}
	
	//Método para dibujar la célula.
	draw(){
		if(this.e == 0){ //Si está muerta, la dibujo oscura.
			document.querySelector("#c"+this.r+"-"+this.c).style.backgroundColor = "black";
		}else{ //En caso contrario blanca.
			document.querySelector("#c"+this.r+"-"+this.c).style.backgroundColor = ageColor[this.a];
		}
	}
	
	/*Método para editar la célula.
	edit(){
		if(this.e == 0){
			this.e = 1;
			this.a = 0;
			document.querySelector("#c"+this.r+this.c).style.backgroundColor = ageColor[this.a];
		}else{
			this.e = 0;
			this.a = 0;
			document.querySelector("#c"+this.r+this.c).style.backgroundColor = "black";
		}
	}*/
	
	//Método para calcular la siguiente generación, aplicando las reglas originales de Conway.
	sigGen(){
		
		//Siguiente estado. Por defecto el actual.
		this.eSig = this.e;
		
		//Para almacenar la suma de los vecinos.
		var vecs = 0;
		
		this.v.forEach(function(cVec){
			vecs = +vecs + cVec.e;
		});
		
		//MUERTE: si tiene menos de dos o más de tres vecinos.
		if(vecs < 2 || vecs > 3){
			this.eSig = 0;
		}
		
		//VIDA: si tiene tres vecinos.
		if(vecs == 3){
			this.eSig = 1;
		}
		
		//Si la célula está viva, y en la próxima generación también lo estará, entonces aumento la edad.
		if(this.e == 1 && this.eSig == 1){
			this.a = this.a + 1
			if(this.a == 16){ //Si la edad es 16, la dejo en 15.
				this.a = 15;
			}
		}
		
		//Si la célula está viva, pero en la generación próxima estará muerta, restablezco la edad a 0;
		if(this.e == 1 && this.eSig == 0){
			this.a = 0;
		}
	}
	
	//Para cambiar el estado.
	mut(){
		this.e = this.eSig;
	}
}

function foward(){

	//Borro el tablero.
	document.querySelector("#tablero").querySelectorAll("td").forEach(function(node){
		node.backgroundColor = 'rgb(50, 50, 50)';
	});
	
	//Calculo la siguiente generacion.
	tab.forEach(function(row){
		row.forEach(function(cel){
			cel.sigGen();
		});
	});
	
	//Aplico las mutación y dibujo las células.
	tab.forEach(function(row){
		row.forEach(function(cel){
			cel.mut();
			cel.draw();
		});
	});
	
	//Aumento el número de generación.
	document.querySelector("#gens").value = gen;
	gen++;
}

//Funcion para inicializar el tablero.
function init(){
	
	//Creo el arreglo donde se almacenarán las celdas, con tamaño definido por la cantidad de filas.
	tab = new Array(rows);
	
	//Para cada elemento cre un arreglo con tamaño definido por la cantidad de columnas, volviéndolo tridimensional.
	for(i = 0; i < rows; i++){
		tab[i] = new Array(cols);
	}
	
	//En inicializo cada elemento del tablero como una celda, asigno un estado aleatorio y la dibujo.
	for(i = 0; i < rows; i++){
		for(j = 0; j < cols; j++){
			est = Math.round(Math.random()*10) % 2;
			tab[i][j] = new cell(i, j, est);
			tab[i][j].draw();
		}
	}
	
	//Agrego las celdas vecinas de cada una.
	tab.forEach(function(row){
		row.forEach(function(cel){
			
			//Tamaño del arreglo. Por defecto en 8.
			var tVec = 8;
			
			//Posiciones iniciales. Por defecto en -1;
			var xIni = -1; var yIni = -1;
			
			//Posiciones finales. Por defecto en 2;
			var xFin = 2; var yFin = 2;
			
			//Dependiendo de la posiciones, ajusto las iniciales y las finales.
			//Si la celda está en la primera fila, empiezo en la fila 0.
			if(cel.r == 0){ xIni = 0; }
			
			//Si está en la primera columna, empiezo en la columna 0.
			if(cel.c == 0){ yIni = 0; }
			
			//Si la celda está en la última fila, termino la fila en 1;
			if(cel.r == rows-1){ xFin = 1; }
			
			//Si la celda está en la última columna, termino la columna en 1.
			if(cel.c == cols-1){ yFin = 1; }
			
			//Defino el tamaño del arreglo.
			//Si la celda se encuentra en la primera fila...
			if(cel.r == 0){
				tVec = tVec - 3; //Resto 3 elementos, que no existen.
				if(cel.c == 0){ //Y si, a su vez, está en la primera columna, resto los otros dos.
					tVec = tVec - 2;
				}
			}else if(cel.c == 0){ //Si por el contrario, está solo en la primera columna, resto 3 elementos.
				tVec = tVec - 3;
			}
			
			//Si la celda está en la última fila...
			if(cel.r == rows-1){
				tVec = tVec - 3; //Resto los 3 elementos inexistentes.
				if(cel.c == cols-1){ //Si además está en la última columna, resto los dos faltantes.
					tVec = tVec - 2;
				}
			}else if(cel.c == cols-1){ //Si está solo en la última columna, resto 3 elementos.
				tVec = tVec - 3;
			}
			
			//Defino el arreglo de vecinos.
			cel.v = new Array(tVec);
			
			var vec = 0; //Contador individual para el arreglo de vecinos.
			
			for(vi = xIni; vi < xFin; vi++){ //Recorro las filas, a partir de la posición relativa respecto a la celda actual.
				for(vj = yIni; vj < yFin; vj++){ //Igual con las columnas.
					
					//Si la posición relativa es 0, continuo el bucle, la celda no puede ser su propia vecina.
					if(vi == 0 && vj == 0){ continue; }
					
					vx = +cel.r + vi; //Calculo la posición absoluta de la celda vecina.
					vy = +cel.c + vj;
					
					//Si el elemento es indefinido, no existe, continuo el bucle.
					if(tab[vx][vy] == undefined){ continue; }
					
					cel.v[vec] = tab[vx][vy]; //Asigno esa celda al arreglo de vecinos.
					
					vec = vec + 1; //Aumento el contador.
				}
			}
		});
	});
}

//Funcion para inicializar el tablero.
function create(){

	//Defino la variable que almacenará el código HTML.
	var t = "";
	
	//Bucle para crear el código HTML de la estructura del tablero (tabla).
	for(i = 0; i < rows; i++){ //Filas.
		t = t + "<tr>";
		for(j = 0; j < cols; j++){ //Columnas.
			t = t + "<th id=\"c"+i+"-"+j+"\"> </th>"
		}
		t = t + "<tr>";
	}
	
	//Asigno la estructura HTML a la tabla.
	document.querySelector("#tablero").innerHTML = t;
	
	//Defino el estilo de las celdas.
	document.querySelector("#tablero").querySelectorAll("th").forEach(function(node){
		node.style.width = cellW+"px";
		node.style.height = cellH+"px";
		node.style.border = "1px solid black";
	});
	
	//Muesrto el log.
	console.log("Se ha creado el tablero. Tamaño: "+rows+"x"+cols+". "+(rows*cols)+" celdas.");
	
	//Llamo a la función de inicialización.
	init();
	
	//Bucle principal. Ahora empieza pausado. Descomentar para iniciar con el bucle.
	//mloop = setInterval(foward, Math.round(1000/25));
}

//Función para restablecer el tablero.
function reset(){
	
	//Detengo el intervalo.
	clearInterval(mloop);
	
	//Restablezco la generacion.
	gen = 0;
	
	//Elimino las células.
	for(i = 0; i < rows; i++){
		for(j = 0; j < cols; j++){
			delete tab[i][j];
		}
	}
	
	//Elimino el tablero.
	tab.splice(0);
	
	//Restablesco las estructuras HTML.
	document.querySelector("#tablero").innerHTML = '';
	document.querySelector("#gens").value = 0;
	
	//Llamo a la función de creación del tablero.
	create();
}


function edit(id){
	
	clearInterval(mloop);
	
	id = id.replaceAll("-", "");
	
	console.log(id);
	
	var cll;
	
	for(i = 0; i < rows; i++){
		for(j = 0; j < cols; j++){
			if(tab[i][j].cId == id){
				cll = tab[i][j];
				break;
			}
		}
	}
	
	if(cll.e == 0){
		cll.e = 1;
		cll.a = 0;
	}else{
		cll.e = 0;
		cll.a = 0;
	}
}
