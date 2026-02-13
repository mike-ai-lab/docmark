# Validation Test

This file contains intentional markdown errors to test the validation feature.

## Broken Image Syntax
![alt text](

## Broken Link Syntax
[click here](

## Unclosed HTML Tag
<div>This div is not closed

## Invalid Header (too many #'s)
####### This is invalid

## Unclosed Code Block
```javascript
function test() {
  console.log("no closing backticks");

## Empty Alt Text
![](https://example.com/image.png)

## Table Without Header
| --- | --- |
| data | data |

## Valid Markdown (for comparison)
This is **bold** and this is *italic*.

![Valid Image](https://example.com/valid.png)

[Valid Link](https://example.com)

```python
# Valid code block
print("Hello World")
```
