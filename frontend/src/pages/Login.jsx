const Login = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-zinc-200">
      <div className="flex flex-col gap-4 p-7 bg-zinc-700 w-sm text-white rounded-lg">
        <span className="font-semibold text-xl mb-2">Login</span>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-start font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Insira seu email"
            className="bg-white rounded-sm text-black py-1 px-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="senha" className="text-start font-medium">
            Senha
          </label>
          <input
            type="password"
            name="senha"
            placeholder="Insira sua senha"
            className="bg-white rounded-sm text-black py-1 px-2"
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="font-bold px-4 py-2 bg-violet-600 rounded-md hover:bg-violet-700"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
