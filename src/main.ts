class Teste {
  constructor(
    public usuario: string,
    public senha: string
  ) {}
}

const a = new Teste('abc', 'ad');

console.log('teste');
console.log(a.usuario);
console.log(a.senha);