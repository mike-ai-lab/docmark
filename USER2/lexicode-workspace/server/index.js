require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { chatWithAI, applyPatch, getAvailableModels } = require('./services/ai.service');
const { exportToDocx, exportToExcel } = require('./utils/export');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get available AI models
app.get('/api/ai/models', (req, res) => {
    try {
        const models = getAvailableModels();
        res.json({ models });
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ error: error.message });
    }
});

// Unified AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { conversationHistory, currentFile, modelId } = req.body;
        
        console.log('🤖 [BACKEND] Received AI chat request');
        console.log('📝 Conversation length:', conversationHistory?.length);
        console.log('📂 Current file:', currentFile?.name || 'None');
        console.log('🎯 Model:', modelId);
        
        if (!conversationHistory || !Array.isArray(conversationHistory)) {
            return res.status(400).json({ error: 'Missing conversation history' });
        }
        
        const result = await chatWithAI(conversationHistory, currentFile, modelId);
        
        console.log('✅ [BACKEND] AI response received');
        console.log('🎬 Action:', result.action);
        console.log('💬 Message length:', result.message?.length);
        console.log('📋 Changes:', result.changes ? 'Yes' : 'No');
        
        // Process the action
        let updatedContent = null;
        let createdFiles = null;
        
        if (result.action === 'edit' && result.changes && result.changes.files && result.changes.files[0]) {
            console.log('✏️ [BACKEND] Processing edit action');
            const patches = result.changes.files[0].patches;
            if (patches && currentFile && currentFile.content !== undefined) {
                updatedContent = applyPatch(currentFile.content, patches);
                console.log('✅ [BACKEND] Patches applied');
            }
        } else if (result.action === 'create' && result.changes && result.changes.files) {
            console.log('📁 [BACKEND] Processing create action');
            createdFiles = result.changes.files;
            console.log('📊 [BACKEND] Files to create:', createdFiles.length);
            
            // Validate files have content
            const validFiles = [];
            createdFiles.forEach((file, index) => {
                const hasContent = file.content && file.content.length > 0;
                console.log(`📄 [BACKEND] File ${index + 1}:`, {
                    name: file.name,
                    type: file.type,
                    path: file.path,
                    hasContent: hasContent,
                    contentLength: file.content?.length || 0
                });
                
                if (!hasContent) {
                    console.warn(`⚠️ [BACKEND] WARNING: File "${file.name}" has EMPTY content! This should not happen.`);
                } else {
                    validFiles.push(file);
                }
            });
            
            if (validFiles.length === 0) {
                console.error('❌ [BACKEND] ERROR: All files have empty content! AI did not generate content properly.');
                throw new Error('AI failed to generate file content. Please try again or rephrase your request.');
            }
            
            if (validFiles.length < createdFiles.length) {
                console.warn(`⚠️ [BACKEND] WARNING: ${createdFiles.length - validFiles.length} file(s) had empty content and were skipped.`);
            }
            
            createdFiles = validFiles;
        } else {
            console.log('ℹ️ [BACKEND] No file action (action:', result.action, ')');
        }
        
        const response = {
            success: true,
            action: result.action,
            message: result.message,
            summary: result.changes?.summary,
            updatedContent,
            createdFiles,
            usage: result.usage || null
        };
        
        console.log('📤 [BACKEND] Sending response:', {
            action: response.action,
            hasMessage: !!response.message,
            hasCreatedFiles: !!response.createdFiles,
            filesCount: response.createdFiles?.length || 0
        });
        
        res.json(response);
    } catch (error) {
        console.error('❌ [BACKEND] AI Chat Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export to DOCX
app.post('/api/export/docx', async (req, res) => {
    try {
        const { content } = req.body;
        const buffer = await exportToDocx(content);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=document.docx');
        res.send(buffer);
    } catch (error) {
        console.error('DOCX Export Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export to Excel
app.post('/api/export/excel', async (req, res) => {
    try {
        const { data } = req.body;
        const buffer = await exportToExcel(data);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
        res.send(buffer);
    } catch (error) {
        console.error('Excel Export Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 LexiCode Server running on http://localhost:${PORT}`);
});
