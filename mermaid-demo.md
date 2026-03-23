# Mermaid.js Diagram Examples

This document demonstrates various Mermaid diagram types rendered in the Markdown editor.

## Flowchart

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    User->>Browser: Enter URL
    Browser->>Server: HTTP Request
    Server-->>Browser: HTML Response
    Browser-->>User: Render Page
```

## Class Diagram

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Error: Fail
    Success --> [*]
    Error --> Idle: Retry
```

## Gantt Chart

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements    :a1, 2024-01-01, 7d
    Design         :a2, after a1, 5d
    section Development
    Backend        :b1, after a2, 10d
    Frontend       :b2, after a2, 12d
    section Testing
    QA Testing     :c1, after b1, 5d
```

## Pie Chart

```mermaid
pie title Programming Languages Usage
    "JavaScript" : 45
    "Python" : 30
    "Java" : 15
    "Other" : 10
```

## Entity Relationship Diagram

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
        string phone
    }
    ORDER {
        int orderNumber
        date orderDate
        string status
    }
    LINE-ITEM {
        int quantity
        decimal price
    }
```

## Git Graph

```mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
```

## Journey Diagram

```mermaid
journey
    title User Shopping Experience
    section Browse
      Visit website: 5: User
      Search products: 4: User
      View details: 5: User
    section Purchase
      Add to cart: 4: User
      Checkout: 3: User
      Payment: 2: User
    section Post-Purchase
      Confirmation: 5: User
      Delivery: 4: User, Courier
```

---

## Testing Error Handling

This is an intentionally broken diagram to test error handling:

```mermaid
graph TD
    A[Start] --> B[Missing closing bracket
    B --> C[End
```

---

**Note:** All diagrams above should render automatically. If you see code blocks instead of diagrams, check the browser console for errors.
