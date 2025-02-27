const Footer = () => {
  return (
    <div className="flex justify-center items-center bg-white/90 backdrop-blur-sm h-5">
      <div className="text-xs text-gray-80">
        &copy; {new Date().getFullYear()} Problemas Urbanos BH. Todos os
        direitos reservados.
      </div>
    </div>
  );
};

export default Footer
