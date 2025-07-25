export default class Section {
    /**
     * Representa uma seção que agrupa tarefas.
     * @param {number} id - Identificador único da seção.
     * @param {string} name - Nome da seção.
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}