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
      .eq('user_id', req.user.userId);  // Use userId conforme JWT payload

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
  const { title, done = false, description = null, depends_on = null, section_id = null } = req.body;

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
        user_id: req.user.userId
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update todo by id for authenticated user
router.put('/:id', authenticateJWT, async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, done, description, depends_on, section_id } = req.body;

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
      .update({ title, done, description, depends_on, section_id })
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
