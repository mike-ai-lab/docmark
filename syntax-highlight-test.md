# Syntax Highlighting Test

## JavaScript

```javascript
const greeting = "Hello, World!";
function sayHello(name) {
    console.log(`Hello, ${name}!`);
    return true;
}
sayHello("DocMark");
```

## Python

```python
def calculate_sum(a, b):
    """Calculate the sum of two numbers"""
    result = a + b
    print(f"The sum is: {result}")
    return result

calculate_sum(10, 20)
```

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p class="intro">This is a test.</p>
</body>
</html>
```

## CSS

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    padding: 20px;
}

.button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 4px;
}
```

## JSON

```json
{
    "name": "DocMark",
    "version": "1.0.0",
    "features": [
        "syntax highlighting",
        "live preview",
        "dark mode"
    ],
    "settings": {
        "theme": "dark",
        "autoSave": true
    }
}
```

## SQL

```sql
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'completed'
ORDER BY orders.total DESC
LIMIT 10;
```

## Bash

```bash
#!/bin/bash
echo "Building project..."
npm install
npm run build
echo "Build complete!"
```

## No Language Specified

```
This is a code block without a language.
It should still be formatted as code.
But without syntax highlighting.
```
