# ESC/POS library

## Usage example:

```javascript
import Luna from "escpos-luna/Luna";

const escpos = await new Luna();
await escpos.addLogo("./images/a.png");
const lines: string[] = ["Tes", "1", "2", "3"];
await escpos.addLines(lines);

// this buffer is ready to send to the printer
const buffer = await escpos.getBuffer();
```
