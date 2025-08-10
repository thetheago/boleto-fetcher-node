export function checkEnv(requiredVars: string[]) {
  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente faltando: ${missing.join(", ")}`
    );
  }
}
