export default class User {
    /**
     * Representa um usuário autenticado.
     * @param {string} id - ID único do usuário (ex: Google ID).
     * @param {string} email - Email do usuário.
     * @param {string} name - Nome completo do usuário.
     */
    constructor(id, email, name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
}
