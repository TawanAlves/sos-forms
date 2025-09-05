'use client';

interface NavigationConfirmModalProps {
  isOpen: boolean;
  targetStepName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function NavigationConfirmModal({ isOpen, targetStepName, onConfirm, onCancel }: NavigationConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6" style={{ borderColor: 'var(--color-slate-200)', borderWidth: '1px' }}>
        <div className="flex items-center mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: 'var(--color-sky-100)' }}
          >
            <span className="text-2xl">🔄</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-slate-900)' }}>
              Confirmar Navegação
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-slate-600)' }}>
              Você tem certeza?
            </p>
          </div>
        </div>

        <p className="mb-6" style={{ color: 'var(--color-slate-700)' }}>
          Você está prestes a voltar para <strong>&quot;{targetStepName}&quot;</strong>.
          Os dados já preenchidos não serão perdidos, mas você poderá editá-los novamente.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg transition-colors font-medium"
            style={{
              color: 'var(--color-slate-600)',
              backgroundColor: 'var(--color-slate-100)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-slate-200)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-slate-100)';
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white rounded-lg transition-colors font-medium"
            style={{
              background: `linear-gradient(135deg, var(--color-sky-500), var(--color-blue-600))`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, var(--color-sky-600), var(--color-blue-600))`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, var(--color-sky-500), var(--color-blue-600))`;
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
