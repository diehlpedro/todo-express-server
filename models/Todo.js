export default class Todo {
    /**
     * Representa uma tarefa do tipo TO DO.
     * @param {number} id - Identificador único da tarefa.
     * @param {string} title - Título da tarefa.
     * @param {boolean} done - Status da tarefa (concluída ou não).
     * @param {string|null} description - Descrição detalhada da tarefa.
     * @param {number|null} depends_on - ID de outra tarefa da qual esta depende.
     * @param {number|null} section_id - ID da seção à qual essa tarefa pertence.
     */
    constructor(id, title, done = false, description = null, depends_on = null, section_id = null) {
        this.id = id;
        this.title = title;
        this.done = done;
        this.description = description;
        this.depends_on = depends_on;
        this.section_id = section_id;
    }
}
