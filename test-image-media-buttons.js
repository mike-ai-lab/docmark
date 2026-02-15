/**
 * Playwright Test for + Image and + Media buttons
 * Tests the foldable format and auto-folding functionality
 */

const { chromium } = require('playwright');
const path = require('path');

async function testImageAndMediaButtons() {
    console.log('🚀 Starting Image and Media Button Tests...\n');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Navigate to the app
        console.log('📍 Navigating to http://localhost:5001');
        await page.goto('http://localhost:5001');
        await page.waitForTimeout(2000); // Wait for Monaco to load
        
        // Wait for Monaco editor to be ready
        console.log('⏳ Waiting for Monaco editor to load...');
        await page.waitForSelector('.monaco-editor', { timeout: 10000 });
        await page.waitForTimeout(1000);
        
        // Clear any existing content
        console.log('🧹 Clearing editor content...');
        await page.evaluate(() => {
            if (window.editor) {
                window.editor.setValue('');
            }
        });
        await page.waitForTimeout(500);
        
        // ========================================
        // TEST 1: + Image Button
        // ========================================
        console.log('\n📸 TEST 1: Testing + Image Button');
        console.log('─'.repeat(50));
        
        // Click the + Image button
        console.log('  ➤ Clicking "+ Image" button...');
        const imageButtonClick = page.click('#insert-image-button');
        
        // Handle the width prompt
        page.once('dialog', async dialog => {
            console.log(`  ➤ Width prompt appeared: "${dialog.message()}"`);
            await dialog.accept('400');
        });
        
        await imageButtonClick;
        await page.waitForTimeout(500);
        
        // Handle the height prompt
        page.once('dialog', async dialog => {
            console.log(`  ➤ Height prompt appeared: "${dialog.message()}"`);
            await dialog.accept('300');
        });
        
        await page.waitForTimeout(1000);
        
        // Check the inserted content
        const imageContent = await page.evaluate(() => {
            return window.editor ? window.editor.getValue() : '';
        });
        
        console.log('  ➤ Inserted content:');
        console.log('    ' + imageContent.split('\n').join('\n    '));
        
        // Verify format (trim to ignore leading/trailing whitespace)
        const trimmedContent = imageContent.trim();
        const hasCorrectFormat = trimmedContent.startsWith('<div>') && 
                                 trimmedContent.includes('<img src=') && 
                                 trimmedContent.endsWith('</div>') &&
                                 trimmedContent.split('\n').length >= 3; // At least 3 lines
        console.log(`  ➤ Correct foldable format: ${hasCorrectFormat ? '✅' : '❌'}`);
        
        // Check if folding icon appears
        const hasFoldingIcon = await page.evaluate(() => {
            const foldingIcons = document.querySelectorAll('.monaco-editor .folding');
            return foldingIcons.length > 0;
        });
        console.log(`  ➤ Folding icon present: ${hasFoldingIcon ? '✅' : '❌'}`);
        
        // ========================================
        // TEST 2: + Media Button with Image
        // ========================================
        console.log('\n🖼️  TEST 2: Testing + Media Button (Image Upload)');
        console.log('─'.repeat(50));
        
        // Clear editor
        await page.evaluate(() => {
            if (window.editor) {
                window.editor.setValue('');
            }
        });
        await page.waitForTimeout(500);
        
        // Create a test image file
        console.log('  ➤ Preparing test image file...');
        const testImagePath = path.join(__dirname, 'test-image.png');
        
        // Click + Media button and upload file
        console.log('  ➤ Clicking "+ Media" button...');
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.click('#insert-media-button')
        ]);
        
        // Note: This will fail if test-image.png doesn't exist
        // You can create a small test image or skip this part
        console.log('  ➤ File chooser opened (skipping actual upload in this test)');
        
        // ========================================
        // TEST 3: Manual Base64 Insertion
        // ========================================
        console.log('\n🔢 TEST 3: Testing Manual Base64 Auto-Fold');
        console.log('─'.repeat(50));
        
        // Clear editor
        await page.evaluate(() => {
            if (window.editor) {
                window.editor.setValue('');
            }
        });
        await page.waitForTimeout(500);
        
        // Insert base64 content manually
        console.log('  ➤ Inserting base64 image manually...');
        const base64Content = `<div>
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" width="300" />
</div>`;
        
        await page.evaluate((content) => {
            if (window.editor) {
                window.editor.setValue(content);
            }
        }, base64Content);
        
        await page.waitForTimeout(1500); // Wait for auto-fold
        
        // Check if auto-folded
        const isFolded = await page.evaluate(() => {
            const foldedRegions = document.querySelectorAll('.monaco-editor .folded');
            return foldedRegions.length > 0;
        });
        console.log(`  ➤ Base64 auto-folded: ${isFolded ? '✅' : '❌'}`);
        
        // ========================================
        // SUMMARY
        // ========================================
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Image button format: ${hasCorrectFormat ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Folding icon present: ${hasFoldingIcon ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Base64 auto-fold: ${isFolded ? 'PASS' : 'FAIL'}`);
        console.log('='.repeat(50));
        
        console.log('\n✨ Tests completed! Browser will close in 5 seconds...');
        await page.waitForTimeout(5000);
        
    } catch (error) {
        console.error('\n❌ Test failed with error:', error);
    } finally {
        await browser.close();
        console.log('\n👋 Browser closed.');
    }
}

// Run the test
testImageAndMediaButtons().catch(console.error);
