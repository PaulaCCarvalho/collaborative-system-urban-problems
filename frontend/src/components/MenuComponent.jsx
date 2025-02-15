const MenuComponent = () => {
  return (
    <div className="flex flex-row items-center justify-between px-10 bg-zinc-800 h-12 text-white">
      <div className="font-extrabold">LOGO</div>

      <div className="flex font-semibold">
        <button
          type="button"
          className="mr-5 hover:underline hover:underline-offset-8 hover:text-violet-300"
        >
          Cadastrar
        </button>
        <button
          type="button"
          className="px-4 py-1 bg-violet-600 rounded-md hover:bg-violet-700"
        >
          Logar
        </button>
      </div>
    </div>
  );
};

export default MenuComponent;
