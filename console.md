# BEFORE:

`````
---
title:Quotation Test Template
client:Test Client
date:2026-02-12
---

#PROJECT REPORT
###PROJECT INFO
Some intro text without proper spacing.
##Project Details
- Client:Test Client
+ Location:Riyadh
-Project Type:Commercial
+Quality Level:Mid Range


----
##Scope Breakdown
###1.External Works
|Supplier|Product|Unit|Price|Notes|
|---|---|---|---|---|
|ABC Co|Cement Plaster|Bag|25|Local|
|XYZ Co|External Paint|18L|180|Weather resistant|
>Important note without spacing
```javascript
const price=250;
function calc(a,b){
return a+b;
}
```
-First item
+Second item
- Third item
Some text
>Another quote
| Item | Unit | Price |
| --- | --- | --- |
| Granite | m2 | 95 |
| Marble | m2 | 120 |
----
##Financial Summary
Subtotal:100000 SAR
VAT:15000 SAR
Total:115000 SAR


###Approval
Name:Client Representative
Date:12-02-2026
```yaml
project: test
status: draft
```
Extra line follows.
`````

------------------

# AFTER:
`````
---
title:Quotation Test Template
client:Test Client
date:2026-02-12
---

#PROJECT REPORT
###PROJECT INFO
Some intro text without proper spacing.
##Project Details

* Client:Test Client
* Location:Riyadh
-Project Type:Commercial
+Quality Level:Mid Range

---
##Scope Breakdown
###1.External Works

 | Supplier | Product | Unit | Price | Notes | 
 | --- | --- | --- | --- | --- | 
 | ABC Co | Cement Plaster | Bag | 25 | Local | 
 | XYZ Co | External Paint | 18L | 180 | Weather resistant | 

>Important note without spacing

```javascript
const price=250;
function calc(a,b){
return a+b;
}
```
-First item
+Second item

* Third item
Some text

>Another quote

 | Item | Unit | Price | 
 | --- | --- | --- | 
 | Granite | m2 | 95 | 
 | Marble | m2 | 120 | 

---
##Financial Summary
Subtotal:100000 SAR
VAT:15000 SAR
Total:115000 SAR

###Approval
Name:Client Representative
Date:12-02-2026

```yaml
project: test
status: draft
```
Extra line follows.
`````