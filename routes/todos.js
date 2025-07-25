import express from 'express';
import { authenticateJWT } from '../middlewares/authenticate.js';
import supabaseClient from '../supabaseClient.js';

const router = express.Router();

// GET all todos for authenticated user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    console.log('User in GET /todos:', req.user);
    const { data, error } = await supabaseClient
      .from('todos')
      .select('*')
      .eq('user_id', req.user.userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET todo by id for authenticated user
router.get('/:id', authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    console.log('User in GET /todos/:id:', req.user);
    const { data, error } = await supabaseClient
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ message: 'Todo not found' });
      throw error;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create todo for authenticated user
router.post('/', authenticateJWT, async (req, res) => {
  const { title, done = false, description = null, depends_on = null, section_id = null, deadline = null } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    console.log('User in POST /todos:', req.user);
    const { data, error } = await supabaseClient
      .from('todos')
      .insert([{
        title,
        done,
        description,
        depends_on,
        section_id,
        deadline,
        user_id: req.user.userId
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update todo by id for authenticated user (full update)
router.put('/:id', authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, done, description, depends_on, section_id, deadline } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    console.log('User in PUT /todos/:id:', req.user);

    // Verify todo exists for user
    const { data: existingTodo, error: findError } = await supabaseClient
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') return res.status(404).json({ message: 'Todo not found' });
      throw findError;
    }

    const { data, error } = await supabaseClient
      .from('todos')
      .update({ title, done, description, depends_on, section_id, deadline })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH partial update todo by id for authenticated user
router.patch('/:id', authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);
  const updates = { ...req.body };

  // Remove id and user_id from updates if present (for safety)
  delete updates.id;
  delete updates.user_id;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  try {
    console.log('User in PATCH /todos/:id:', req.user);

    // Verify todo exists for user
    const { data: existingTodo, error: findError } = await supabaseClient
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') return res.status(404).json({ message: 'Todo not found' });
      throw findError;
    }

    // Check if done changes from false to true
    if (
      'done' in updates &&
      updates.done === true &&
      existingTodo.done === false
    ) {
      updates.closed_at = new Date().toISOString();
    }

    // Optional: if done changed from true to false, clear closed_at
    if (
      'done' in updates &&
      updates.done === false &&
      existingTodo.done === true
    ) {
      updates.closed_at = null;
    }

    // Update only fields passed in body
    const { data, error } = await supabaseClient
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// DELETE todo by id for authenticated user
router.delete('/:id', authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    console.log('User in DELETE /todos/:id:', req.user);
    // Verify todo exists for user
    const { data: existingTodo, error: findError } = await supabaseClient
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') return res.status(404).json({ message: 'Todo not found' });
      throw findError;
    }

    const { error } = await supabaseClient
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.userId);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
