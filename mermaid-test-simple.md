# Mermaid Test - Copy from Website

## Example 1: Simple Flowchart

Wrap the code in ```mermaid blocks:

```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```

## Example 2: Sequence Diagram

```mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
```

## Example 3: Class Diagram

```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
```

## How to Use:

1. Copy mermaid code from https://mermaid.ai/
2. Paste it in your editor
3. Add ``` before and after
4. Add `mermaid` after the first ```
5. It will render!

## Wrong Way (Won't Render):
graph TD
    A --> B

## Right Way (Will Render):
```mermaid
graph TD
    A --> B
```
