// Persona.js

class Persona {
  constructor(nombre, fechanac, telefono, email) {
    this.id = this.generarId();
    this.nombre = nombre;
    this.fechanac = fechanac;
    this.telefono = telefono;
    this.email = email;
  }

  // Método para generar un id aleatorio de 5 caracteres
  generarId() {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      id += caracteres.charAt(randomIndex);
    }
    return id;
  }

  // Métodos get
  getId() {
    return this.id;
  }

  getNombre() {
    return this.nombre;
  }

  getFechanac() {
    return this.fechanac;
  }

  getTelefono() {
    return this.telefono;
  }

  getEmail() {
    return this.email;
  }

  // Métodos set
  setId(id) {
    this.id = id;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }

  setFechanac(fechanac) {
    this.fechanac = fechanac;
  }

  setTelefono(telefono) {
    this.telefono = telefono;
  }

  setEmail(email) {
    this.email = email;
  }
}

// Exportar la clase Persona para poder usarla en otros archivos
module.exports = Persona;
