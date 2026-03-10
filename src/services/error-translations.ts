export const translateFirebaseError = (error: any): string => {
  const code = error?.code || "";
  
  switch (code) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique o e-mail informado.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/invalid-email':
      return 'O formato do e-mail é inválido.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está sendo utilizado por outra conta.';
    case 'auth/operation-not-allowed':
      return 'Operação não permitida pelo servidor.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Ela deve ter pelo menos 6 caracteres.';
    case 'auth/network-request-failed':
      return 'Falha na conexão com a internet.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas malsucedidas. Tente novamente mais tarde.';
    case 'auth/invalid-credential':
      return 'Credenciais inválidas. Verifique seu e-mail e senha.';
    case 'permission-denied':
      return 'Você não tem permissão para realizar esta ação.';
    case 'unavailable':
      return 'O serviço está temporariamente indisponível. Verifique sua conexão.';
    case 'failed-precondition':
      return 'A operação falhou (pré-condição). Verifique se os índices estão ativos.';
    
    default:
      let message = error?.message || 'Ocorreu um erro inesperado.';
      return message.replace(/Firebase: /g, '').replace(/\(auth\/.*\)\./g, '').trim();
  }
};
