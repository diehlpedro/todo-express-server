import express from 'express';
import { authenticateJWT } from '../middlewares/authenticate.js';
import supabaseClient from '../supabaseClient.js';

const router = express.Router();

// GET all sections for authenticated user
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const { data, error } = await supabaseClient
            .from('sections')
            .select('*')
            .eq('user_id', req.user.userId);

        if (error) throw error;

        res.json(data || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET section by id for authenticated user
router.get('/:id', authenticateJWT, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid section ID' });

    try {
        const { data, error } = await supabaseClient
            .from('sections')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return res.status(404).json({ message: 'Section not found' });
            throw error;
        }

        if (!data) return res.status(404).json({ message: 'Section not found' });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create section for authenticated user
router.post('/', authenticateJWT, async (req, res) => {
    const { name, color } = req.body;
    if (!name || !color) return res.status(400).json({ message: 'Name and color are required' });

    try {
        const { data, error } = await supabaseClient
            .from('sections')
            .insert([{ name, color, user_id: req.user.userId }])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update section by id for authenticated user
router.put('/:id', authenticateJWT, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid section ID' });

    const { name, color } = req.body;
    if (!name || !color) return res.status(400).json({ message: 'Name and color are required' });

    try {
        // Check if section exists for user
        const { data: existingSection, error: findError } = await supabaseClient
            .from('sections')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.userId)
            .single();

        if (findError) {
            if (findError.code === 'PGRST116') return res.status(404).json({ message: 'Section not found' });
            throw findError;
        }

        const { data, error } = await supabaseClient
            .from('sections')
            .update({ name, color })
            .eq('id', id)
            .eq('user_id', req.user.userId)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE section by id for authenticated user
router.delete('/:id', authenticateJWT, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid section ID' });

    try {
        // Check if section exists for user
        const { data: existingSection, error: findError } = await supabaseClient
            .from('sections')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.userId)
            .single();

        if (findError) {
            if (findError.code === 'PGRST116') return res.status(404).json({ message: 'Section not found' });
            throw findError;
        }

        const { error } = await supabaseClient
            .from('sections')
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
