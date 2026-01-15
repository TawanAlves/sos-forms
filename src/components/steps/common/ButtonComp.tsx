// 1. Definição da interface de propriedades (props) do componente
interface ButtonProps {
  isBack: boolean;
  onReturn?: boolean;
  disabled?: boolean; // 'disabled' agora é opcional, pois nem sempre é necessário.
  onClick?: () => void; // Ação a ser executada ao clicar.
}

// 2. O componente funcional 'Button'
export function Button({ isBack,onReturn = false, disabled = false, onClick }: ButtonProps) {
  // 3. Renderização condicional
  // Se 'isBack' for true, renderiza o botão de voltar.
  if (isBack) {
    return (
      // <div className="w-full mb-6">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span>←</span>
        <span>Voltar</span>
      </button>
      // </div>
    );
  }

   else if (onReturn) {
    return (
      // <div className="w-full mb-6">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span>Outro Elemento</span>
      </button>
      // </div>
    );
  }

  // 4. Se 'isBack' for false, renderiza o botão de continuar.
  // Note o uso de um template literal para as classes, o que facilita a lógica condicional.
  return (
    //  <div className="w-full mb-6">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-lg transition-colors ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      <span>Continuar</span>
      <span>→</span>
    </button>
    //  </div>
  );
}
