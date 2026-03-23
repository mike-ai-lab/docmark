# Mermaid.js Quick Start Guide

## 🚀 How to Use

Just write a code block with `mermaid` language tag:

````markdown
```mermaid
graph TD
    A[Start] --> B[End]
```
````

That's it! The diagram renders automatically.

---

## 📊 Common Diagram Types

### 1. Flowchart
````markdown
```mermaid
graph LR
    A[Square] --> B(Round)
    B --> C{Decision}
    C -->|Yes| D[Result 1]
    C -->|No| E[Result 2]
```
````

### 2. Sequence Diagram
````markdown
```mermaid
sequenceDiagram
    User->>API: Request
    API->>Database: Query
    Database-->>API: Data
    API-->>User: Response
```
````

### 3. Class Diagram
````markdown
```mermaid
classDiagram
    class User {
        +String name
        +String email
        +login()
    }
```
````

### 4. State Diagram
````markdown
```mermaid
stateDiagram-v2
    [*] --> Active
    Active --> Inactive
    Inactive --> [*]
```
````

### 5. Gantt Chart
````markdown
```mermaid
gantt
    title Project Schedule
    section Phase 1
    Task 1 :a1, 2024-01-01, 7d
    Task 2 :after a1, 5d
```
````

### 6. Pie Chart
````markdown
```mermaid
pie
    "Category A" : 40
    "Category B" : 35
    "Category C" : 25
```
````

---

## 💡 Tips

1. **Syntax matters** - Mermaid is strict about formatting
2. **Test first** - Use [mermaid.live](https://mermaid.live/) to test complex diagrams
3. **Errors show** - If syntax is wrong, you'll see a red error box
4. **Live updates** - Diagrams re-render as you type (with 300ms delay)
5. **Theme aware** - Diagrams automatically match light/dark mode

---

## 🎨 Styling

Diagrams automatically:
- Match your editor theme (light/dark)
- Center in the preview
- Scale responsively
- Work in paper layout mode

---

## 🔗 Learn More

- Full demo: `mermaid-demo.md`
- Documentation: `MERMAID-IMPLEMENTATION.md`
- Official docs: [mermaid.js.org](https://mermaid.js.org/)
