export default class Todo {
    /**
     * @param {number} id - Task ID.
     * @param {string} title - Task title.
     * @param {boolean} done - Completion status.
     * @param {string|null} description - Task details.
     * @param {number|null} depends_on - ID of prerequisite task.
     * @param {number|null} section_id - Related section ID.
     * @param {string|null} created_at - Creation date (ISO).
     * @param {string|null} deadline - Optional due date (ISO).
     * @param {string|null} closed_at - Completion date (ISO).
     */
    constructor(
        id,
        title,
        done = false,
        description = null,
        depends_on = null,
        section_id = null,
        created_at = null,
        deadline = null,
        closed_at = null
    ) {
        this.id = id;
        this.title = title;
        this.done = done;
        this.description = description;
        this.depends_on = depends_on;
        this.section_id = section_id;
        this.created_at = created_at;
        this.deadline = deadline;
        this.closed_at = closed_at;
    }
}
