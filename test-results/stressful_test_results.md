# test:

````
Edge Case Characters Stress Test

1. Standard ASCII
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789
!@#$%^&*()_+-=[]{}|;:',.<>/?`~
2. Extended Latin / Accents
á à â ä ã å æ ç é è ê ë í ì î ï ñ ó ò ô ö õ ø œ ú ù û ü ÿ ß
À Á Â Ã Ä Å Æ Ç È É Ê Ë Ì Í Î Ï Ñ Ò Ó Ô Õ Ö Ø Ù Ú Û Ü Ý Ÿ

3. RTL Text / Arabic / Hebrew
مرحبا שלום עולם

4. Multiplication, Division, and other symbols
× ÷ ± ≠ ≤ ≥ ∞ ∑ ∏ √ ∫ ∆ ∂

5. Smart Quotes and Dashes
“ ” ‘ ’ – — 

6. Emojis
😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 🥳

7. Zero-width & Invisible Characters
ZWSP​ ZWNJ‍ ZWJ‍ LRM‎ RLM‏ BOM﻿  

8. Surrogate Pairs & Rare Unicode
𐍈 𠀋 𠜎 𡈽 𤭢 𧿹

9. HTML entity examples (decoded)
& × < > © ® ™ € £ ¥

10. Stress repeat line
× ÷ ± × ÷ ± × ÷ ± × ÷ ± × ÷ ± × ÷ ± × ÷ ±

````
# output:

````
est:
Edge Case Characters Stress Test
1. Standard ASCII
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789
!@#$%^&*()_+-=[]{}|;:',.<>/?`~
2. Extended Latin / Accents
                      o       
                      O      
3. RTL Text / Arabic / Hebrew
m  
4. Multiplication, Division, and other symbols
x / +/-          
5. Smart Quotes and Dashes
" " ' ' - -- 
6. Emojis
7. Zero-width & Invisible Characters
ZWSP ZWNJ ZWJ LRM RLM BOM  
8. Surrogate Pairs & Rare Unicode
9. HTML entity examples (decoded)
& x < >    EUR GBP JPY
10. Stress repeat line
x / +/- x / +/- x / +/- x / +/- x / +/- x / +/- x / +/
output:
Edge Case Characters Stress Test
. Standard ASCII ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopgrstuvwxyz 0123456789
!@#$%^&`0_+-=[0|:',.<>/?`~
 Extended Latin / Accents   a   e i o oy B   E ElfI
OOUUYY
. RTL Text/ Arabic / Hebrew& pZb'B&U&Y
. Multiplication, Division, and other symbols x + +& & &B&&8&'&
. Smart Quotes and Dashes ""'- 
Emojis&&&&8&&&&&&&&D& YS
Zero-width & Invisible Characters& &Z&W&8&B2&&&&&M8
 Surrogate Pairs & Rare Unicode&&RBbB
. HTML entity examples (decoded) & x <>TM EE
" Stress repeat line x + * x++/- x + +/- x + +/- x + +/- x + * x+*
````