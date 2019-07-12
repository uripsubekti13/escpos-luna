import Luna from "../src/Luna";

async function print(lines: string[]) {
  const escpos = new Luna();
  await escpos.addLogo('../a.png')
  await escpos.addLines(lines);

  const buffer = await escpos.getBuffer();
  return buffer;
}

print(['tes', '1', '2', '3'])
.then((buffer: Buffer) => {
  console.log(buffer)
})