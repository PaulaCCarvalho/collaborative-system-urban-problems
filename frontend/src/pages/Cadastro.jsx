import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { userSignUp } from "../core/requests";

const Cadastro = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await userSignUp(data);
    if (success) navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-cyan-200 flex flex-col justify-center items-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-lg rounded-lg sm:px-10">
          <h2 className="mb-4 text-center text-2xl font-extrabold text-gray-900">
            Cadastro de Usuário
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Campo Nome */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <div className="mt-1">
                <input
                  {...register("nome", { required: "Nome é obrigatório" })}
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.nome && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.nome.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  {...register("email", { required: "Email é obrigatório" })}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="mt-1">
                <input
                  {...register("senha", {
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres",
                    },
                  })}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.senha && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.senha.message}
                  </p>
                )}
              </div>
            </div>

            {/* Radio buttons para Tipo de Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Usuário
              </label>
              <div className="mt-1 flex items-center space-x-6">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    value="publico"
                    {...register("tipo", {
                      required: "Selecione o tipo de usuário",
                    })}
                    className="mr-2"
                  />
                  <span>Gestores públicos ou administradores municipais</span>
                </label>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    value="cidadao"
                    {...register("tipo", {
                      required: "Selecione o tipo de usuário",
                    })}
                    className="mr-2 "
                  />
                  <span>Cidadão</span>
                </label>
              </div>
              {errors.tipo && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.tipo.message}
                </p>
              )}
            </div>

            {/* Botão de envio */}
            <div className="my-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
