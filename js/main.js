//VARIABLES
position = 1
personalityAnswers = window.sessionStorage //Variable tipo array donde almacenaremos las respuestas del usuario

function checkTestResults(personality) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;
            var xmlContent = xmlDoc.getElementsByTagName("personalidad_tipo")

            document.body.innerHTML = ""
            var section = document.createElement("section")
            document.body.appendChild(section)
            section.setAttribute("id", "personalidad")
            var div1 = document.createElement("div")
            var div2 = document.createElement("div")
            section.appendChild(div1)
            section.appendChild(div2)
            var name = document.createElement("h3")
            var desc = document.createElement("p")
            div1.appendChild(name)
            div2.appendChild(desc)
            var button = document.createElement("button")
            button.setAttribute("id", "restartTest")
            button.innerHTML = "reiniciar test"
            section.appendChild(button)
            console.log(personality)

            button.addEventListener("click", function(event) {
                personalityAnswers.clear()
                resultadoPersonalidad = ""
                window.location.reload()
            })

            for (let index = 0; index < xmlContent.length; index++) {
                if (xmlContent[index].getElementsByTagName("tipo")[0].childNodes[0].nodeValue == personality) {
                    name.innerHTML = xmlContent[index].getElementsByTagName("personalidad")[0].childNodes[0].nodeValue
                    desc.innerHTML = xmlContent[index].getElementsByTagName("descripcion")[0].childNodes[0].nodeValue
                } else {
                    continue
                }

            }
        }
    };
    xhttp.open("GET", "xml/testB.xml", true);
    xhttp.send();
}


function cargarTest(test, question, title, p1, p2) {
    var ajax1 = new XMLHttpRequest();
    ajax1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj0 = this.responseText;
            var obj1 = JSON.parse(obj0);
            var obj2 = obj1["preguntas"];
            var resultado = "";


            //Controla que no nos pasemos de posiciones
            if (question == 0) {
                position = 1
            }
            if (question > obj2.length) {
                position = obj2.length
            }
            for (let i = 0; i < obj2.length; i++) {
                /*
                Para todos los objetos que encontremos en json generaremos un valor en resultado
                con el código html para inyectarlo en la página después y ahorrar los tiempos de carga
                */
                if (question === obj2[i].id) {
                    //Incorporamos a nuestro HTML los resultados del json
                    document.getElementById("title").innerHTML = obj2[i].pregunta
                    document.getElementById("lp1").innerHTML = obj2[i].respuestas[0]
                    document.getElementById("lp2").innerHTML = obj2[i].respuestas[1]
                    document.getElementById("pregunta").innerHTML = "Pregunta " + (i + 1) + " de " + obj2.length
                    document.test.reset()
                }

            }


        }
    };
    ajax1.open("GET", "json/test.json");
    ajax1.send();
}

window.addEventListener("load", function(event) {
    /*
    Null --> Null
    */
    resultadoPersonalidad = ""
    const testView = document.getElementById("test")
    cargarTest(testView, position, title, p1, p2)
    this.document.getElementById("back").addEventListener("click", function(event) {
        position--
        cargarTest(testView, position)
    })
    this.document.getElementById("forward").addEventListener("click", function(event) {
        position++
        cargarTest(testView, position)
    })
    var rad = document.test.preg;
    for (var i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function() {
            if (personalityAnswers.getItem(position) == null) {
                personalityAnswers.setItem((position), this.value)
            } else {
                personalityAnswers.removeItem((position))
                personalityAnswers.setItem((position), this.value)
            }
        });
    }
    this.document.getElementById("end").addEventListener("click", function(event) {
        checkAnswers()
    })
})

function checkAnswers() {
    var ajax1 = new XMLHttpRequest();
    ajax1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj0 = this.responseText;
            var obj1 = JSON.parse(obj0);
            var obj2 = obj1["preguntas"];
            resultadoPersonalidad = ""
            for (let index = 0; index < obj2.length; index++) {


                if (personalityAnswers.getItem(index + 1) == null) {
                    resultadoPersonalidad = ""
                    alert("Debes rellenar todas las preguntas, falta la pregunta: " + (index + 1))
                    break
                } else {
                    resultadoPersonalidad += obj2[index].respuestas[personalityAnswers.getItem((index + 1)) - 1].substring(0, 1)
                    console.log(resultadoPersonalidad)
                    if (index == 3) {
                        console.log("Comprobamos respuesta")
                        checkTestResults(resultadoPersonalidad.substring(0, 4))
                    }
                }

            }



        }
    };
    ajax1.open("GET", "json/test.json");
    ajax1.send();
}